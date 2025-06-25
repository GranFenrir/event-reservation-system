import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Event, TicketPrice } from '../entities';
import { CreateEventDto, UpdateEventDto, EventQueryDto } from '../dto';
import { EventStatus } from '@event-reservation/shared';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(TicketPrice)
    private ticketPriceRepository: Repository<TicketPrice>,
    @Inject('KAFKA_SERVICE')
    private kafkaClient: ClientKafka,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const { ticketPrices, ...eventData } = createEventDto;

    // Validate dates
    if (eventData.startDate >= eventData.endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    if (eventData.saleStartDate >= eventData.saleEndDate) {
      throw new BadRequestException(
        'Sale start date must be before sale end date',
      );
    }

    if (eventData.saleEndDate > eventData.startDate) {
      throw new BadRequestException('Sale must end before event starts');
    }

    // Create event
    const event = this.eventRepository.create(eventData);
    const savedEvent = await this.eventRepository.save(event);

    // Create ticket prices
    const ticketPriceEntities = ticketPrices.map((ticketPrice) =>
      this.ticketPriceRepository.create({
        ...ticketPrice,
        eventId: savedEvent.id,
      }),
    );
    await this.ticketPriceRepository.save(ticketPriceEntities);

    // Emit event created message
    this.kafkaClient.emit('event.created', {
      eventId: savedEvent.id,
      event: savedEvent,
      timestamp: new Date(),
    });

    return this.findOne(savedEvent.id);
  }

  async findAll(query: EventQueryDto): Promise<{
    events: Event[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      search,
      category,
      status,
      venueId,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'startDate',
      sortOrder = 'ASC',
    } = query;

    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.venue', 'venue')
      .leftJoinAndSelect('event.ticketPrices', 'ticketPrices');

    this.applyFilters(queryBuilder, {
      search,
      category,
      status,
      venueId,
      startDate,
      endDate,
    });

    // Sorting
    const validSortFields = ['title', 'startDate', 'endDate', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'startDate';
    queryBuilder.orderBy(`event.${sortField}`, sortOrder);

    // Pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [events, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      events,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['venue', 'ticketPrices'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

    // Validate dates if provided
    const startDate = updateEventDto.startDate || event.startDate;
    const endDate = updateEventDto.endDate || event.endDate;
    const saleStartDate = updateEventDto.saleStartDate || event.saleStartDate;
    const saleEndDate = updateEventDto.saleEndDate || event.saleEndDate;

    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    if (saleStartDate >= saleEndDate) {
      throw new BadRequestException(
        'Sale start date must be before sale end date',
      );
    }

    if (saleEndDate > startDate) {
      throw new BadRequestException('Sale must end before event starts');
    }

    // Update event
    await this.eventRepository.update(id, updateEventDto);
    const updatedEvent = await this.findOne(id);

    // Emit event updated message
    this.kafkaClient.emit('event.updated', {
      eventId: id,
      event: updatedEvent,
      changes: updateEventDto,
      timestamp: new Date(),
    });

    return updatedEvent;
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);

    // Check if event can be deleted (no active reservations)
    if (event.soldSeats > 0) {
      throw new BadRequestException(
        'Cannot delete event with existing reservations',
      );
    }

    await this.eventRepository.remove(event);

    // Emit event deleted message
    this.kafkaClient.emit('event.deleted', {
      eventId: id,
      timestamp: new Date(),
    });
  }

  async updateStatus(id: string, status: EventStatus): Promise<Event> {
    const event = await this.findOne(id);

    await this.eventRepository.update(id, { status });
    const updatedEvent = await this.findOne(id);

    // Emit status change message
    this.kafkaClient.emit('event.status.changed', {
      eventId: id,
      oldStatus: event.status,
      newStatus: status,
      timestamp: new Date(),
    });

    return updatedEvent;
  }

  async updateSoldSeats(id: string, increment: number): Promise<Event> {
    const event = await this.findOne(id);
    const newSoldSeats = event.soldSeats + increment;

    if (newSoldSeats < 0) {
      throw new BadRequestException('Sold seats cannot be negative');
    }

    if (newSoldSeats > event.totalSeats) {
      throw new BadRequestException('Sold seats cannot exceed total seats');
    }

    await this.eventRepository.update(id, { soldSeats: newSoldSeats });
    return this.findOne(id);
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<Event>,
    filters: {
      search?: string;
      category?: string;
      status?: EventStatus;
      venueId?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ): void {
    const { search, category, status, venueId, startDate, endDate } = filters;

    if (search) {
      queryBuilder.andWhere(
        '(event.title ILIKE :search OR event.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category) {
      queryBuilder.andWhere('event.category = :category', { category });
    }

    if (status) {
      queryBuilder.andWhere('event.status = :status', { status });
    }

    if (venueId) {
      queryBuilder.andWhere('event.venueId = :venueId', { venueId });
    }

    if (startDate) {
      queryBuilder.andWhere('event.startDate >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('event.endDate <= :endDate', { endDate });
    }
  }
}

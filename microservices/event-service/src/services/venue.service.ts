import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Venue } from '../entities';
import { CreateVenueDto, UpdateVenueDto, VenueQueryDto } from '../dto';

@Injectable()
export class VenueService {
  constructor(
    @InjectRepository(Venue)
    private venueRepository: Repository<Venue>,
    @Inject('KAFKA_SERVICE')
    private kafkaClient: ClientKafka,
  ) {}

  async create(createVenueDto: CreateVenueDto): Promise<Venue> {
    const venue = this.venueRepository.create(createVenueDto);
    const savedVenue = await this.venueRepository.save(venue);

    // Emit venue created message
    this.kafkaClient.emit('venue.created', {
      venueId: savedVenue.id,
      venue: savedVenue,
      timestamp: new Date(),
    });

    return savedVenue;
  }

  async findAll(query: VenueQueryDto): Promise<{
    venues: Venue[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      search,
      city,
      country,
      minCapacity,
      maxCapacity,
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'ASC',
    } = query;

    const queryBuilder = this.venueRepository.createQueryBuilder('venue');

    this.applyFilters(queryBuilder, {
      search,
      city,
      country,
      minCapacity,
      maxCapacity,
    });

    // Sorting
    const validSortFields = ['name', 'city', 'capacity', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    queryBuilder.orderBy(`venue.${sortField}`, sortOrder);

    // Pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [venues, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      venues,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Venue> {
    const venue = await this.venueRepository.findOne({
      where: { id },
      relations: ['seats'],
    });

    if (!venue) {
      throw new NotFoundException(`Venue with ID ${id} not found`);
    }

    return venue;
  }

  async update(id: string, updateVenueDto: UpdateVenueDto): Promise<Venue> {
    await this.findOne(id); // Check if venue exists

    await this.venueRepository.update(id, updateVenueDto);
    const updatedVenue = await this.findOne(id);

    // Emit venue updated message
    this.kafkaClient.emit('venue.updated', {
      venueId: id,
      venue: updatedVenue,
      changes: updateVenueDto,
      timestamp: new Date(),
    });

    return updatedVenue;
  }

  async remove(id: string): Promise<void> {
    const venue = await this.venueRepository.findOne({
      where: { id },
      relations: ['events'],
    });

    if (!venue) {
      throw new NotFoundException(`Venue with ID ${id} not found`);
    }

    // Check if venue has active events
    if (venue.events && venue.events.length > 0) {
      throw new BadRequestException('Cannot delete venue with existing events');
    }

    await this.venueRepository.remove(venue);

    // Emit venue deleted message
    this.kafkaClient.emit('venue.deleted', {
      venueId: id,
      timestamp: new Date(),
    });
  }

  async findByLocation(city: string, country?: string): Promise<Venue[]> {
    const queryBuilder = this.venueRepository
      .createQueryBuilder('venue')
      .where('venue.city ILIKE :city', { city: `%${city}%` });

    if (country) {
      queryBuilder.andWhere('venue.country ILIKE :country', {
        country: `%${country}%`,
      });
    }

    return queryBuilder.getMany();
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<Venue>,
    filters: {
      search?: string;
      city?: string;
      country?: string;
      minCapacity?: number;
      maxCapacity?: number;
    },
  ): void {
    const { search, city, country, minCapacity, maxCapacity } = filters;

    if (search) {
      queryBuilder.andWhere(
        '(venue.name ILIKE :search OR venue.address ILIKE :search OR venue.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (city) {
      queryBuilder.andWhere('venue.city ILIKE :city', { city: `%${city}%` });
    }

    if (country) {
      queryBuilder.andWhere('venue.country ILIKE :country', {
        country: `%${country}%`,
      });
    }

    if (minCapacity) {
      queryBuilder.andWhere('venue.capacity >= :minCapacity', { minCapacity });
    }

    if (maxCapacity) {
      queryBuilder.andWhere('venue.capacity <= :maxCapacity', { maxCapacity });
    }
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, In } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Seat } from '../entities';
import {
  CreateSeatDto,
  CreateBulkSeatsDto,
  UpdateSeatDto,
  SeatQueryDto,
} from '../dto';
import { SeatStatus } from '@event-reservation/shared';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
    @Inject('KAFKA_SERVICE')
    private kafkaClient: ClientKafka,
  ) {}

  async create(createSeatDto: CreateSeatDto): Promise<Seat> {
    // Check for duplicate seat
    const existingSeat = await this.seatRepository.findOne({
      where: {
        venueId: createSeatDto.venueId,
        row: createSeatDto.row,
        number: createSeatDto.number,
        section: createSeatDto.section,
      },
    });

    if (existingSeat) {
      throw new BadRequestException(
        `Seat ${createSeatDto.section ? createSeatDto.section + '-' : ''}${createSeatDto.row}${createSeatDto.number} already exists`,
      );
    }

    const seat = this.seatRepository.create(createSeatDto);
    const savedSeat = await this.seatRepository.save(seat);

    // Emit seat created message
    this.kafkaClient.emit('seat.created', {
      seatId: savedSeat.id,
      seat: savedSeat,
      timestamp: new Date(),
    });

    return savedSeat;
  }

  async createBulk(createBulkSeatsDto: CreateBulkSeatsDto): Promise<Seat[]> {
    const { venueId, seats } = createBulkSeatsDto;

    // Check for duplicates within the batch and with existing seats
    const seatIdentifiers = seats.map(
      (seat) => `${seat.section || ''}-${seat.row}-${seat.number}`,
    );
    const duplicates = seatIdentifiers.filter(
      (id, index) => seatIdentifiers.indexOf(id) !== index,
    );

    if (duplicates.length > 0) {
      throw new BadRequestException(
        `Duplicate seats in batch: ${duplicates.join(', ')}`,
      );
    }

    const existingSeats = await this.seatRepository.find({
      where: { venueId },
    });

    const existingIdentifiers = existingSeats.map(
      (seat) => `${seat.section || ''}-${seat.row}-${seat.number}`,
    );

    const conflicts = seatIdentifiers.filter((id) =>
      existingIdentifiers.includes(id),
    );

    if (conflicts.length > 0) {
      throw new BadRequestException(
        `Seats already exist: ${conflicts.join(', ')}`,
      );
    }

    const seatEntities = seats.map((seat) =>
      this.seatRepository.create({ ...seat, venueId }),
    );

    const savedSeats = await this.seatRepository.save(seatEntities);

    // Emit bulk seats created message
    this.kafkaClient.emit('seats.bulk.created', {
      venueId,
      seats: savedSeats,
      count: savedSeats.length,
      timestamp: new Date(),
    });

    return savedSeats;
  }

  async findAll(query: SeatQueryDto): Promise<{
    seats: Seat[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      venueId,
      section,
      row,
      status,
      minPrice,
      maxPrice,
      page = 1,
      limit = 50,
      sortBy = 'row',
      sortOrder = 'ASC',
    } = query;

    const queryBuilder = this.seatRepository
      .createQueryBuilder('seat')
      .leftJoinAndSelect('seat.venue', 'venue');

    this.applyFilters(queryBuilder, {
      venueId,
      section,
      row,
      status,
      minPrice,
      maxPrice,
    });

    // Sorting
    const validSortFields = [
      'row',
      'number',
      'section',
      'basePrice',
      'createdAt',
    ];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'row';
    queryBuilder.orderBy(`seat.${sortField}`, sortOrder);

    // Add secondary sort by number for better ordering
    if (sortField !== 'number') {
      queryBuilder.addOrderBy('seat.number', 'ASC');
    }

    // Pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [seats, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      seats,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Seat> {
    const seat = await this.seatRepository.findOne({
      where: { id },
      relations: ['venue'],
    });

    if (!seat) {
      throw new NotFoundException(`Seat with ID ${id} not found`);
    }

    return seat;
  }

  async findByVenue(venueId: string): Promise<Seat[]> {
    return this.seatRepository.find({
      where: { venueId },
      order: { row: 'ASC', number: 'ASC' },
    });
  }

  async update(id: string, updateSeatDto: UpdateSeatDto): Promise<Seat> {
    await this.findOne(id); // Check if seat exists

    await this.seatRepository.update(id, updateSeatDto);
    const updatedSeat = await this.findOne(id);

    // Emit seat updated message
    this.kafkaClient.emit('seat.updated', {
      seatId: id,
      seat: updatedSeat,
      changes: updateSeatDto,
      timestamp: new Date(),
    });

    return updatedSeat;
  }

  async updateStatus(id: string, status: SeatStatus): Promise<Seat> {
    const seat = await this.findOne(id);

    await this.seatRepository.update(id, { status });
    const updatedSeat = await this.findOne(id);

    // Emit seat status changed message
    this.kafkaClient.emit('seat.status.changed', {
      seatId: id,
      oldStatus: seat.status,
      newStatus: status,
      timestamp: new Date(),
    });

    return updatedSeat;
  }

  async updateBulkStatus(
    seatIds: string[],
    status: SeatStatus,
  ): Promise<Seat[]> {
    await this.seatRepository.update({ id: In(seatIds) }, { status });

    const updatedSeats = await this.seatRepository.find({
      where: { id: In(seatIds) },
    });

    // Emit bulk status change message
    this.kafkaClient.emit('seats.bulk.status.changed', {
      seatIds,
      status,
      count: updatedSeats.length,
      timestamp: new Date(),
    });

    return updatedSeats;
  }

  async remove(id: string): Promise<void> {
    const seat = await this.findOne(id);

    // Check if seat can be deleted (not reserved or sold)
    if (seat.status !== SeatStatus.AVAILABLE) {
      throw new BadRequestException('Cannot delete seat that is not available');
    }

    await this.seatRepository.remove(seat);

    // Emit seat deleted message
    this.kafkaClient.emit('seat.deleted', {
      seatId: id,
      timestamp: new Date(),
    });
  }

  async generateSeats(
    venueId: string,
    rows: string[],
    seatsPerRow: number,
    section?: string,
    basePrice?: number,
  ): Promise<Seat[]> {
    const seats: CreateSeatDto[] = [];

    for (const row of rows) {
      for (let i = 1; i <= seatsPerRow; i++) {
        seats.push({
          row,
          number: i.toString(),
          section,
          basePrice,
          venueId,
        });
      }
    }

    return this.createBulk({ venueId, seats });
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<Seat>,
    filters: {
      venueId?: string;
      section?: string;
      row?: string;
      status?: SeatStatus;
      minPrice?: number;
      maxPrice?: number;
    },
  ): void {
    const { venueId, section, row, status, minPrice, maxPrice } = filters;

    if (venueId) {
      queryBuilder.andWhere('seat.venueId = :venueId', { venueId });
    }

    if (section) {
      queryBuilder.andWhere('seat.section = :section', { section });
    }

    if (row) {
      queryBuilder.andWhere('seat.row = :row', { row });
    }

    if (status) {
      queryBuilder.andWhere('seat.status = :status', { status });
    }

    if (minPrice) {
      queryBuilder.andWhere('seat.basePrice >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      queryBuilder.andWhere('seat.basePrice <= :maxPrice', { maxPrice });
    }
  }
}

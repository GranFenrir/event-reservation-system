import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationItem } from '../entities';
import {
  CreateReservationDto,
  UpdateReservationDto,
  ConfirmReservationDto,
  CancelReservationDto,
  ReservationQueryDto,
} from '../dto';
import { ReservationStatus } from '@event-reservation/shared';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(ReservationItem)
    private reservationItemRepository: Repository<ReservationItem>,
  ) {}

  async create(
    createReservationDto: CreateReservationDto
  ): Promise<Reservation> {
    // Calculate total amount
    const totalAmount = createReservationDto.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    // Set expiration time (15 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Create reservation
    const reservation = this.reservationRepository.create({
      userId: createReservationDto.userId,
      eventId: createReservationDto.eventId,
      totalAmount,
      expiresAt,
      notes: createReservationDto.notes,
      status: ReservationStatus.PENDING,
    });

    const savedReservation = await this.reservationRepository.save(reservation);

    // Create reservation items
    const items = createReservationDto.items.map(item =>
      this.reservationItemRepository.create({
        reservationId: savedReservation.id,
        seatId: item.seatId,
        ticketType: item.ticketType,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
      })
    );

    await this.reservationItemRepository.save(items);

    // TODO: Add event emission when Kafka is configured
    // For now, just return the reservation without emitting events

    return this.findOne(savedReservation.id);
  }

  async findAll(query: ReservationQueryDto): Promise<{
    data: Reservation[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryBuilder = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.items', 'items')
      .orderBy('reservation.createdAt', 'DESC');

    if (query.userId) {
      queryBuilder.andWhere('reservation.userId = :userId', {
        userId: query.userId,
      });
    }

    if (query.eventId) {
      queryBuilder.andWhere('reservation.eventId = :eventId', {
        eventId: query.eventId,
      });
    }

    if (query.status) {
      queryBuilder.andWhere('reservation.status = :status', {
        status: query.status,
      });
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return reservation;
  }

  async findByUser(userId: string): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByEvent(eventId: string): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { eventId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateReservationDto: UpdateReservationDto
  ): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status === ReservationStatus.CONFIRMED) {
      throw new BadRequestException('Cannot update confirmed reservation');
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('Cannot update cancelled reservation');
    }

    await this.reservationRepository.update(id, updateReservationDto);

    return this.findOne(id);
  }

  async confirm(
    confirmReservationDto: ConfirmReservationDto
  ): Promise<Reservation> {
    const reservation = await this.findOne(confirmReservationDto.reservationId);

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException(
        'Only pending reservations can be confirmed'
      );
    }

    if (reservation.isExpired) {
      throw new BadRequestException('Cannot confirm expired reservation');
    }

    await this.reservationRepository.update(reservation.id, {
      status: ReservationStatus.CONFIRMED,
      confirmedAt: new Date(),
    });

    // TODO: Add event emission when Kafka is configured
    // For now, just return the reservation without emitting events

    return this.findOne(reservation.id);
  }

  async cancel(
    cancelReservationDto: CancelReservationDto
  ): Promise<Reservation> {
    const reservation = await this.findOne(cancelReservationDto.reservationId);

    if (reservation.status === ReservationStatus.CONFIRMED) {
      throw new BadRequestException('Cannot cancel confirmed reservation');
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('Reservation is already cancelled');
    }

    await this.reservationRepository.update(reservation.id, {
      status: ReservationStatus.CANCELLED,
      cancelledAt: new Date(),
      notes: cancelReservationDto.reason || reservation.notes,
    });

    // TODO: Add event emission when Kafka is configured
    // For now, just return the reservation without emitting events

    return this.findOne(reservation.id);
  }

  async expireReservations(): Promise<void> {
    const expiredReservations = await this.reservationRepository.find({
      where: {
        status: ReservationStatus.PENDING,
      },
      relations: ['items'],
    });

    const expiredIds = expiredReservations
      .filter(reservation => reservation.isExpired)
      .map(reservation => reservation.id);

    if (expiredIds.length > 0) {
      await this.reservationRepository.update(expiredIds, {
        status: ReservationStatus.EXPIRED,
      });

      // TODO: Add event emission when Kafka is configured
      // For now, just update the status without emitting events
    }
  }

  async remove(id: string): Promise<void> {
    const reservation = await this.findOne(id);

    if (reservation.status === ReservationStatus.CONFIRMED) {
      throw new BadRequestException('Cannot delete confirmed reservation');
    }

    await this.reservationRepository.remove(reservation);
  }
}

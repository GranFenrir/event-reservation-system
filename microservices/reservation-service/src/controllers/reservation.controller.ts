import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { ReservationService } from '../services';
import {
  CreateReservationDto,
  UpdateReservationDto,
  ConfirmReservationDto,
  CancelReservationDto,
  ReservationQueryDto,
} from '../dto';

@Controller('reservations')
@UsePipes(new ValidationPipe({ transform: true }))
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  async findAll(@Query() query: ReservationQueryDto) {
    return this.reservationService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reservationService.findOne(id);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.reservationService.findByUser(userId);
  }

  @Get('event/:eventId')
  async findByEvent(@Param('eventId') eventId: string) {
    return this.reservationService.findByEvent(eventId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto
  ) {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Post('confirm')
  async confirm(@Body() confirmReservationDto: ConfirmReservationDto) {
    return this.reservationService.confirm(confirmReservationDto);
  }

  @Post('cancel')
  async cancel(@Body() cancelReservationDto: CancelReservationDto) {
    return this.reservationService.cancel(cancelReservationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.reservationService.remove(id);
  }

  // Kafka message handlers
  @MessagePattern('reservation.get')
  async getReservation(data: { id: string }) {
    return this.reservationService.findOne(data.id);
  }

  @MessagePattern('reservation.getByUser')
  async getReservationsByUser(data: { userId: string }) {
    return this.reservationService.findByUser(data.userId);
  }

  @MessagePattern('reservation.getByEvent')
  async getReservationsByEvent(data: { eventId: string }) {
    return this.reservationService.findByEvent(data.eventId);
  }

  @MessagePattern('reservation.create')
  async createReservation(data: CreateReservationDto) {
    return this.reservationService.create(data);
  }

  @MessagePattern('reservation.confirm')
  async confirmReservation(data: ConfirmReservationDto) {
    return this.reservationService.confirm(data);
  }

  @MessagePattern('reservation.cancel')
  async cancelReservation(data: CancelReservationDto) {
    return this.reservationService.cancel(data);
  }

  @EventPattern('payment.completed')
  async handlePaymentCompleted(data: {
    paymentId: string;
    reservationId: string;
    status: string;
  }) {
    if (data.status === 'success') {
      await this.reservationService.confirm({
        reservationId: data.reservationId,
        paymentId: data.paymentId,
      });
    } else {
      await this.reservationService.cancel({
        reservationId: data.reservationId,
        reason: 'Payment failed',
      });
    }
  }

  @EventPattern('payment.failed')
  async handlePaymentFailed(data: {
    paymentId: string;
    reservationId: string;
    reason: string;
  }) {
    await this.reservationService.cancel({
      reservationId: data.reservationId,
      reason: `Payment failed: ${data.reason}`,
    });
  }
}

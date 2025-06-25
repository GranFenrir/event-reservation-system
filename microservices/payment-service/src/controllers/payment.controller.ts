import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  Headers,
  RawBody,
} from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { PaymentService, StripeService } from '../services';
import { PaymentStatus } from '@event-reservation/shared';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
  ProcessPaymentDto,
  RefundPaymentDto,
  PaymentQueryDto,
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
} from '../dto';

@Controller('payments')
@UsePipes(new ValidationPipe({ transform: true }))
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly stripeService: StripeService
  ) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  async findAll(@Query() query: PaymentQueryDto) {
    return this.paymentService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Get('reservation/:reservationId')
  async findByReservation(@Param('reservationId') reservationId: string) {
    return this.paymentService.findByReservation(reservationId);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.paymentService.findByUser(userId);
  }

  @Post('process')
  async process(@Body() processPaymentDto: ProcessPaymentDto) {
    return this.paymentService.process(processPaymentDto);
  }

  @Post('refund')
  async refund(@Body() refundPaymentDto: RefundPaymentDto) {
    return this.paymentService.refund(refundPaymentDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto
  ) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.paymentService.remove(id);
  }

  // Payment Methods endpoints
  @Post('methods')
  async createPaymentMethod(
    @Body() createPaymentMethodDto: CreatePaymentMethodDto
  ) {
    return this.paymentService.createPaymentMethod(createPaymentMethodDto);
  }

  @Get('methods/user/:userId')
  async findPaymentMethodsByUser(@Param('userId') userId: string) {
    return this.paymentService.findPaymentMethodsByUser(userId);
  }

  @Patch('methods/:id')
  async updatePaymentMethod(
    @Param('id') id: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto
  ) {
    return this.paymentService.updatePaymentMethod(id, updatePaymentMethodDto);
  }

  @Delete('methods/:id')
  async removePaymentMethod(@Param('id') id: string) {
    return this.paymentService.removePaymentMethod(id);
  }

  // Stripe webhook endpoint
  @Post('webhook/stripe')
  async handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @RawBody() payload: Buffer
  ) {
    try {
      const event = await this.stripeService.handleWebhook(payload, signature);

      // Handle different webhook events
      switch (event.type) {
        case 'payment_intent.succeeded':
          // Handle successful payment
          console.log('Payment succeeded:', event.data.object);
          break;
        case 'payment_intent.payment_failed':
          // Handle failed payment
          console.log('Payment failed:', event.data.object);
          break;
        case 'charge.dispute.created':
          // Handle chargeback
          console.log('Chargeback created:', event.data.object);
          break;
        default:
          console.log('Unhandled event type:', event.type);
      }

      return { received: true };
    } catch (error) {
      console.error('Webhook error:', error.message);
      throw error;
    }
  }

  // Kafka message handlers
  @MessagePattern('payment.get')
  async getPayment(data: { id: string }) {
    return this.paymentService.findOne(data.id);
  }

  @MessagePattern('payment.getByUser')
  async getPaymentsByUser(data: { userId: string }) {
    return this.paymentService.findByUser(data.userId);
  }

  @MessagePattern('payment.getByReservation')
  async getPaymentsByReservation(data: { reservationId: string }) {
    return this.paymentService.findByReservation(data.reservationId);
  }

  @MessagePattern('payment.create')
  async createPayment(data: CreatePaymentDto) {
    return this.paymentService.create(data);
  }

  @MessagePattern('payment.process')
  async processPayment(data: ProcessPaymentDto) {
    return this.paymentService.process(data);
  }

  @MessagePattern('payment.refund')
  async refundPayment(data: RefundPaymentDto) {
    return this.paymentService.refund(data);
  }

  @EventPattern('reservation.created')
  async handleReservationCreated(data: {
    reservationId: string;
    userId: string;
    eventId: string;
    totalAmount: number;
    items: any[];
  }) {
    // Auto-create payment record for new reservations
    const payment = await this.paymentService.create({
      reservationId: data.reservationId,
      userId: data.userId,
      eventId: data.eventId,
      amount: data.totalAmount,
      type: 'card' as any, // Default to card payment
      notes: 'Auto-created for reservation',
    });

    console.log('Payment created for reservation:', payment.id);
  }

  @EventPattern('reservation.cancelled')
  async handleReservationCancelled(data: {
    reservationId: string;
    reason: string;
  }) {
    // Find payments for the cancelled reservation
    const payments = await this.paymentService.findByReservation(
      data.reservationId
    );

    // Process refunds for completed payments
    for (const payment of payments) {
      if (payment.isSuccessful && payment.remainingAmount > 0) {
        await this.paymentService.refund({
          paymentId: payment.id,
          reason: `Reservation cancelled: ${data.reason}`,
        });
      }
    }
  }

  @EventPattern('reservation.expired')
  async handleReservationExpired(data: { reservationId: string }) {
    // Cancel pending payments for expired reservations
    const payments = await this.paymentService.findByReservation(
      data.reservationId
    );
    for (const payment of payments) {
      if (payment.isPending) {
        await this.paymentService.update(payment.id, {
          status: PaymentStatus.FAILED,
          failureReason: 'Reservation expired',
        });
      }
    }
  }
}

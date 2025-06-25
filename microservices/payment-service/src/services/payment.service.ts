import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Payment, PaymentMethod, Refund } from '../entities';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
  ProcessPaymentDto,
  RefundPaymentDto,
  PaymentQueryDto,
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
} from '../dto';
import {
  PaymentStatus,
  PaymentType,
  RefundStatus,
} from '@event-reservation/shared';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(Refund)
    private refundRepository: Repository<Refund>,
    @Inject('KAFKA_SERVICE')
    private kafkaClient: ClientKafka,
    private configService: ConfigService,
    private stripeService: StripeService
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentRepository.create({
      reservationId: createPaymentDto.reservationId,
      userId: createPaymentDto.userId,
      eventId: createPaymentDto.eventId,
      amount: createPaymentDto.amount,
      currency: createPaymentDto.currency || 'USD',
      type: createPaymentDto.type,
      paymentMethodId: createPaymentDto.paymentMethodId,
      notes: createPaymentDto.notes,
      metadata: createPaymentDto.metadata,
      status: PaymentStatus.PENDING,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Emit payment created event
    this.kafkaClient.emit('payment.created', {
      paymentId: savedPayment.id,
      reservationId: savedPayment.reservationId,
      userId: savedPayment.userId,
      eventId: savedPayment.eventId,
      amount: savedPayment.amount,
      currency: savedPayment.currency,
    });

    return savedPayment;
  }

  async findAll(query: PaymentQueryDto): Promise<{
    payments: Payment[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.paymentMethod', 'paymentMethod')
      .leftJoinAndSelect('payment.refunds', 'refunds');

    if (query.userId) {
      queryBuilder.andWhere('payment.userId = :userId', {
        userId: query.userId,
      });
    }

    if (query.eventId) {
      queryBuilder.andWhere('payment.eventId = :eventId', {
        eventId: query.eventId,
      });
    }

    if (query.reservationId) {
      queryBuilder.andWhere('payment.reservationId = :reservationId', {
        reservationId: query.reservationId,
      });
    }

    if (query.status) {
      queryBuilder.andWhere('payment.status = :status', {
        status: query.status,
      });
    }

    if (query.type) {
      queryBuilder.andWhere('payment.type = :type', { type: query.type });
    }

    if (query.from) {
      queryBuilder.andWhere('payment.createdAt >= :from', { from: query.from });
    }

    if (query.to) {
      queryBuilder.andWhere('payment.createdAt <= :to', { to: query.to });
    }

    const [payments, total] = await queryBuilder
      .orderBy('payment.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { payments, total, page, limit };
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['paymentMethod', 'refunds'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async findByReservation(reservationId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { reservationId },
      relations: ['paymentMethod', 'refunds'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { userId },
      relations: ['paymentMethod', 'refunds'],
      order: { createdAt: 'DESC' },
    });
  }

  async process(processPaymentDto: ProcessPaymentDto): Promise<Payment> {
    const payment = await this.findOne(processPaymentDto.paymentId);

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Payment is not in pending status');
    }

    try {
      // Update payment status to processing
      await this.paymentRepository.update(payment.id, {
        status: PaymentStatus.PROCESSING,
      });

      let stripeResult;

      if (payment.type === PaymentType.CARD) {
        // Process card payment with Stripe
        stripeResult = await this.stripeService.processPayment({
          amount: Number(payment.amount * 100), // Convert to cents
          currency: payment.currency.toLowerCase(),
          paymentMethodId: processPaymentDto.paymentMethodId,
          reservationId: payment.reservationId,
          userId: payment.userId,
        });

        await this.paymentRepository.update(payment.id, {
          status: PaymentStatus.COMPLETED,
          stripePaymentIntentId: stripeResult.paymentIntentId,
          stripeChargeId: stripeResult.chargeId,
          processedAt: new Date(),
        });
      } else {
        // Handle other payment types (future implementation)
        await this.paymentRepository.update(payment.id, {
          status: PaymentStatus.COMPLETED,
          processedAt: new Date(),
        });
      }

      const updatedPayment = await this.findOne(payment.id);

      // Emit payment completed event
      this.kafkaClient.emit('payment.completed', {
        paymentId: updatedPayment.id,
        reservationId: updatedPayment.reservationId,
        status: 'success',
        amount: updatedPayment.amount,
        currency: updatedPayment.currency,
      });

      return updatedPayment;
    } catch (error) {
      // Update payment status to failed
      await this.paymentRepository.update(payment.id, {
        status: PaymentStatus.FAILED,
        failedAt: new Date(),
        failureReason: error.message,
      });

      // Emit payment failed event
      this.kafkaClient.emit('payment.failed', {
        paymentId: payment.id,
        reservationId: payment.reservationId,
        reason: error.message,
      });

      throw error;
    }
  }

  async refund(refundPaymentDto: RefundPaymentDto): Promise<Refund> {
    const payment = await this.findOne(refundPaymentDto.paymentId);

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException(
        'Payment must be completed to process refund'
      );
    }

    const refundAmount = refundPaymentDto.amount || Number(payment.amount);

    if (refundAmount > payment.remainingAmount) {
      throw new BadRequestException(
        'Refund amount exceeds remaining payment amount'
      );
    }

    const refund = this.refundRepository.create({
      paymentId: payment.id,
      amount: refundAmount,
      currency: payment.currency,
      reason: refundPaymentDto.reason,
      status: RefundStatus.PENDING,
    });

    const savedRefund = await this.refundRepository.save(refund);

    try {
      if (payment.type === PaymentType.CARD && payment.stripeChargeId) {
        // Process refund with Stripe
        const stripeRefund = await this.stripeService.processRefund({
          chargeId: payment.stripeChargeId,
          amount: refundAmount * 100, // Convert to cents
          reason: refundPaymentDto.reason,
        });

        await this.refundRepository.update(savedRefund.id, {
          status: RefundStatus.COMPLETED,
          stripeRefundId: stripeRefund.id,
          processedAt: new Date(),
        });
      } else {
        // Handle other payment types
        await this.refundRepository.update(savedRefund.id, {
          status: RefundStatus.COMPLETED,
          processedAt: new Date(),
        });
      }

      // Update payment status if fully refunded
      if (payment.remainingAmount - refundAmount <= 0) {
        await this.paymentRepository.update(payment.id, {
          status: PaymentStatus.REFUNDED,
        });
      }

      // Emit refund completed event
      this.kafkaClient.emit('refund.completed', {
        refundId: savedRefund.id,
        paymentId: payment.id,
        reservationId: payment.reservationId,
        amount: refundAmount,
        currency: payment.currency,
      });

      return this.refundRepository.findOne({
        where: { id: savedRefund.id },
        relations: ['payment'],
      });
    } catch (error) {
      await this.refundRepository.update(savedRefund.id, {
        status: RefundStatus.FAILED,
        failedAt: new Date(),
        failureReason: error.message,
      });

      throw error;
    }
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto
  ): Promise<Payment> {
    const payment = await this.findOne(id);

    await this.paymentRepository.update(id, updatePaymentDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);

    if (payment.status === PaymentStatus.COMPLETED) {
      throw new BadRequestException('Cannot delete completed payment');
    }

    await this.paymentRepository.delete(id);
  }

  // Payment Methods
  async createPaymentMethod(
    createPaymentMethodDto: CreatePaymentMethodDto
  ): Promise<PaymentMethod> {
    // If this is set as default, unset other default methods for this user
    if (createPaymentMethodDto.isDefault) {
      await this.paymentMethodRepository.update(
        { userId: createPaymentMethodDto.userId, isDefault: true },
        { isDefault: false }
      );
    }

    const paymentMethod = this.paymentMethodRepository.create(
      createPaymentMethodDto
    );
    return this.paymentMethodRepository.save(paymentMethod);
  }

  async findPaymentMethodsByUser(userId: string): Promise<PaymentMethod[]> {
    return this.paymentMethodRepository.find({
      where: { userId, isActive: true },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async updatePaymentMethod(
    id: string,
    updatePaymentMethodDto: UpdatePaymentMethodDto
  ): Promise<PaymentMethod> {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    // If setting as default, unset other default methods for this user
    if (updatePaymentMethodDto.isDefault) {
      await this.paymentMethodRepository.update(
        { userId: paymentMethod.userId, isDefault: true },
        { isDefault: false }
      );
    }

    await this.paymentMethodRepository.update(id, updatePaymentMethodDto);
    return this.paymentMethodRepository.findOne({ where: { id } });
  }

  async removePaymentMethod(id: string): Promise<void> {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    await this.paymentMethodRepository.update(id, { isActive: false });
  }
}

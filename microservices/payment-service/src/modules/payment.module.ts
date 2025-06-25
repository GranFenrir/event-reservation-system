import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment, PaymentMethod, Refund } from '../entities';
import { PaymentService, StripeService } from '../services';
import { PaymentController } from '../controllers';
import { KafkaModule } from '../config/kafka.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, PaymentMethod, Refund]),
    KafkaModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, StripeService],
  exports: [PaymentService, StripeService],
})
export class PaymentModule {}

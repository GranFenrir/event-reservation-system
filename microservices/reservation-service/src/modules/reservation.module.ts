import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationController } from '../controllers';
import { ReservationService } from '../services';
import { Reservation, ReservationItem } from '../entities';
import { KafkaModule } from '../config/kafka.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, ReservationItem]),
    KafkaModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}

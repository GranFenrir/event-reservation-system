import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat, Venue } from '../entities';
import { SeatService } from '../services';
import { SeatController } from '../controllers';
import { KafkaModule } from '../config/kafka.module';

@Module({
  imports: [TypeOrmModule.forFeature([Seat, Venue]), KafkaModule],
  controllers: [SeatController],
  providers: [SeatService],
  exports: [SeatService],
})
export class SeatModule {}

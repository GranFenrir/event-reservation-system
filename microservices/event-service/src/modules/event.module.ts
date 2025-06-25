import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event, TicketPrice } from '../entities';
import { EventService } from '../services';
import { EventController } from '../controllers';
import { KafkaModule } from '../config/kafka.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event, TicketPrice]), KafkaModule],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}

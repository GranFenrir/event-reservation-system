import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venue, Seat } from '../entities';
import { VenueService } from '../services';
import { VenueController } from '../controllers';
import { KafkaModule } from '../config/kafka.module';

@Module({
  imports: [TypeOrmModule.forFeature([Venue, Seat]), KafkaModule],
  controllers: [VenueController],
  providers: [VenueService],
  exports: [VenueService],
})
export class VenueModule {}

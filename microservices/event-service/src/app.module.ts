import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { KafkaModule } from './config/kafka.module';
import { EventModule, VenueModule, SeatModule } from './modules';
import { HealthController } from './controllers/health.controller';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { Event } from './entities';

@Module({
  imports: [
    ConfigModule,
    KafkaModule,
    TypeOrmModule.forFeature([Event]), // For health check
    EventModule,
    VenueModule,
    SeatModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}

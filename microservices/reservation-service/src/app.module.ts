import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { ReservationModule } from './modules';
import { HealthController } from './controllers';

@Module({
  imports: [ConfigModule, ReservationModule],
  controllers: [HealthController],
})
export class AppModule {}

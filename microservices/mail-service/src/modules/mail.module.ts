import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailLog, MailTemplate } from '../entities';
import { MailService } from '../services';
import { MailController } from '../controllers';
import { KafkaModule } from '../config/kafka.module';

@Module({
  imports: [TypeOrmModule.forFeature([MailLog, MailTemplate]), KafkaModule],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

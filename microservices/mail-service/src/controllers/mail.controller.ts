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
} from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { MailService } from '../services';
import {
  SendMailDto,
  SendTemplateMailDto,
  CreateMailTemplateDto,
  UpdateMailTemplateDto,
  MailLogQueryDto,
  BulkMailDto,
} from '../dto';

@Controller('mail')
@UsePipes(new ValidationPipe({ transform: true }))
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(@Body() sendMailDto: SendMailDto) {
    return this.mailService.sendMail(sendMailDto);
  }

  @Post('send-template')
  async sendTemplateMail(@Body() sendTemplateMailDto: SendTemplateMailDto) {
    return this.mailService.sendTemplateMail(sendTemplateMailDto);
  }

  @Post('send-bulk')
  async sendBulkMail(@Body() bulkMailDto: BulkMailDto) {
    return this.mailService.sendBulkMail(bulkMailDto);
  }

  @Post('retry-failed')
  async retryFailedMails() {
    await this.mailService.retryFailedMails();
    return { message: 'Retry process initiated for failed mails' };
  }

  // Template management
  @Post('templates')
  async createTemplate(@Body() createTemplateDto: CreateMailTemplateDto) {
    return this.mailService.createTemplate(createTemplateDto);
  }

  @Get('templates')
  async findAllTemplates() {
    return this.mailService.findAllTemplates();
  }

  @Get('templates/:id')
  async findTemplate(@Param('id') id: string) {
    return this.mailService.findTemplate(id);
  }

  @Patch('templates/:id')
  async updateTemplate(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateMailTemplateDto
  ) {
    return this.mailService.updateTemplate(id, updateTemplateDto);
  }

  @Delete('templates/:id')
  async removeTemplate(@Param('id') id: string) {
    await this.mailService.removeTemplate(id);
    return { message: 'Template deleted successfully' };
  }

  // Mail logs
  @Get('logs')
  async findAllMailLogs(@Query() query: MailLogQueryDto) {
    return this.mailService.findAllMailLogs(query);
  }

  @Get('logs/:id')
  async findMailLog(@Param('id') id: string) {
    return this.mailService.findMailLog(id);
  }

  // Kafka message handlers
  @MessagePattern('mail.send')
  async handleSendMail(data: SendMailDto) {
    return this.mailService.sendMail(data);
  }

  @MessagePattern('mail.sendTemplate')
  async handleSendTemplateMail(data: SendTemplateMailDto) {
    return this.mailService.sendTemplateMail(data);
  }

  @MessagePattern('mail.sendBulk')
  async handleSendBulkMail(data: BulkMailDto) {
    return this.mailService.sendBulkMail(data);
  }

  @MessagePattern('mail.getLogs')
  async handleGetMailLogs(data: MailLogQueryDto) {
    return this.mailService.findAllMailLogs(data);
  }

  @MessagePattern('mail.getLog')
  async handleGetMailLog(data: { id: string }) {
    return this.mailService.findMailLog(data.id);
  }

  // Event handlers
  @EventPattern('reservation.confirmed')
  async handleReservationConfirmed(data: {
    reservationId: string;
    userId: string;
    userEmail: string;
    userName: string;
    eventId: string;
    eventTitle: string;
    eventDate: string;
    totalAmount: number;
  }) {
    await this.mailService.sendTemplateMail({
      templateName: 'reservation-confirmed',
      recipientEmail: data.userEmail,
      recipientName: data.userName,
      templateVariables: {
        userName: data.userName,
        eventTitle: data.eventTitle,
        eventDate: data.eventDate,
        reservationId: data.reservationId,
        totalAmount: data.totalAmount,
      },
      reservationId: data.reservationId,
      eventId: data.eventId,
      userId: data.userId,
    });
  }

  @EventPattern('reservation.cancelled')
  async handleReservationCancelled(data: {
    reservationId: string;
    userId: string;
    userEmail: string;
    userName: string;
    eventId: string;
    eventTitle: string;
    reason: string;
  }) {
    await this.mailService.sendTemplateMail({
      templateName: 'reservation-cancelled',
      recipientEmail: data.userEmail,
      recipientName: data.userName,
      templateVariables: {
        userName: data.userName,
        eventTitle: data.eventTitle,
        reservationId: data.reservationId,
        reason: data.reason,
      },
      reservationId: data.reservationId,
      eventId: data.eventId,
      userId: data.userId,
    });
  }

  @EventPattern('payment.completed')
  async handlePaymentCompleted(data: {
    paymentId: string;
    reservationId: string;
    userId: string;
    userEmail: string;
    userName: string;
    eventId: string;
    eventTitle: string;
    amount: number;
  }) {
    await this.mailService.sendTemplateMail({
      templateName: 'payment-receipt',
      recipientEmail: data.userEmail,
      recipientName: data.userName,
      templateVariables: {
        userName: data.userName,
        eventTitle: data.eventTitle,
        reservationId: data.reservationId,
        paymentId: data.paymentId,
        amount: data.amount,
        paymentDate: new Date().toLocaleDateString(),
      },
      reservationId: data.reservationId,
      eventId: data.eventId,
      userId: data.userId,
    });
  }

  @EventPattern('event.published')
  async handleEventPublished(data: {
    eventId: string;
    eventTitle: string;
    eventDate: string;
    organizer: {
      email: string;
      name: string;
    };
  }) {
    await this.mailService.sendTemplateMail({
      templateName: 'event-published',
      recipientEmail: data.organizer.email,
      recipientName: data.organizer.name,
      templateVariables: {
        organizerName: data.organizer.name,
        eventTitle: data.eventTitle,
        eventDate: data.eventDate,
        eventId: data.eventId,
      },
      eventId: data.eventId,
    });
  }

  @EventPattern('user.welcome')
  async handleUserWelcome(data: {
    userId: string;
    userEmail: string;
    userName: string;
  }) {
    await this.mailService.sendTemplateMail({
      templateName: 'user-welcome',
      recipientEmail: data.userEmail,
      recipientName: data.userName,
      templateVariables: {
        userName: data.userName,
        platformName: 'Event Reservation System',
      },
      userId: data.userId,
    });
  }
}

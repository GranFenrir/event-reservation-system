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
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { MailLog, MailTemplate } from '../entities';
import {
  SendMailDto,
  SendTemplateMailDto,
  CreateMailTemplateDto,
  UpdateMailTemplateDto,
  MailLogQueryDto,
  BulkMailDto,
} from '../dto';
import { NotificationType } from '@event-reservation/shared';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(MailLog)
    private mailLogRepository: Repository<MailLog>,
    @InjectRepository(MailTemplate)
    private mailTemplateRepository: Repository<MailTemplate>,
    @Inject('KAFKA_SERVICE')
    private kafkaClient: ClientKafka,
    private configService: ConfigService
  ) {
    this.initializeMailTransporter();
  }
  private initializeMailTransporter() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST', 'localhost'),
      port: this.configService.get('SMTP_PORT', 587),
      secure: this.configService.get('SMTP_SECURE', false),
      auth: {
        user: this.configService.get('SMTP_USERNAME'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }

  async sendMail(sendMailDto: SendMailDto): Promise<MailLog> {
    // Create mail log entry
    const mailLog = this.mailLogRepository.create({
      templateId: sendMailDto.templateId,
      recipientEmail: sendMailDto.recipientEmail,
      recipientName: sendMailDto.recipientName,
      senderEmail:
        sendMailDto.senderEmail ||
        this.configService.get('DEFAULT_SENDER_EMAIL'),
      senderName:
        sendMailDto.senderName || this.configService.get('DEFAULT_SENDER_NAME'),
      subject: sendMailDto.subject,
      body: sendMailDto.body,
      htmlBody: sendMailDto.htmlBody,
      type: NotificationType.EMAIL,
      eventId: sendMailDto.eventId,
      reservationId: sendMailDto.reservationId,
      userId: sendMailDto.userId,
      metadata: sendMailDto.metadata,
    });

    const savedMailLog = await this.mailLogRepository.save(mailLog);

    // Send email asynchronously
    this.sendEmailAsync(savedMailLog);

    return savedMailLog;
  }

  async sendTemplateMail(
    sendTemplateMailDto: SendTemplateMailDto
  ): Promise<MailLog> {
    const template = await this.mailTemplateRepository.findOne({
      where: { name: sendTemplateMailDto.templateName, isActive: true },
    });

    if (!template) {
      throw new NotFoundException(
        `Template '${sendTemplateMailDto.templateName}' not found`
      );
    }

    // Compile template
    const subjectTemplate = handlebars.compile(template.subject);
    const bodyTemplate = handlebars.compile(template.body);
    const htmlTemplate = template.htmlBody
      ? handlebars.compile(template.htmlBody)
      : null;

    const compiledSubject = subjectTemplate(
      sendTemplateMailDto.templateVariables
    );
    const compiledBody = bodyTemplate(sendTemplateMailDto.templateVariables);
    const compiledHtml = htmlTemplate
      ? htmlTemplate(sendTemplateMailDto.templateVariables)
      : undefined;

    return this.sendMail({
      recipientEmail: sendTemplateMailDto.recipientEmail,
      recipientName: sendTemplateMailDto.recipientName,
      subject: compiledSubject,
      body: compiledBody,
      htmlBody: compiledHtml,
      senderEmail:
        sendTemplateMailDto.senderEmail || template.defaultSenderEmail,
      senderName: sendTemplateMailDto.senderName || template.defaultSenderName,
      templateId: template.id,
      eventId: sendTemplateMailDto.eventId,
      reservationId: sendTemplateMailDto.reservationId,
      userId: sendTemplateMailDto.userId,
      metadata: sendTemplateMailDto.metadata,
    });
  }

  async sendBulkMail(bulkMailDto: BulkMailDto): Promise<MailLog[]> {
    const results: MailLog[] = [];

    for (const recipient of bulkMailDto.recipients) {
      try {
        const mailLog = await this.sendTemplateMail({
          templateName: bulkMailDto.templateName,
          recipientEmail: recipient.email,
          recipientName: recipient.name,
          templateVariables: recipient.templateVariables || {},
          senderEmail: bulkMailDto.senderEmail,
          senderName: bulkMailDto.senderName,
          eventId: bulkMailDto.eventId,
          metadata: bulkMailDto.metadata,
        });
        results.push(mailLog);
      } catch (error) {
        // Log error but continue with other recipients
        console.error(`Failed to send email to ${recipient.email}:`, error);
      }
    }

    return results;
  }

  private async sendEmailAsync(mailLog: MailLog): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"${mailLog.senderName}" <${mailLog.senderEmail}>`,
        to: `"${mailLog.recipientName}" <${mailLog.recipientEmail}>`,
        subject: mailLog.subject,
        text: mailLog.body,
        html: mailLog.htmlBody,
      });

      // Update mail log as sent
      await this.mailLogRepository.update(mailLog.id, {
        isSent: true,
        sentAt: new Date(),
      });

      // Emit mail sent event
      this.kafkaClient.emit('mail.sent', {
        mailLogId: mailLog.id,
        recipientEmail: mailLog.recipientEmail,
        subject: mailLog.subject,
        eventId: mailLog.eventId,
        reservationId: mailLog.reservationId,
        userId: mailLog.userId,
      });
    } catch (error) {
      // Update mail log as failed
      await this.mailLogRepository.update(mailLog.id, {
        failedAt: new Date(),
        failureReason: error.message,
        retryCount: mailLog.retryCount + 1,
      });

      // Emit mail failed event
      this.kafkaClient.emit('mail.failed', {
        mailLogId: mailLog.id,
        recipientEmail: mailLog.recipientEmail,
        error: error.message,
        eventId: mailLog.eventId,
        reservationId: mailLog.reservationId,
        userId: mailLog.userId,
      });

      console.error('Failed to send email:', error);
    }
  }

  async retryFailedMails(): Promise<void> {
    const failedMails = await this.mailLogRepository.find({
      where: {
        isSent: false,
      },
    });

    for (const mailLog of failedMails.filter(m => m.canRetry)) {
      await this.sendEmailAsync(mailLog);
    }
  }

  // Template management
  async createTemplate(
    createTemplateDto: CreateMailTemplateDto
  ): Promise<MailTemplate> {
    const template = this.mailTemplateRepository.create(createTemplateDto);
    return this.mailTemplateRepository.save(template);
  }

  async findAllTemplates(): Promise<MailTemplate[]> {
    return this.mailTemplateRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findTemplate(id: string): Promise<MailTemplate> {
    const template = await this.mailTemplateRepository.findOne({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    return template;
  }

  async updateTemplate(
    id: string,
    updateTemplateDto: UpdateMailTemplateDto
  ): Promise<MailTemplate> {
    const template = await this.findTemplate(id);
    await this.mailTemplateRepository.update(id, updateTemplateDto);
    return this.findTemplate(id);
  }

  async removeTemplate(id: string): Promise<void> {
    const template = await this.findTemplate(id);
    await this.mailTemplateRepository.delete(id);
  }

  // Mail log queries
  async findAllMailLogs(query: MailLogQueryDto): Promise<MailLog[]> {
    const queryBuilder = this.mailLogRepository
      .createQueryBuilder('mailLog')
      .leftJoinAndSelect('mailLog.template', 'template')
      .orderBy('mailLog.createdAt', 'DESC');

    if (query.recipientEmail) {
      queryBuilder.andWhere('mailLog.recipientEmail ILIKE :email', {
        email: `%${query.recipientEmail}%`,
      });
    }

    if (query.templateId) {
      queryBuilder.andWhere('mailLog.templateId = :templateId', {
        templateId: query.templateId,
      });
    }

    if (query.eventId) {
      queryBuilder.andWhere('mailLog.eventId = :eventId', {
        eventId: query.eventId,
      });
    }

    if (query.reservationId) {
      queryBuilder.andWhere('mailLog.reservationId = :reservationId', {
        reservationId: query.reservationId,
      });
    }

    if (query.userId) {
      queryBuilder.andWhere('mailLog.userId = :userId', {
        userId: query.userId,
      });
    }

    if (query.isSent !== undefined) {
      queryBuilder.andWhere('mailLog.isSent = :isSent', {
        isSent: query.isSent,
      });
    }

    if (query.from) {
      queryBuilder.andWhere('mailLog.createdAt >= :from', {
        from: query.from,
      });
    }

    if (query.to) {
      queryBuilder.andWhere('mailLog.createdAt <= :to', {
        to: query.to,
      });
    }

    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    return queryBuilder.getMany();
  }

  async findMailLog(id: string): Promise<MailLog> {
    const mailLog = await this.mailLogRepository.findOne({
      where: { id },
      relations: ['template'],
    });

    if (!mailLog) {
      throw new NotFoundException(`Mail log with ID ${id} not found`);
    }

    return mailLog;
  }
}

import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { NotificationType } from '@event-reservation/shared';

export interface SendMailDto {
  recipientEmail: string;
  recipientName?: string;
  subject: string;
  body: string;
  htmlBody?: string;
  senderEmail?: string;
  senderName?: string;
  templateId?: string;
  templateVariables?: Record<string, any>;
  eventId?: string;
  reservationId?: string;
  userId?: string;
  metadata?: any;
}

export interface SendTemplateMailDto {
  templateName: string;
  recipientEmail: string;
  recipientName?: string;
  templateVariables: Record<string, any>;
  senderEmail?: string;
  senderName?: string;
  eventId?: string;
  reservationId?: string;
  userId?: string;
  metadata?: any;
}

export interface CreateMailTemplateDto {
  name: string;
  subject: string;
  body: string;
  htmlBody?: string;
  type: NotificationType;
  description?: string;
  variables?: string[];
  defaultSenderEmail?: string;
  defaultSenderName?: string;
}

export interface UpdateMailTemplateDto {
  name?: string;
  subject?: string;
  body?: string;
  htmlBody?: string;
  type?: NotificationType;
  isActive?: boolean;
  description?: string;
  variables?: string[];
  defaultSenderEmail?: string;
  defaultSenderName?: string;
}

export interface MailLogQueryDto {
  recipientEmail?: string;
  templateId?: string;
  eventId?: string;
  reservationId?: string;
  userId?: string;
  isSent?: boolean;
  from?: Date;
  to?: Date;
  page?: number;
  limit?: number;
}

export interface BulkMailDto {
  templateName: string;
  recipients: Array<{
    email: string;
    name?: string;
    templateVariables?: Record<string, any>;
  }>;
  senderEmail?: string;
  senderName?: string;
  eventId?: string;
  metadata?: any;
}

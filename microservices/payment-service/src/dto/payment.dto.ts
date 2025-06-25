import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsUUID,
  Min,
} from 'class-validator';
import { PaymentType, PaymentStatus } from '@event-reservation/shared';

export interface CreatePaymentDto {
  reservationId: string;
  userId: string;
  eventId: string;
  amount: number;
  currency?: string;
  type: PaymentType;
  paymentMethodId?: string;
  notes?: string;
  metadata?: any;
}

export interface UpdatePaymentDto {
  status?: PaymentStatus;
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  notes?: string;
  metadata?: any;
  failureReason?: string;
}

export interface ProcessPaymentDto {
  paymentId: string;
  paymentMethodId?: string;
  stripePaymentIntentId?: string;
}

export interface RefundPaymentDto {
  paymentId: string;
  amount?: number;
  reason?: string;
}

export interface PaymentQueryDto {
  userId?: string;
  eventId?: string;
  reservationId?: string;
  status?: string;
  type?: PaymentType;
  from?: Date;
  to?: Date;
  page?: number;
  limit?: number;
}

export interface CreatePaymentMethodDto {
  userId: string;
  type: PaymentType;
  stripePaymentMethodId?: string;
  isDefault?: boolean;
}

export interface UpdatePaymentMethodDto {
  isDefault?: boolean;
  isActive?: boolean;
}

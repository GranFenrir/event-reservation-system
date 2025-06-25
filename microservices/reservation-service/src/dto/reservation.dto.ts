import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsEnum,
  IsInt,
  Min,
  IsUUID,
  IsOptional,
  ValidateNested,
  IsArray,
  IsNumber,
  ArrayMinSize,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ReservationStatus } from '@event-reservation/shared';

export class CreateReservationItemDto {
  @IsString()
  @IsOptional()
  seatId?: string;

  @IsString()
  @IsNotEmpty()
  ticketType: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice: number;
}

export class CreateReservationDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  eventId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateReservationItemDto)
  items: CreateReservationItemDto[];

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateReservationDto {
  @IsEnum(ReservationStatus)
  @IsOptional()
  status?: ReservationStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ConfirmReservationDto {
  @IsUUID()
  reservationId: string;

  @IsUUID()
  paymentId: string;
}

export class CancelReservationDto {
  @IsUUID()
  reservationId: string;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class ReservationQueryDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  @IsOptional()
  eventId?: string;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status?: ReservationStatus;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
}

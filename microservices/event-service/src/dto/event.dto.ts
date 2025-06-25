import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsEnum,
  IsInt,
  Min,
  IsUUID,
  IsOptional,
  IsUrl,
  ValidateNested,
  IsArray,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { EventStatus, TicketType } from '@event-reservation/shared';

export class CreateTicketPriceDto {
  @IsEnum(TicketType)
  type: TicketType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxQuantity?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsDate()
  @Type(() => Date)
  saleStartDate: Date;

  @IsDate()
  @Type(() => Date)
  saleEndDate: Date;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus = EventStatus.DRAFT;

  @IsInt()
  @Min(1)
  totalSeats: number;

  @IsUUID()
  venueId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTicketPriceDto)
  ticketPrices: CreateTicketPriceDto[];
}

export class UpdateEventDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  saleStartDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  saleEndDate?: Date;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @IsInt()
  @Min(1)
  @IsOptional()
  totalSeats?: number;

  @IsUUID()
  @IsOptional()
  venueId?: string;
}

export class EventQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @IsOptional()
  @IsUUID()
  venueId?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'startDate';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}

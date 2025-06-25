import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  ValidationPipe,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventService } from '../services';
import { CreateEventDto, UpdateEventDto, EventQueryDto } from '../dto';
import { EventStatus } from '@event-reservation/shared';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Body(ValidationPipe) createEventDto: CreateEventDto) {
    const event = await this.eventService.create(createEventDto);
    return {
      success: true,
      data: event,
      message: 'Event created successfully',
    };
  }

  @Get()
  async findAll(@Query(ValidationPipe) query: EventQueryDto) {
    const result = await this.eventService.findAll(query);
    return {
      success: true,
      data: result,
      message: 'Events retrieved successfully',
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const event = await this.eventService.findOne(id);
    return {
      success: true,
      data: event,
      message: 'Event retrieved successfully',
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateEventDto: UpdateEventDto,
  ) {
    const event = await this.eventService.update(id, updateEventDto);
    return {
      success: true,
      data: event,
      message: 'Event updated successfully',
    };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: EventStatus,
  ) {
    const event = await this.eventService.updateStatus(id, status);
    return {
      success: true,
      data: event,
      message: 'Event status updated successfully',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.eventService.remove(id);
    return {
      success: true,
      message: 'Event deleted successfully',
    };
  }

  // Microservice message handlers
  @MessagePattern('event.get')
  async getEvent(@Payload() data: { id: string }) {
    try {
      const event = await this.eventService.findOne(data.id);
      return { success: true, data: event };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern('event.update.sold.seats')
  async updateSoldSeats(
    @Payload() data: { eventId: string; increment: number },
  ) {
    try {
      const event = await this.eventService.updateSoldSeats(
        data.eventId,
        data.increment,
      );
      return { success: true, data: event };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern('event.check.availability')
  async checkAvailability(
    @Payload() data: { eventId: string; quantity: number },
  ) {
    try {
      const event = await this.eventService.findOne(data.eventId);
      const isAvailable =
        event.availableSeats >= data.quantity && event.isSaleActive;

      return {
        success: true,
        data: {
          isAvailable,
          availableSeats: event.availableSeats,
          isSaleActive: event.isSaleActive,
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern('events.search')
  async searchEvents(@Payload() query: EventQueryDto) {
    try {
      const result = await this.eventService.findAll(query);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

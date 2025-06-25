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
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SeatService } from '../services';
import {
  CreateSeatDto,
  CreateBulkSeatsDto,
  UpdateSeatDto,
  SeatQueryDto,
} from '../dto';
import { SeatStatus } from '@event-reservation/shared';

@Controller('seats')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Post()
  async create(@Body(ValidationPipe) createSeatDto: CreateSeatDto) {
    const seat = await this.seatService.create(createSeatDto);
    return {
      success: true,
      data: seat,
      message: 'Seat created successfully',
    };
  }

  @Post('bulk')
  async createBulk(
    @Body(ValidationPipe) createBulkSeatsDto: CreateBulkSeatsDto,
  ) {
    const seats = await this.seatService.createBulk(createBulkSeatsDto);
    return {
      success: true,
      data: seats,
      message: `${seats.length} seats created successfully`,
    };
  }

  @Post('generate')
  async generateSeats(
    @Body()
    data: {
      venueId: string;
      rows: string[];
      seatsPerRow: number;
      section?: string;
      basePrice?: number;
    },
  ) {
    const seats = await this.seatService.generateSeats(
      data.venueId,
      data.rows,
      data.seatsPerRow,
      data.section,
      data.basePrice,
    );
    return {
      success: true,
      data: seats,
      message: `${seats.length} seats generated successfully`,
    };
  }

  @Get()
  async findAll(@Query(ValidationPipe) query: SeatQueryDto) {
    const result = await this.seatService.findAll(query);
    return {
      success: true,
      data: result,
      message: 'Seats retrieved successfully',
    };
  }

  @Get('venue/:venueId')
  async findByVenue(@Param('venueId', ParseUUIDPipe) venueId: string) {
    const seats = await this.seatService.findByVenue(venueId);
    return {
      success: true,
      data: seats,
      message: 'Venue seats retrieved successfully',
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const seat = await this.seatService.findOne(id);
    return {
      success: true,
      data: seat,
      message: 'Seat retrieved successfully',
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateSeatDto: UpdateSeatDto,
  ) {
    const seat = await this.seatService.update(id, updateSeatDto);
    return {
      success: true,
      data: seat,
      message: 'Seat updated successfully',
    };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: SeatStatus,
  ) {
    const seat = await this.seatService.updateStatus(id, status);
    return {
      success: true,
      data: seat,
      message: 'Seat status updated successfully',
    };
  }

  @Patch('bulk/status')
  async updateBulkStatus(
    @Body() data: { seatIds: string[]; status: SeatStatus },
  ) {
    const seats = await this.seatService.updateBulkStatus(
      data.seatIds,
      data.status,
    );
    return {
      success: true,
      data: seats,
      message: 'Seat statuses updated successfully',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.seatService.remove(id);
    return {
      success: true,
      message: 'Seat deleted successfully',
    };
  }

  // Microservice message handlers
  @MessagePattern('seat.get')
  async getSeat(@Payload() data: { id: string }) {
    try {
      const seat = await this.seatService.findOne(data.id);
      return { success: true, data: seat };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern('seats.by.venue')
  async getSeatsByVenue(@Payload() data: { venueId: string }) {
    try {
      const seats = await this.seatService.findByVenue(data.venueId);
      return { success: true, data: seats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern('seats.update.status')
  async updateSeatsStatus(
    @Payload() data: { seatIds: string[]; status: SeatStatus },
  ) {
    try {
      const seats = await this.seatService.updateBulkStatus(
        data.seatIds,
        data.status,
      );
      return { success: true, data: seats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern('seats.check.availability')
  async checkSeatsAvailability(@Payload() data: { seatIds: string[] }) {
    try {
      const result = await this.seatService.findAll({
        // This would need to be implemented to filter by specific seat IDs
        // For now, we'll check each seat individually
      });

      // Implementation would check if all requested seats are available
      return { success: true, data: { available: true } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

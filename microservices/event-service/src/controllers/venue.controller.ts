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
import { VenueService } from '../services';
import { CreateVenueDto, UpdateVenueDto, VenueQueryDto } from '../dto';

@Controller('venues')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @Post()
  async create(@Body(ValidationPipe) createVenueDto: CreateVenueDto) {
    const venue = await this.venueService.create(createVenueDto);
    return {
      success: true,
      data: venue,
      message: 'Venue created successfully',
    };
  }

  @Get()
  async findAll(@Query(ValidationPipe) query: VenueQueryDto) {
    const result = await this.venueService.findAll(query);
    return {
      success: true,
      data: result,
      message: 'Venues retrieved successfully',
    };
  }

  @Get('location/:city')
  async findByLocation(
    @Param('city') city: string,
    @Query('country') country?: string,
  ) {
    const venues = await this.venueService.findByLocation(city, country);
    return {
      success: true,
      data: venues,
      message: 'Venues retrieved successfully',
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const venue = await this.venueService.findOne(id);
    return {
      success: true,
      data: venue,
      message: 'Venue retrieved successfully',
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateVenueDto: UpdateVenueDto,
  ) {
    const venue = await this.venueService.update(id, updateVenueDto);
    return {
      success: true,
      data: venue,
      message: 'Venue updated successfully',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.venueService.remove(id);
    return {
      success: true,
      message: 'Venue deleted successfully',
    };
  }

  // Microservice message handlers
  @MessagePattern('venue.get')
  async getVenue(@Payload() data: { id: string }) {
    try {
      const venue = await this.venueService.findOne(data.id);
      return { success: true, data: venue };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern('venues.search')
  async searchVenues(@Payload() query: VenueQueryDto) {
    try {
      const result = await this.venueService.findAll(query);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern('venues.by.location')
  async getVenuesByLocation(
    @Payload() data: { city: string; country?: string },
  ) {
    try {
      const venues = await this.venueService.findByLocation(
        data.city,
        data.country,
      );
      return { success: true, data: venues };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

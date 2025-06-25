import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities';

@Controller('health')
export class HealthController {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  @Get()
  async check() {
    try {
      // Check database connection
      await this.eventRepository.query('SELECT 1');

      return {
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'event-service',
        checks: {
          database: 'connected',
        },
      };
    } catch (error) {
      return {
        success: false,
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'event-service',
        checks: {
          database: 'disconnected',
        },
        error: error.message,
      };
    }
  }

  @Get('ready')
  async ready() {
    return {
      success: true,
      status: 'ready',
      timestamp: new Date().toISOString(),
      service: 'event-service',
    };
  }

  @Get('live')
  async live() {
    return {
      success: true,
      status: 'alive',
      timestamp: new Date().toISOString(),
      service: 'event-service',
    };
  }
}

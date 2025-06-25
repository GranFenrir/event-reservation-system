import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'reservation-service',
    };
  }

  @Get('ready')
  ready() {
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
      service: 'reservation-service',
    };
  }

  @Get('live')
  live() {
    return {
      status: 'live',
      timestamp: new Date().toISOString(),
      service: 'reservation-service',
    };
  }
}

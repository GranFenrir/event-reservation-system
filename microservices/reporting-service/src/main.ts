import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule);
    
    // Global prefix for all routes
    app.setGlobalPrefix('api/v1');
    
    // Enable CORS
    app.enableCors({
      origin: process.env.CORS_ORIGINS?.split(',') || [
        'http://localhost:3000',  // Frontend
        'http://localhost:3010',  // Admin Panel
      ],
      credentials: true,
    });

    const port = process.env.PORT || 3005;
    await app.listen(port);
    
    logger.log(`🚀 Reporting Service is running on port ${port}`);
    logger.log(`📊 Health check: http://localhost:${port}/api/v1/health`);
  } catch (error) {
    logger.error('Failed to start Reporting Service:', error);
    process.exit(1);
  }
}

bootstrap();

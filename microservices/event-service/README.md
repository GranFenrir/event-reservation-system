# Event Service

## Overview

The Event Service is a NestJS-based microservice responsible for managing events, venues, and seating arrangements in the Event Reservation System.

## Features

- **Event Management**: Create, read, update, and delete events
- **Venue Management**: Manage event venues and their properties
- **Seat Management**: Handle seat configurations and availability
- **Ticket Pricing**: Manage different ticket types and pricing
- **Status Tracking**: Track event and seat statuses
- **Microservice Communication**: Kafka-based messaging for inter-service communication

## API Endpoints

### Events

- `GET /api/v1/events` - List events with filtering and pagination
- `POST /api/v1/events` - Create a new event
- `GET /api/v1/events/:id` - Get event details
- `PATCH /api/v1/events/:id` - Update event
- `PATCH /api/v1/events/:id/status` - Update event status
- `DELETE /api/v1/events/:id` - Delete event

### Venues

- `GET /api/v1/venues` - List venues
- `POST /api/v1/venues` - Create a new venue
- `GET /api/v1/venues/:id` - Get venue details
- `PATCH /api/v1/venues/:id` - Update venue
- `DELETE /api/v1/venues/:id` - Delete venue
- `GET /api/v1/venues/location/:city` - Find venues by location

### Seats

- `GET /api/v1/seats` - List seats with filtering
- `POST /api/v1/seats` - Create a single seat
- `POST /api/v1/seats/bulk` - Create multiple seats
- `POST /api/v1/seats/generate` - Generate seats for a venue
- `GET /api/v1/seats/venue/:venueId` - Get all seats for a venue
- `PATCH /api/v1/seats/:id/status` - Update seat status
- `PATCH /api/v1/seats/bulk/status` - Update multiple seat statuses

### Health Check

- `GET /api/v1/health` - Service health check
- `GET /api/v1/health/ready` - Readiness probe
- `GET /api/v1/health/live` - Liveness probe

## Environment Variables

```env
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=event_service

# Kafka
KAFKA_BROKER=localhost:9092
```

## Development

### Prerequisites

- Node.js 18+
- PostgreSQL
- Apache Kafka

### Setup

1. Copy `.env.example` to `.env` and configure
2. Install dependencies: `npm install`
3. Start the service: `npm run start:dev`

### Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application
- `npm run test` - Run tests
- `npm run test:e2e` - Run end-to-end tests

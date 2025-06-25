# Reservation Service

The Reservation Service manages event ticket reservations, including creation,
confirmation, cancellation, and expiration handling.

## Features

- **Reservation Management**: Create, update, confirm, and cancel reservations
- **Automatic Expiration**: Reservations expire after 15 minutes if not
  confirmed
- **Multi-item Support**: Handle multiple ticket types and quantities in a
  single reservation
- **Seat Assignment**: Support for specific seat reservations
- **Kafka Integration**: Event-driven communication with other services
- **Database Persistence**: PostgreSQL storage with TypeORM

## API Endpoints

### HTTP REST API

- `POST /api/v1/reservations` - Create a new reservation
- `GET /api/v1/reservations` - Get reservations with filtering
- `GET /api/v1/reservations/:id` - Get specific reservation
- `GET /api/v1/reservations/user/:userId` - Get user's reservations
- `GET /api/v1/reservations/event/:eventId` - Get event's reservations
- `PATCH /api/v1/reservations/:id` - Update reservation
- `POST /api/v1/reservations/confirm` - Confirm reservation
- `POST /api/v1/reservations/cancel` - Cancel reservation
- `DELETE /api/v1/reservations/:id` - Delete reservation

### Health Checks

- `GET /health` - Basic health check
- `GET /health/ready` - Readiness check
- `GET /health/live` - Liveness check

### Kafka Events

#### Emitted Events

- `reservation.created` - When a reservation is created
- `reservation.confirmed` - When a reservation is confirmed
- `reservation.cancelled` - When a reservation is cancelled
- `reservation.expired` - When a reservation expires

#### Consumed Events

- `payment.completed` - Confirms reservation when payment succeeds
- `payment.failed` - Cancels reservation when payment fails

## Environment Variables

```bash
NODE_ENV=development
PORT=3002
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=reservation_service
KAFKA_BROKER=localhost:9092
KAFKA_CLIENT_ID=reservation-service
KAFKA_GROUP_ID=reservation-service-group
```

## Installation

```bash
npm install
```

## Running the Service

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Database Schema

### Reservations Table

- `id` (UUID, Primary Key)
- `user_id` (UUID)
- `event_id` (UUID)
- `status` (enum: pending, confirmed, cancelled, expired)
- `total_amount` (decimal)
- `expires_at` (timestamp)
- `confirmed_at` (timestamp, nullable)
- `cancelled_at` (timestamp, nullable)
- `notes` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Reservation Items Table

- `id` (UUID, Primary Key)
- `reservation_id` (UUID, Foreign Key)
- `seat_id` (UUID, nullable)
- `ticket_type` (string)
- `quantity` (integer)
- `unit_price` (decimal)
- `total_price` (decimal)
- `created_at` (timestamp)
- `updated_at` (timestamp)

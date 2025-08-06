# User Service

The User Service is a NestJS-based microservice that handles user authentication, authorization, and user management for the Event Reservation System.

## Features

- User registration and login
- JWT-based authentication
- Role-based access control (User, Admin, Manager)
- Password management
- User profile management
- Redis-based session management
- TypeORM with PostgreSQL
- Swagger API documentation
- Input validation and transformation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-token` - Verify access token

### User Management
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/profile` - Update current user profile
- `PATCH /api/users/:id` - Update user by ID (Admin only)
- `POST /api/users/change-password` - Change user password
- `PATCH /api/users/:id/email-verification` - Update email verification status (Admin only)
- `PATCH /api/users/:id/status` - Update user active status (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

## Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=event_system

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-jwt-access-key-here
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key-here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Server Configuration
PORT=3006
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 13+
- Redis 6+

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env
```

### Database Setup

1. Create a PostgreSQL database named `event_system`
2. The service will automatically create the required tables on startup

### Running the Service

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

The service will be available at `http://localhost:3006`

### API Documentation

Swagger documentation is available at `http://localhost:3006/api/docs`

## Architecture

The service follows NestJS best practices with:

- **Modular Architecture**: Separate modules for Auth and User functionality
- **Dependency Injection**: Leveraging NestJS's built-in DI container
- **Database Integration**: TypeORM with PostgreSQL for data persistence
- **Caching**: Redis for session management and token storage
- **Security**: JWT authentication, bcrypt password hashing, helmet security headers
- **Validation**: Class-validator for input validation
- **Documentation**: Swagger/OpenAPI specification

## Project Structure

```
src/
├── app.module.ts          # Main application module
├── main.ts               # Application entry point
├── auth/                 # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── redis.service.ts
│   ├── dto/
│   ├── guards/
│   ├── strategies/
│   └── decorators/
└── user/                 # User management module
    ├── user.controller.ts
    ├── user.service.ts
    ├── user.module.ts
    ├── entities/
    └── dto/
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Docker

```bash
# Build Docker image
docker build -t user-service .

# Run with Docker Compose
docker-compose up user-service
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests per minute)
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Role-based access control

## Contributing

1. Follow NestJS coding standards
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass before submitting PR

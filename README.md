# 🎫 Event Reservation System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3%2B-black.svg)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0%2B-red.svg)](https://nestjs.com/)
[![GitHub issues](https://img.shields.io/github/issues/GranFenrir/event-reservation-system.svg)](https://github.com/GranFenrir/event-reservation-system/issues)
[![GitHub stars](https://img.shields.io/github/stars/GranFenrir/event-reservation-system.svg)](https://github.com/GranFenrir/event-reservation-system/stargazers)

A modern, scalable event reservation system built with **microservices architecture**, featuring real-time seat selection, secure payment processing, and comprehensive event management capabilities.

## ✨ Features

### 🎯 User Features
- **Event Discovery**: Browse events with rich details and filtering
- **Interactive Seat Selection**: Real-time seat availability and selection
- **Multiple Ticket Types**: VIP, Premium, Standard, and Economy options
- **Secure Payments**: Integrated payment processing with multiple methods
- **Email Notifications**: Automated booking confirmations and updates
- **User Dashboard**: Manage reservations and view purchase history

### 🛠️ Admin Features
- **Event Management**: Complete CRUD operations for events
- **Venue Configuration**: Setup venues with detailed seat layouts
- **Real-time Monitoring**: Live reservation tracking and analytics
- **Sales Reports**: Comprehensive analytics and reporting dashboard
- **User Management**: Admin controls for user accounts and permissions

### 🚀 Technical Highlights
- **Microservices Architecture**: Scalable, maintainable service separation
- **TypeScript**: Full type safety across frontend and backend
- **Real-time Updates**: Live seat availability and booking status
- **Database per Service**: Independent data management for each service
- **RESTful APIs**: Well-documented API endpoints with proper error handling
- **Responsive Design**: Mobile-first, modern UI/UX

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Admin Panel    │
│   (Next.js)     │    │  (React Admin)  │
│   Port: 3000    │    │   Port: 3010    │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┼───────────────────────┐
                                 │                       │
    ┌────────────────────────────┼───────────────────────┼────────────────┐
    │                            │                       │                │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Event Service   │    │Reservation Svc  │    │ Payment Service │    │   User Service  │
│   Port: 3001    │    │   Port: 3002    │    │   Port: 3003    │    │   Port: 3006    │
│   TypeORM/DB    │    │   TypeORM/DB    │    │   TypeORM/DB    │    │   TypeORM/DB    │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
                                 │                                              │
                   ┌─────────────────┐                           ┌─────────────────┐
                   │  Mail Service   │                           │Reporting Service│
                   │   Port: 3004    │                           │   Port: 3005    │
                   │   TypeORM/DB    │                           │   TypeORM/DB    │
                   └─────────────────┘                           └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **Git**
- **PostgreSQL** (recommended) or use SQLite for development

> **Note**: The project defaults to PostgreSQL. For quick development, services can fallback to SQLite by setting `DB_TYPE=sqlite` in environment variables.

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/GranFenrir/event-reservation-system.git
cd event-reservation-system
```

2. **Install dependencies for all services**
```bash
npm install
cd frontend && npm install
cd ../admin-panel && npm install
cd ../microservices/event-service && npm install
cd ../reservation-service && npm install
cd ../payment-service && npm install
cd ../mail-service && npm install
cd ../mock-api && npm install
```

3. **Start all services using scripts**
```bash
# Option 1: Start all services at once (recommended)
./scripts/start-all.sh

# Option 2: Start services individually
npm run dev:services

# Option 3: Start frontend only for development
./scripts/start-frontend-only.sh
```

4. **Setup demo data (optional)**
```bash
npm run demo:setup
```

### 🌐 Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | User-facing application |
| Admin Panel | http://localhost:3010 | Admin management interface |
| Event Service | http://localhost:3001/api/v1 | Event management API |
| Reservation Service | http://localhost:3002/api/v1 | Booking and seat management |
| Payment Service | http://localhost:3003/api/v1 | Payment processing |
| Mail Service | http://localhost:3004/api/v1 | Email notifications |
| Reporting Service | http://localhost:3005/api/v1 | Analytics and reports |
| User Service | http://localhost:3006/api/v1 | User management |

## 📁 Project Structure

```
event-reservation-system/
├── 📁 frontend/                  # Next.js user-facing application
│   ├── src/
│   │   ├── app/                 # App router pages
│   │   ├── components/          # Reusable React components
│   │   ├── contexts/            # React contexts
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # API client and utilities
│   │   └── types/               # TypeScript type definitions
│   └── package.json
│
├── 📁 admin-panel/               # React Admin management interface
│   ├── src/
│   │   ├── components/          # Admin components
│   │   ├── dataProvider.ts      # Data provider for React Admin
│   │   └── authProvider.ts      # Authentication provider
│   └── package.json
│
├── 📁 microservices/             # Backend microservices
│   ├── 📁 event-service/        # Event management service
│   │   ├── src/
│   │   │   ├── controllers/     # REST API controllers
│   │   │   ├── services/        # Business logic
│   │   │   ├── entities/        # Database entities
│   │   │   ├── dto/             # Data transfer objects
│   │   │   └── main.ts          # Service entry point
│   │   └── package.json
│   │
│   ├── 📁 reservation-service/  # Booking and seat management
│   ├── 📁 payment-service/      # Payment processing
│   ├── 📁 mail-service/         # Email notifications
│   ├── 📁 user-service/         # User management and authentication
│   └── 📁 reporting-service/    # Analytics and reporting
│
├── 📁 shared/                    # Shared types and utilities
│   ├── src/
│   │   ├── types/               # Common TypeScript types
│   │   └── utils/               # Shared utility functions
│   └── package.json
│
├── 📁 scripts/                  # Automation and setup scripts
│   ├── start-all.sh            # Start all services
│   ├── setup-demo.js           # Create demo data
│   ├── test-integration.sh     # Integration testing
│   └── validate-architecture.sh # Architecture validation
│
├── � README.md                 # This file
├── 📄 SETUP.md                  # Detailed setup guide
├── 📄 CONTRIBUTING.md           # Contribution guidelines
└── 📄 package.json              # Root package configuration
```

## 🛠️ Development

### Environment Configuration

Each service uses environment variables for configuration:

**Frontend (.env.local)**
```env
NEXT_PUBLIC_USE_MICROSERVICES=true
NEXT_PUBLIC_EVENT_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_RESERVATION_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:3003
NEXT_PUBLIC_MAIL_SERVICE_URL=http://localhost:3004
```

**Microservices (.env)**
```env
PORT=3001
# Database Configuration (PostgreSQL is recommended)
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=event_service

# Alternative: SQLite for development
# DB_TYPE=sqlite
# DB_DATABASE=./event-service.sqlite

NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Running Individual Services

```bash
# Frontend development server
cd frontend
npm run dev

# Individual microservice
cd microservices/event-service
npm run start:dev

# Admin panel
cd admin-panel
npm run dev

# Using convenience scripts
./scripts/start-frontend-only.sh    # Frontend + Admin only
./scripts/test-services.sh          # Test all services
./scripts/validate-architecture.sh  # Validate setup
```

### Building for Production

```bash
# Build all services
npm run build:all

# Build individual service
cd frontend
npm run build
```

### Testing

```bash
# Run integration tests
./scripts/test-integration.sh

# Test individual service
./scripts/test-services.sh

# Run frontend tests
cd frontend
npm test

# Run tests for specific microservice
cd microservices/event-service
npm test
```

## 🛠️ Automation Scripts

The project includes several automation scripts for easier development and deployment:

| Script | Purpose | Usage |
|--------|---------|-------|
| `start-all.sh` | Start all services with dependency checking | `./scripts/start-all.sh` |
| `start-frontend-only.sh` | Start only frontend and admin panel | `./scripts/start-frontend-only.sh` |
| `setup-demo.js` | Create sample data for demonstration | `npm run demo:setup` |
| `test-integration.sh` | Test all microservice endpoints | `./scripts/test-integration.sh` |
| `test-services.sh` | Test individual services | `./scripts/test-services.sh` |
| `validate-architecture.sh` | Validate complete system setup | `./scripts/validate-architecture.sh` |
| `cleanup-project.sh` | Clean build artifacts and dependencies | `./scripts/cleanup-project.sh` |

### Script Features:
- ✅ **Prerequisite checking** (Node.js, npm versions)
- ✅ **Automatic dependency installation**
- ✅ **Health monitoring** for all services
- ✅ **Colored output** for better readability
- ✅ **Error handling** and graceful failures

## 📚 API Documentation

### Event Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/events` | Get all events |
| GET | `/api/v1/events/:id` | Get event by ID |
| POST | `/api/v1/events` | Create new event |
| PUT | `/api/v1/events/:id` | Update event |
| DELETE | `/api/v1/events/:id` | Delete event |

### Reservation Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/reservations` | Get all reservations |
| POST | `/api/v1/reservations` | Create reservation |
| GET | `/api/v1/reservations/:id` | Get reservation by ID |
| DELETE | `/api/v1/reservations/:id` | Cancel reservation |

### Example API Usage

```javascript
// Create a new event
const eventData = {
  title: "Summer Music Festival",
  description: "A fantastic outdoor music festival",
  startDate: "2025-08-15T18:00:00.000Z",
  endDate: "2025-08-15T23:00:00.000Z",
  saleStartDate: "2025-07-01T00:00:00.000Z",
  saleEndDate: "2025-08-15T17:00:00.000Z",
  category: "Music",
  totalSeats: 500,
  venueId: "venue-uuid",
  ticketPrices: [{
    type: "standard",
    name: "General Admission",
    price: 75.00,
    maxQuantity: 400
  }]
};

const response = await fetch('http://localhost:3001/api/v1/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(eventData)
});
```

## 🔧 Technology Stack

### Frontend
- **Next.js 15.3** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

### Backend
- **NestJS 10** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **TypeORM** - Object-relational mapping
- **PostgreSQL** - Primary database (production recommended)
- **SQLite** - Development/testing database option
- **Class Validator** - Validation decorators
- **JWT** - Authentication and authorization

### Admin Panel
- **React Admin** - Admin interface framework
- **Material-UI** - React component library

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/GranFenrir/event-reservation-system/issues) page
2. Read the [SETUP.md](SETUP.md) for detailed setup instructions
3. Use the validation script: `./scripts/validate-architecture.sh`
4. Create a new issue with detailed information about your problem

## 🎯 Roadmap

- [x] Microservices architecture with 6 independent services
- [x] TypeScript implementation across all services
- [x] React Admin panel for management
- [x] Automated setup and testing scripts
- [ ] Docker containerization for easy deployment
- [ ] Event-driven architecture with message queues
- [ ] Real-time notifications with WebSockets
- [ ] Advanced analytics and reporting dashboard
- [ ] Mobile app development
- [ ] Payment gateway integrations (Stripe, PayPal)
- [ ] Multi-language support (i18n)
- [ ] Performance optimization and Redis caching

## 👥 Authors

- **GranFenrir** - *Initial work* - [GitHub Profile](https://github.com/GranFenrir)


**⭐ Star this repository if you find it helpful!**

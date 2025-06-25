# 🎫 Event Reservation System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3%2B-black.svg)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0%2B-red.svg)](https://nestjs.com/)

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
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Admin Panel    │    │   Mock API      │
│   (Next.js)     │    │  (React Admin)  │    │   (Express)     │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 3010    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
    ┌────────────────────────────┼────────────────────────────┐
    │                            │                            │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Event Service   │    │Reservation Svc  │    │ Payment Service │
│   Port: 3001    │    │   Port: 3002    │    │   Port: 3003    │
│   SQLite DB     │    │   SQLite DB     │    │   SQLite DB     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                 │
                       ┌─────────────────┐
                       │  Mail Service   │
                       │   Port: 3004    │
                       │   SQLite DB     │
                       └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/event-reservation-system.git
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

3. **Start all services**
```bash
# Start all microservices
npm run start:services

# Start frontend (in new terminal)
cd frontend && npm run dev

# Start admin panel (in new terminal)
cd admin-panel && npm run dev
```

### 🌐 Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | User-facing application |
| Admin Panel | http://localhost:3001 | Admin management interface |
| Event Service | http://localhost:3001/api/v1 | Event management API |
| Reservation Service | http://localhost:3002/api/v1 | Booking and seat management |
| Payment Service | http://localhost:3003/api/v1 | Payment processing |
| Mail Service | http://localhost:3004/api/v1 | Email notifications |
| Mock API | http://localhost:3010/api | Development mock server |

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
│   └── 📁 mail-service/         # Email notifications
│
├── 📁 shared/                    # Shared types and utilities
│   ├── src/
│   │   ├── types/               # Common TypeScript types
│   │   ├── enums/               # Shared enumerations
│   │   └── interfaces/          # Common interfaces
│   └── package.json
│
├── 📁 mock-api/                  # Development mock server
├── 📄 MICROSERVICES_SETUP.md    # Detailed setup guide
├── 📄 CONTRIBUTING.md            # Contribution guidelines
└── 📄 package.json               # Root package configuration
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
DATABASE_URL=./event-service.sqlite
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

# Mock API (for development)
cd mock-api
npm start
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
# Run all tests
npm test

# Run tests for specific service
cd microservices/event-service
npm test

# Run E2E tests
npm run test:e2e
```

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
- **SQLite** - Lightweight SQL database
- **TypeORM** - Object-relational mapping
- **Class Validator** - Validation decorators

### Admin Panel
- **React Admin** - Admin interface framework
- **Material-UI** - React component library

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/event-reservation-system/issues) page
2. Read the [MICROSERVICES_SETUP.md](MICROSERVICES_SETUP.md) for detailed setup instructions
3. Create a new issue with detailed information about your problem

## 🎯 Roadmap

- [ ] Docker containerization for easy deployment
- [ ] Event-driven architecture with Kafka integration
- [ ] Real-time notifications with WebSockets
- [ ] Advanced analytics and reporting
- [ ] Mobile app development
- [ ] Payment gateway integrations (Stripe, PayPal)
- [ ] Multi-language support (i18n)
- [ ] Performance optimization and caching

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Thanks to the NestJS and Next.js communities for excellent frameworks
- Inspired by modern event management systems
- Built with love for the developer community

---

**⭐ Star this repository if you find it helpful!**

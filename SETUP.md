# 🚀 Quick Setup Guide

This guide will help you get the Event Reservation System up and running quickly.

## 📋 Prerequisites

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** v8 or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

## ⚡ Quick Start (5 minutes)

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/event-reservation-system.git
cd event-reservation-system

# Install all dependencies
npm install
cd frontend && npm install
cd ../admin-panel && npm install
cd ../microservices/event-service && npm install
cd ../reservation-service && npm install
cd ../payment-service && npm install
cd ../mail-service && npm install
cd ../..
```

### 2. Start All Services

**Option A: Use the helper scripts**

For Windows:
```bash
# Run the batch script
.\scripts\start-all.bat

# OR run the PowerShell script
.\scripts\start-all.ps1
```

For macOS/Linux:
```bash
# Make script executable and run
chmod +x scripts/start-all.sh
./scripts/start-all.sh
```

**Option B: Manual start (if scripts don't work)**

Open 6 separate terminals and run:

```bash
# Terminal 1: Event Service
cd microservices/event-service
npm start

# Terminal 2: Reservation Service
cd microservices/reservation-service
npm start

# Terminal 3: Payment Service
cd microservices/payment-service
npm start

# Terminal 4: Mail Service
cd microservices/mail-service
npm start

# Terminal 5: Frontend
cd frontend
npm run dev

# Terminal 6: Admin Panel
cd admin-panel
npm run dev
```

### 3. Access the Applications

Once all services are running:

- **Frontend (Users)**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **API Documentation**: Available at each service endpoint

## 🔧 Configuration

### Environment Variables

The system uses environment variables for configuration:

**Frontend** (create `frontend/.env.local`):
```env
NEXT_PUBLIC_USE_MICROSERVICES=true
NEXT_PUBLIC_EVENT_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_RESERVATION_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:3003
NEXT_PUBLIC_MAIL_SERVICE_URL=http://localhost:3004
```

**Microservices** (each service has its own `.env`):
```env
PORT=3001
DATABASE_URL=./service-name.sqlite
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## 🧪 Testing the System

### 1. Create a Test Venue

```bash
curl -X POST http://localhost:3001/api/v1/venues \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Venue",
    "description": "A test venue",
    "address": "123 Test Street",
    "city": "Test City",
    "country": "Test Country",
    "capacity": 1000
  }'
```

### 2. Create a Test Event

```bash
curl -X POST http://localhost:3001/api/v1/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "description": "A test event",
    "startDate": "2025-07-01T18:00:00.000Z",
    "endDate": "2025-07-01T22:00:00.000Z",
    "saleStartDate": "2025-06-25T00:00:00.000Z",
    "saleEndDate": "2025-07-01T17:00:00.000Z",
    "category": "Music",
    "totalSeats": 100,
    "venueId": "YOUR_VENUE_ID_HERE",
    "ticketPrices": [{
      "type": "standard",
      "name": "General Admission",
      "price": 50.00,
      "maxQuantity": 100
    }]
  }'
```

### 3. View Events

Open http://localhost:3000 in your browser to see the events.

## 🛠️ Development

### File Structure
```
event-reservation-system/
├── frontend/                 # Next.js user interface
├── admin-panel/             # React Admin panel
├── microservices/           # Backend services
│   ├── event-service/       # Events and venues
│   ├── reservation-service/ # Bookings and seats
│   ├── payment-service/     # Payment processing
│   └── mail-service/        # Email notifications
├── shared/                  # Shared TypeScript types
└── scripts/                 # Helper scripts
```

### Making Changes

1. **Frontend changes**: Edit files in `frontend/src/`
2. **Backend changes**: Edit files in `microservices/[service-name]/src/`
3. **Shared types**: Edit files in `shared/src/`

Changes will automatically reload during development.

## 🚨 Troubleshooting

### Port Already in Use
If you get port errors, check what's running:
```bash
# Windows
netstat -ano | findstr ":3000"

# macOS/Linux
lsof -i :3000
```

### Services Not Starting
1. Check if Node.js and npm are installed
2. Ensure all dependencies are installed
3. Check the terminal output for specific error messages
4. Make sure no other applications are using the required ports

### Database Issues
The system uses SQLite databases that are automatically created. If you have issues:
1. Delete the `.sqlite` files in each microservice directory
2. Restart the services

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
- Explore the [microservices setup guide](MICROSERVICES_SETUP.md)

## 🆘 Need Help?

- Check the [Issues](https://github.com/yourusername/event-reservation-system/issues) page
- Create a new issue with your problem description
- Include your operating system, Node.js version, and error messages

Happy coding! 🎉

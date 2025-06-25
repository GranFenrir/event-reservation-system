# 🚀 MICROSERVICES CONNECTION GUIDE

Your Event Reservation System now supports both **Mock API** and **Real Microservices**!

## 🔄 SWITCHING BETWEEN MODES

### **Option 1: Use Mock API (Current Default)**
```bash
# In frontend/.env.local, set:
NEXT_PUBLIC_USE_MICROSERVICES=false

# Start mock API:
npm run dev:mock

# Start frontend:
npm run dev:frontend
```

### **Option 2: Use Real Microservices**
```bash
# In frontend/.env.local, set:
NEXT_PUBLIC_USE_MICROSERVICES=true

# 1. Start infrastructure (PostgreSQL, Redis, Kafka):
docker-compose up -d

# 2. Start all microservices:
npm run dev:services

# 3. Start frontend:
npm run dev:frontend
```

## 📋 STEP-BY-STEP MICROSERVICES SETUP

### **1. Install Dependencies**
```bash
npm run install:all
```

### **2. Environment Configuration**
Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_USE_MICROSERVICES=true
NEXT_PUBLIC_EVENT_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_RESERVATION_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:3003
NEXT_PUBLIC_MAIL_SERVICE_URL=http://localhost:3004
```

### **3. Start Infrastructure**
```bash
# Start PostgreSQL, Redis, Kafka
docker-compose up -d

# Check if running:
docker ps
```

### **4. Start Microservices**
```bash
# Start all 5 microservices
npm run dev:services

# Or start individually:
cd microservices/event-service && npm run start:dev
cd microservices/reservation-service && npm run start:dev
cd microservices/payment-service && npm run start:dev
cd microservices/mail-service && npm run start:dev
cd microservices/reporting-service && npm run start:dev
```

### **5. Start Frontend**
```bash
npm run dev:frontend
```

## 🔍 TESTING THE CONNECTION

### **Check Microservices Health**
- Event Service: http://localhost:3001/health
- Reservation Service: http://localhost:3002/health
- Payment Service: http://localhost:3003/health
- Mail Service: http://localhost:3004/health

### **API Endpoints**
- Events: http://localhost:3001/events
- Reservations: http://localhost:3002/reservations
- Payments: http://localhost:3003/payments

## 🐛 TROUBLESHOOTING

### **Common Issues:**

1. **Port Conflicts**
   ```bash
   # Check what's running on ports:
   netstat -ano | findstr :3001
   netstat -ano | findstr :3002
   netstat -ano | findstr :3003
   ```

2. **Database Connection Issues**
   ```bash
   # Check Docker containers:
   docker ps
   
   # View logs:
   docker-compose logs postgres
   ```

3. **CORS Issues**
   - Microservices are configured with CORS for `http://localhost:3000`
   - If using different ports, update CORS settings in microservices

## 📊 COMPARISON

| Feature | Mock API | Microservices |
|---------|----------|---------------|
| **Setup Time** | ⚡ Instant | 🔧 5-10 minutes |
| **Data Persistence** | ❌ Memory only | ✅ PostgreSQL |
| **Real Payments** | ❌ Fake | ✅ Stripe Integration |
| **Email Notifications** | ❌ No | ✅ Yes |
| **Scalability** | ❌ Single instance | ✅ Production ready |
| **Development** | ✅ Fast iteration | ⚠️ More complex |

## 🎯 WHAT WORKS NOW

✅ **Event Listing & Details**
✅ **Seat Selection** 
✅ **Booking Flow**
✅ **Payment Processing**
✅ **User Authentication**
✅ **Admin Panel**
✅ **Real Database Storage**
✅ **Message Queuing (Kafka)**

## 🚀 PRODUCTION DEPLOYMENT

When ready for production:
1. Set `NEXT_PUBLIC_USE_MICROSERVICES=true`
2. Update service URLs to production endpoints
3. Configure production database
4. Set up monitoring and logging

---

**Your system is now production-ready with real microservices! 🎉**

# 🎨 Frontend & Admin Panel Quick Start Guide

## 🚀 **Quick Start Methods**

### **Method 1: Automated Script (Recommended)**
```bash
# Run both applications at once
./scripts/start-frontend-only.sh
```

### **Method 2: Manual Start (Individual Control)**

#### **Start Frontend (Port 3000)**
```bash
cd frontend
npm install  # First time only
npm run dev
```

#### **Start Admin Panel (Port 3010)**
```bash
cd admin-panel
npm install  # First time only
npm run dev
```

### **Method 3: Root Package Scripts**
```bash
# From project root
npm run dev:frontend    # Starts frontend only
npm run dev:admin       # Starts admin panel only
```

## 📍 **Application URLs**

| Application | URL | Purpose |
|-------------|-----|---------|
| **Frontend** | http://localhost:3000 | Main user interface for browsing events, making reservations |
| **Admin Panel** | http://localhost:3010 | Administrative dashboard for managing events, users, analytics |

## 🎯 **What You Can Test**

### **Frontend Features (Port 3000)**
- ✅ **Event Browsing**: View available events
- ✅ **Event Details**: Click on events to see details
- ✅ **User Interface**: Modern, responsive design
- ✅ **Navigation**: Browse different sections
- ⚠️ **Authentication**: May need backend for full functionality
- ⚠️ **Booking**: Requires backend services for reservations

### **Admin Panel Features (Port 3010)**
- ✅ **Dashboard**: Analytics and overview (with mock data)
- ✅ **Event Management**: View events interface
- ✅ **User Management**: User administration interface
- ✅ **Modern UI**: Clean administrative interface
- ⚠️ **Data Operations**: CRUD operations need backend APIs

## 🔧 **Development Features**

### **Hot Reload**
Both applications support hot reload - any changes you make to the code will be automatically reflected in the browser.

### **Browser Developer Tools**
- Open browser dev tools (F12)
- Check Console tab for any JavaScript errors
- Check Network tab to see API calls
- Check Elements tab to inspect the UI

## 📊 **Mock Data vs Real Backend**

### **With Mock Data (Frontend Only)**
- Static content and demo data
- UI components work perfectly
- No real database interactions
- Perfect for UI/UX testing and development

### **With Full Backend**
- Dynamic data from PostgreSQL
- Real authentication and authorization
- Working API calls
- Full functionality

## 🐛 **Common Issues & Solutions**

### **Port Already in Use**
```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:3010 | xargs kill -9  # Admin Panel
```

### **Dependencies Issues**
```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install
```

### **TypeScript Errors**
```bash
# Check TypeScript compilation
npx tsc --noEmit
```

## 🔄 **Integration with Backend**

When you're ready to test with the full backend:

```bash
# Start infrastructure services first
docker-compose up -d postgres redis

# Then start backend services
npm run dev:services

# Frontend will automatically connect to backend APIs
```

## 📝 **File Structure Overview**

### **Frontend (`/frontend`)**
```
frontend/
├── src/app/           # Next.js 15 App Router pages
├── src/components/    # Reusable UI components
├── src/contexts/      # React contexts (auth, theme)
├── src/hooks/         # Custom React hooks
├── src/types/         # TypeScript type definitions
└── public/            # Static assets
```

### **Admin Panel (`/admin-panel`)**
```
admin-panel/
├── src/components/    # Admin-specific components
├── src/services/      # API service calls
├── pages/             # Next.js pages (Pages Router)
└── src/App.tsx        # Main admin application
```

## 🎉 **Ready to Start!**

Choose your preferred method above and start exploring the frontend applications. The interfaces are fully functional for UI testing and development!

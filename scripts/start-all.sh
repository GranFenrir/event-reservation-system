#!/bin/bash

# Event Reservation System - Start All Services
# This script starts all microservices and the frontend

echo "🚀 Starting Event Reservation System..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start microservices in background
echo "🔧 Starting microservices..."

# Event Service
echo "🎪 Starting Event Service on port 3001..."
cd microservices/event-service
npm run start:dev &
EVENT_PID=$!
cd ../..

# Reservation Service  
echo "🎫 Starting Reservation Service on port 3002..."
cd microservices/reservation-service
npm run start:dev &
RESERVATION_PID=$!
cd ../..

# Payment Service
echo "💳 Starting Payment Service on port 3003..."
cd microservices/payment-service
npm run start:dev &
PAYMENT_PID=$!
cd ../..

# Mail Service
echo "📧 Starting Mail Service on port 3004..."
cd microservices/mail-service
npm run start:dev &
MAIL_PID=$!
cd ../..

# Reporting Service
echo "📊 Starting Reporting Service on port 3005..."
cd microservices/reporting-service
npm run start:dev &
REPORTING_PID=$!
cd ../..

# User Service
echo "👤 Starting User Service on port 3006..."
cd microservices/user-service
npm run start:dev &
USER_PID=$!
cd ../..

# Wait a moment for services to start
sleep 5

# Start frontend
echo "🌐 Starting Frontend on port 3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Start admin panel
echo "👨‍💼 Starting Admin Panel on port 3010..."
cd admin-panel  
npm run dev &
ADMIN_PID=$!
cd ..

echo ""
echo "🎉 All services started successfully!"
echo ""
echo "📍 Service URLs:"
echo "   Frontend:         http://localhost:3000"
echo "   Admin Panel:      http://localhost:3010"  
echo "   Event Service:    http://localhost:3001/api/v1"
echo "   Reservation Svc:  http://localhost:3002/api/v1"
echo "   Payment Service:  http://localhost:3003/api/v1"
echo "   Mail Service:     http://localhost:3004/api/v1"
echo "   Reporting Svc:    http://localhost:3005/api/v1"
echo "   User Service:     http://localhost:3006/api/v1"
echo ""
echo "🛑 To stop all services, press Ctrl+C or run: ./scripts/stop-services.sh"
echo ""

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $EVENT_PID $RESERVATION_PID $PAYMENT_PID $MAIL_PID $REPORTING_PID $USER_PID $FRONTEND_PID $ADMIN_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup SIGINT SIGTERM

# Wait for all background processes
wait

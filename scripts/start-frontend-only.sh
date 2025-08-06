#!/bin/bash

# 🎨 Frontend & Admin Panel Startup Script
# This script starts only the frontend applications without backend services

set -e

echo "🎨 Starting Frontend & Admin Panel Applications"
echo "=============================================="

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port $1 is already in use"
        return 1
    fi
    return 0
}

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping frontend applications..."
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$ADMIN_PID" ]; then
        kill $ADMIN_PID 2>/dev/null || true
    fi
    echo "✅ Frontend applications stopped"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup SIGINT SIGTERM

echo ""
echo "🔍 Checking prerequisites..."
echo "----------------------------"

# Check if node_modules exist
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

if [ ! -d "admin-panel/node_modules" ]; then
    echo "📦 Installing admin panel dependencies..."
    cd admin-panel && npm install && cd ..
fi

if [ ! -d "shared/node_modules" ]; then
    echo "📦 Installing shared dependencies..."
    cd shared && npm install && cd ..
fi

echo ""
echo "🔍 Checking ports..."
echo "-------------------"

# Check if ports are available
if ! check_port 3000; then
    echo "❌ Frontend port 3000 is occupied. Please stop the service or use a different port."
    exit 1
fi

if ! check_port 3010; then
    echo "❌ Admin panel port 3010 is occupied. Please stop the service or use a different port."
    exit 1
fi

echo "✅ Ports 3000 and 3010 are available"

echo ""
echo "🚀 Starting applications..."
echo "--------------------------"

# Start Frontend (Main User Interface)
echo "🌐 Starting Frontend on http://localhost:3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait a moment for frontend to start
sleep 3

# Start Admin Panel
echo "🛠️  Starting Admin Panel on http://localhost:3010..."
cd admin-panel
npm run dev &
ADMIN_PID=$!
cd ..

# Wait for both to fully start
echo "⏳ Waiting for applications to start..."
sleep 5

echo ""
echo "🎉 Frontend applications started successfully!"
echo ""
echo "📍 Application URLs:"
echo "===================="
echo "🌐 Frontend (Users):     http://localhost:3000"
echo "🛠️  Admin Panel:         http://localhost:3010"
echo ""
echo "📝 Note:"
echo "========"
echo "• Frontend is the main user interface for event browsing and reservations"
echo "• Admin Panel is for managing events, users, and viewing analytics"
echo "• Both run independently and can work with mock data"
echo ""
echo "🔧 Development Tips:"
echo "==================="
echo "• Both applications support hot reload - changes will be reflected automatically"
echo "• Check browser console for any errors"
echo "• Use browser dev tools to inspect network requests"
echo ""
echo "🛑 To stop applications:"
echo "======================="
echo "• Press Ctrl+C in this terminal"
echo "• Or close this terminal window"
echo ""

# Show real-time logs (optional)
echo "📊 Applications are running. Press Ctrl+C to stop all services."
echo "================================================================"

# Keep script running and show some status
while true; do
    sleep 30
    echo "⏰ $(date '+%H:%M:%S') - Frontend applications running..."
done

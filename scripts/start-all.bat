@echo off
echo 🚀 Starting Event Reservation System...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18 or higher.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

echo 🔧 Starting microservices...

REM Start Event Service
echo 🎪 Starting Event Service on port 3001...
start "Event Service" cmd /k "cd microservices\event-service && npm start"

REM Wait a moment
timeout /t 3 /nobreak >nul

REM Start Reservation Service
echo 🎫 Starting Reservation Service on port 3002...
start "Reservation Service" cmd /k "cd microservices\reservation-service && npm start"

REM Wait a moment
timeout /t 3 /nobreak >nul

REM Start Payment Service
echo 💳 Starting Payment Service on port 3003...
start "Payment Service" cmd /k "cd microservices\payment-service && npm start"

REM Wait a moment
timeout /t 3 /nobreak >nul

REM Start Mail Service
echo 📧 Starting Mail Service on port 3004...
start "Mail Service" cmd /k "cd microservices\mail-service && npm start"

REM Wait for services to start
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Start Frontend
echo 🌐 Starting Frontend on port 3000...
start "Frontend" cmd /k "cd frontend && npm run dev"

REM Wait a moment
timeout /t 3 /nobreak >nul

REM Start Admin Panel
echo 👨‍💼 Starting Admin Panel...
start "Admin Panel" cmd /k "cd admin-panel && npm run dev"

echo.
echo 🎉 All services started successfully!
echo.
echo 📍 Service URLs:
echo    Frontend:         http://localhost:3000
echo    Admin Panel:      http://localhost:3001
echo    Event Service:    http://localhost:3001/api/v1
echo    Reservation Svc:  http://localhost:3002/api/v1
echo    Payment Service:  http://localhost:3003/api/v1
echo    Mail Service:     http://localhost:3004/api/v1
echo.
echo 🛑 To stop services, close the individual command windows or run stop-all.bat
echo.
pause

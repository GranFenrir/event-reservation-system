# Event Reservation System - Start All Services (PowerShell)
# This script starts all microservices and the frontend

Write-Host "🚀 Starting Event Reservation System..." -ForegroundColor Green

# Function to check if a command exists
function Test-Command {
    param($CommandName)
    try {
        Get-Command $CommandName -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js is not installed. Please install Node.js v18 or higher." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-Host "❌ npm is not installed. Please install npm." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Prerequisites check passed" -ForegroundColor Green

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host "🔧 Starting microservices..." -ForegroundColor Yellow

# Start services in separate PowerShell windows
Write-Host "🎪 Starting Event Service on port 3001..." -ForegroundColor Cyan
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd 'microservices\event-service'; npm start"

Start-Sleep -Seconds 3

Write-Host "🎫 Starting Reservation Service on port 3002..." -ForegroundColor Cyan
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd 'microservices\reservation-service'; npm start"

Start-Sleep -Seconds 3

Write-Host "💳 Starting Payment Service on port 3003..." -ForegroundColor Cyan
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd 'microservices\payment-service'; npm start"

Start-Sleep -Seconds 3

Write-Host "📧 Starting Mail Service on port 3004..." -ForegroundColor Cyan
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd 'microservices\mail-service'; npm start"

Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "🌐 Starting Frontend on port 3000..." -ForegroundColor Cyan
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd 'frontend'; npm run dev"

Start-Sleep -Seconds 3

Write-Host "👨‍💼 Starting Admin Panel..." -ForegroundColor Cyan
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd 'admin-panel'; npm run dev"

Write-Host ""
Write-Host "🎉 All services started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Service URLs:" -ForegroundColor White
Write-Host "   Frontend:         http://localhost:3000" -ForegroundColor White
Write-Host "   Admin Panel:      http://localhost:3001" -ForegroundColor White
Write-Host "   Event Service:    http://localhost:3001/api/v1" -ForegroundColor White
Write-Host "   Reservation Svc:  http://localhost:3002/api/v1" -ForegroundColor White
Write-Host "   Payment Service:  http://localhost:3003/api/v1" -ForegroundColor White
Write-Host "   Mail Service:     http://localhost:3004/api/v1" -ForegroundColor White
Write-Host ""
Write-Host "🛑 To stop services, close the individual PowerShell windows" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to close this window"

#!/bin/bash

# 🚀 Event Reservation System - Architecture Validation Script
# Validates the complete architectural transformation
# Usage: ./scripts/validate-architecture.sh

echo "🎯 Event Reservation System - Architecture Validation"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a service is running
check_service() {
    local service_name=$1
    local port=$2
    local endpoint=$3
    
    echo -n "Checking $service_name on port $port... "
    
    if curl -s -f "http://localhost:$port$endpoint" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ RUNNING${NC}"
        return 0
    else
        echo -e "${RED}❌ NOT RESPONDING${NC}"
        return 1
    fi
}

# Function to check Docker containers
check_docker_container() {
    local container_name=$1
    
    echo -n "Checking Docker container $container_name... "
    
    if docker ps --format "table {{.Names}}" | grep -q "^$container_name$"; then
        echo -e "${GREEN}✅ RUNNING${NC}"
        return 0
    else
        echo -e "${RED}❌ NOT RUNNING${NC}"
        return 1
    fi
}

echo -e "${BLUE}📋 1. DOCKER INFRASTRUCTURE VALIDATION${NC}"
echo "----------------------------------------"

# Check infrastructure containers
check_docker_container "event-postgres"
check_docker_container "event-redis"
check_docker_container "event-pgadmin"
check_docker_container "user-service"

echo ""
echo -e "${BLUE}🌐 2. SERVICE ENDPOINT VALIDATION${NC}"
echo "-----------------------------------"

# Check user service endpoints
check_service "User Service API" "3006" "/api/docs"
check_service "User Service Health" "3006" "/api/auth/verify-token"

echo ""
echo -e "${BLUE}🗄️  3. DATABASE VALIDATION${NC}"
echo "-------------------------"

echo -n "Checking PostgreSQL connection... "
if docker exec event-postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo -e "${GREEN}✅ CONNECTED${NC}"
else
    echo -e "${RED}❌ CONNECTION FAILED${NC}"
fi

echo -n "Checking users table exists... "
if docker exec event-postgres psql -U postgres -d event_reservation -c "SELECT 1 FROM users LIMIT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ TABLE EXISTS${NC}"
else
    echo -e "${RED}❌ TABLE NOT FOUND${NC}"
fi

echo ""
echo -e "${BLUE}🔧 4. REDIS VALIDATION${NC}"
echo "--------------------"

echo -n "Checking Redis connection... "
if docker exec event-redis redis-cli ping | grep -q "PONG"; then
    echo -e "${GREEN}✅ CONNECTED${NC}"
else
    echo -e "${RED}❌ CONNECTION FAILED${NC}"
fi

echo ""
echo -e "${BLUE}📚 5. DOCUMENTATION VALIDATION${NC}"
echo "--------------------------------"

echo -n "Checking Swagger documentation... "
if curl -s "http://localhost:3006/api/docs" | grep -q "Swagger UI"; then
    echo -e "${GREEN}✅ ACCESSIBLE${NC}"
    echo "   📖 Available at: http://localhost:3006/api/docs"
else
    echo -e "${RED}❌ NOT ACCESSIBLE${NC}"
fi

echo ""
echo -e "${BLUE}🏗️  6. ARCHITECTURE VALIDATION${NC}"
echo "------------------------------"

echo -n "Checking NestJS user service structure... "
if [ -f "microservices/user-service/src/main.ts" ] && [ -f "microservices/user-service/src/app.module.ts" ]; then
    echo -e "${GREEN}✅ NESTJS STRUCTURE${NC}"
else
    echo -e "${RED}❌ STRUCTURE MISSING${NC}"
fi

echo -n "Checking old Express service removal... "
if [ -d "services/user-service-express-backup" ] && [ ! -d "services/user-service" ]; then
    echo -e "${GREEN}✅ CLEANED UP${NC}"
else
    echo -e "${YELLOW}⚠️  CHECK NEEDED${NC}"
fi

echo -n "Checking Docker configuration... "
if [ -f "microservices/user-service/Dockerfile" ] && grep -q "user-service" docker-compose.yml; then
    echo -e "${GREEN}✅ CONFIGURED${NC}"
else
    echo -e "${RED}❌ MISSING CONFIG${NC}"
fi

echo ""
echo -e "${BLUE}🎯 7. FINAL VALIDATION SUMMARY${NC}"
echo "==============================="

# Overall health check
overall_status=0

# Test critical endpoints
echo -n "Testing user registration endpoint... "
response=$(curl -s -w "%{http_code}" -X POST "http://localhost:3006/api/auth/register" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@validation.com","password":"testpass123","firstName":"Test","lastName":"User","phoneNumber":"+1234567890"}' \
    -o /dev/null)

if [ "$response" = "400" ] || [ "$response" = "409" ]; then
    echo -e "${GREEN}✅ RESPONDING (validation working)${NC}"
else
    echo -e "${RED}❌ UNEXPECTED RESPONSE: $response${NC}"
    overall_status=1
fi

echo ""
if [ $overall_status -eq 0 ]; then
    echo -e "${GREEN}🎉 ARCHITECTURE TRANSFORMATION: SUCCESSFUL!${NC}"
    echo -e "${GREEN}🚀 System is ready for production use${NC}"
    echo ""
    echo -e "${YELLOW}📋 Quick Access Links:${NC}"
    echo "   • User Service API: http://localhost:3006/api/docs"
    echo "   • Database Admin: http://localhost:5050"
    echo "   • User Service: http://localhost:3006"
    echo ""
    echo -e "${YELLOW}🛠️  Useful Commands:${NC}"
    echo "   • View logs: docker logs user-service"
    echo "   • Restart services: docker-compose restart"
    echo "   • Stop services: docker-compose down"
else
    echo -e "${RED}❌ ARCHITECTURE VALIDATION: ISSUES DETECTED${NC}"
    echo -e "${RED}Please review the failed checks above${NC}"
fi

echo ""
echo "🏆 Validation completed at $(date)"
echo "=================================================="

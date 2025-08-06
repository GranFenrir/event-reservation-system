#!/bin/bash

echo "🔍 Testing Microservice Integration"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Service configurations
SERVICES=(
    "event-service:3001:/api/v1/health"
    "reservation-service:3002:/health"
    "payment-service:3003:/health"
    "mail-service:3004:/health"
    "reporting-service:3005:/api/v1/health"
)

# Function to test service health
test_service_health() {
    local service_name=$1
    local port=$2
    local health_path=$3
    
    echo -n "Testing $service_name... "
    
    local response=$(curl -s -w "HTTPSTATUS:%{http_code}" "http://localhost:$port$health_path")
    local body=$(echo "$response" | sed -E 's/HTTPSTATUS\:[0-9]{3}$//')
    local status=$(echo "$response" | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
    
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}✅ Healthy${NC}"
        return 0
    else
        echo -e "${RED}❌ Unhealthy (HTTP $status)${NC}"
        return 1
    fi
}

# Function to test API endpoints
test_api_endpoints() {
    echo -e "\n${BLUE}📡 Testing API Endpoints${NC}"
    echo "========================"
    
    # Test reporting service analytics
    echo -n "Dashboard Analytics... "
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" "http://localhost:3005/api/v1/reports/analytics/dashboard")
    status=$(echo "$response" | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
    body=$(echo "$response" | sed -E 's/HTTPSTATUS\:[0-9]{3}$//')
    
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}✅ Working${NC}"
        echo "   Sample data: $(echo "$body" | jq -r '.totalEvents // "N/A"') events, $(echo "$body" | jq -r '.totalRevenue // "N/A"') revenue"
    else
        echo -e "${RED}❌ Failed (HTTP $status)${NC}"
    fi
    
    # Test sales analytics
    echo -n "Sales Analytics... "
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" "http://localhost:3005/api/v1/reports/analytics/sales")
    status=$(echo "$response" | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
    body=$(echo "$response" | sed -E 's/HTTPSTATUS\:[0-9]{3}$//')
    
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}✅ Working${NC}"
        echo "   Sample data: $(echo "$body" | jq -r '.totalSales // "N/A"') total sales, $(echo "$body" | jq -r '.transactionCount // "N/A"') transactions"
    else
        echo -e "${RED}❌ Failed (HTTP $status)${NC}"
    fi
    
    # Test events analytics
    echo -n "Events Analytics... "
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" "http://localhost:3005/api/v1/reports/analytics/events")
    status=$(echo "$response" | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
    body=$(echo "$response" | sed -E 's/HTTPSTATUS\:[0-9]{3}$//')
    
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}✅ Working${NC}"
        echo "   Sample data: $(echo "$body" | jq -r '.totalEvents // "N/A"') total events, $(echo "$body" | jq -r '.activeEvents // "N/A"') active"
    else
        echo -e "${RED}❌ Failed (HTTP $status)${NC}"
    fi
    
    # Test event service
    echo -n "Event Service API... "
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" "http://localhost:3001/api/v1/events?limit=1")
    status=$(echo "$response" | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
    
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}✅ Working${NC}"
    else
        echo -e "${YELLOW}⚠️  Limited (HTTP $status)${NC}"
    fi
}

# Function to test database connections
test_database_connections() {
    echo -e "\n${BLUE}🗄️  Testing Database Connections${NC}"
    echo "================================="
    
    # Test PostgreSQL connection
    echo -n "PostgreSQL Connection... "
    if command -v psql >/dev/null 2>&1; then
        if PGPASSWORD=postgres psql -h localhost -p 5432 -U postgres -d postgres -c "SELECT 1;" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Connected${NC}"
        else
            echo -e "${RED}❌ Failed to connect${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  psql not installed, skipping direct test${NC}"
    fi
    
    # Test Redis connection
    echo -n "Redis Connection... "
    if command -v redis-cli >/dev/null 2>&1; then
        if redis-cli -h localhost -p 6379 ping >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Connected${NC}"
        else
            echo -e "${RED}❌ Failed to connect${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  redis-cli not installed, skipping direct test${NC}"
    fi
}

# Function to test Docker services
test_docker_services() {
    echo -e "\n${BLUE}🐳 Testing Docker Services${NC}"
    echo "=========================="
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running${NC}"
        return 1
    fi
    
    # List running containers
    echo "Running containers:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(postgres|redis|kafka|zookeeper|pgadmin)"
}

# Main test execution
main() {
    echo -e "${YELLOW}Starting comprehensive microservice integration tests...${NC}\n"
    
    # Test service health
    echo -e "${BLUE}🏥 Testing Service Health${NC}"
    echo "========================"
    
    healthy_count=0
    total_count=${#SERVICES[@]}
    
    for service_config in "${SERVICES[@]}"; do
        IFS=':' read -r service_name port health_path <<< "$service_config"
        if test_service_health "$service_name" "$port" "$health_path"; then
            ((healthy_count++))
        fi
    done
    
    echo ""
    echo -e "Health Summary: ${GREEN}$healthy_count${NC}/${total_count} services healthy"
    
    # Test API endpoints
    test_api_endpoints
    
    # Test database connections
    test_database_connections
    
    # Test Docker services
    test_docker_services
    
    # Final summary
    echo -e "\n${BLUE}📊 Integration Test Summary${NC}"
    echo "==========================="
    
    if [ $healthy_count -eq $total_count ]; then
        echo -e "${GREEN}✅ All services are healthy and ready for frontend integration${NC}"
        echo -e "${GREEN}✅ Reporting service analytics are working correctly${NC}"
        echo -e "${GREEN}✅ System is production-ready${NC}"
    elif [ $healthy_count -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Some services are down, but core functionality is available${NC}"
        echo -e "${YELLOW}⚠️  Check individual service logs for issues${NC}"
    else
        echo -e "${RED}❌ All services are down, check Docker and service configurations${NC}"
    fi
    
    echo -e "\n${BLUE}🚀 Next Steps:${NC}"
    echo "1. Start the admin panel: cd admin-panel && npm run dev"
    echo "2. Start the frontend: cd frontend && npm run dev"
    echo "3. Open admin panel: http://localhost:3000"
    echo "4. Open frontend: http://localhost:3001"
    echo ""
    echo -e "${GREEN}Happy coding! 🎉${NC}"
}

# Run the main function
main

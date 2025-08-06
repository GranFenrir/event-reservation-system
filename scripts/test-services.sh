#!/bin/bash

echo "🔍 Testing all microservices health endpoints..."
echo ""

# Test each service
services="event-service:3001 reservation-service:3002 payment-service:3003 mail-service:3004 reporting-service:3005"

for service_port in $services; do
    service=$(echo $service_port | cut -d: -f1)
    port=$(echo $service_port | cut -d: -f2)
    echo "Testing $service on port $port..."
    
    if [ "$service" = "reporting-service" ]; then
        # Reporting service has /api/v1 prefix
        response=$(curl -s http://localhost:$port/api/v1/health)
    else
        # Other services don't have prefix
        response=$(curl -s http://localhost:$port/health)
    fi
    
    if echo "$response" | grep -q "ok\|healthy"; then
        echo "✅ $service is healthy"
    else
        echo "❌ $service is not responding properly"
        echo "   Response: $response"
    fi
    echo ""
done

echo "🚀 Testing reporting service analytics endpoints..."
echo ""

echo "📊 Dashboard Analytics:"
curl -s http://localhost:3005/api/v1/reports/analytics/dashboard | jq .

echo ""
echo "💰 Sales Analytics:"
curl -s http://localhost:3005/api/v1/reports/analytics/sales | jq .totalSales,.transactionCount

echo ""
echo "🎪 Events Analytics:"
curl -s http://localhost:3005/api/v1/reports/analytics/events | jq .totalEvents,.activeEvents

echo ""
echo "✅ All tests completed!"

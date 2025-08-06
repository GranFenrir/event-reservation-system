#!/bin/bash

# Build script for microservices with isolated dependency management
# This script builds each service individually to avoid Canvas conflicts

set -e

# Services without Canvas dependencies
CANVAS_FREE_SERVICES=(
    "event-service"
    "reservation-service"
    "payment-service"
    "mail-service"
    "user-service"
)

echo "🚀 Building Canvas-free services with isolated Dockerfiles..."

for service in "${CANVAS_FREE_SERVICES[@]}"; do
    echo "📦 Building $service..."
    
    # Build the service using isolated Dockerfile
    docker build -t "event-reservation-${service}" -f "microservices/${service}/Dockerfile.isolated" .
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully built event-reservation-${service}"
    else
        echo "❌ Failed to build $service"
        exit 1
    fi
done

echo "📊 Building reporting service with Canvas support..."
docker build -t "event-reservation-reporting-service" -f "microservices/reporting-service/Dockerfile.isolated" .

if [ $? -eq 0 ]; then
    echo "✅ Successfully built event-reservation-reporting-service"
else
    echo "❌ Failed to build reporting-service"
    exit 1
fi

echo "🎉 All services built successfully!"
echo ""
echo "Built images:"
for service in "${CANVAS_FREE_SERVICES[@]}"; do
    echo "  - event-reservation-${service}"
done
echo "  - event-reservation-reporting-service"

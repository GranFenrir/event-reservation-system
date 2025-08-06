#!/bin/bash

# Build script for services without Canvas dependencies
# This script installs and builds each service individually to avoid Canvas conflicts

set -e

SERVICES=(
    "event-service"
    "reservation-service"
    "payment-service"
    "mail-service"
    "user-service"
)

echo "🚀 Building services without Canvas dependencies..."

for service in "${SERVICES[@]}"; do
    echo "📦 Building $service..."
    
    # Build the service
    docker build -t "${service}" -f "microservices/${service}/Dockerfile" . \
        --build-arg SKIP_CANVAS=true
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully built $service"
    else
        echo "❌ Failed to build $service"
        exit 1
    fi
done

echo "🎉 All services built successfully!"

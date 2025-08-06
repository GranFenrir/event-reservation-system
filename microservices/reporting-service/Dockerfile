# Build stage
FROM node:18 AS builder

WORKDIR /app

# Install build dependencies for Canvas (required for chartjs-node-canvas)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy root package files for workspace setup
COPY package*.json ./
COPY shared/ ./shared/

# Copy ALL microservices for workspace context
COPY microservices/ ./microservices/

# Install dependencies from root (workspace setup)
RUN npm install

# Build the specific microservice
RUN npm run build --workspace=@event-reservation/reporting-service

# Production stage
FROM node:18 AS production

WORKDIR /app

# Install runtime dependencies for Canvas
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf2.0-0 \
    libffi6 \
    shared-mime-info \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r nodejs && useradd -r -g nodejs nestjs

# Copy package files
COPY microservices/reporting-service/package.json ./

# Install only production dependencies
RUN npm install --omit=dev && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/microservices/reporting-service/dist ./dist

# Change ownership to non-root user
RUN chown -R nestjs:nodejs /app
USER nestjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3005/health || exit 1

EXPOSE 3005

CMD ["node", "dist/main.js"]

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files for workspace setup
COPY package*.json ./
COPY shared/ ./shared/

# Copy service package files
COPY microservices/payment-service/package.json ./
COPY microservices/payment-service/tsconfig*.json ./
COPY microservices/payment-service/nest-cli.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY microservices/payment-service/src/ ./src/

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy package files
COPY microservices/payment-service/package.json ./

# Install only production dependencies
RUN npm install --omit=dev && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Change ownership to non-root user
RUN chown -R nestjs:nodejs /app
USER nestjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3003/health || exit 1

EXPOSE 3003

CMD ["node", "dist/main.js"]

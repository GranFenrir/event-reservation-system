# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files for workspace setup
COPY package*.json ./
COPY shared/ ./shared/

# Copy ALL microservices for workspace context
COPY microservices/ ./microservices/

# Install dependencies from root (workspace setup)
RUN npm install

# Build the specific microservice
RUN npm run build --workspace=@event-reservation/user-service

# Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy package files
COPY microservices/user-service/package.json ./

# Install only production dependencies
RUN npm install --omit=dev && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/microservices/user-service/dist ./dist

# Copy environment template
COPY microservices/user-service/.env.example ./.env

# Change ownership to non-root user
RUN chown -R nestjs:nodejs /app
USER nestjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3006/health || exit 1

EXPOSE 3006

CMD ["node", "dist/main.js"]

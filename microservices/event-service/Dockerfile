FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY dist/ ./dist/
COPY .env.example ./.env

EXPOSE 3001

CMD ["node", "dist/main.js"]

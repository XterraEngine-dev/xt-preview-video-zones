# Multi-stage build for Vue 3 + Vite application

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build for production
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Install a simple HTTP server for serving static content
RUN npm install -g serve

# Copy built assets from builder stage
COPY --from=builder /app/dist /app/dist

# Expose port
EXPOSE 5225

# Serve the application
CMD ["serve", "-s", "dist", "-l", "5225"]

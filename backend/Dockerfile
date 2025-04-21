FROM node:18-alpine as builder

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json ./

# Install all dependencies for building
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist

# Create and set permissions for uploads directory
RUN mkdir -p /app/uploads && chmod 777 /app/uploads

# Expose API port
EXPOSE 3000

# Start the API server
CMD ["node", "dist/index.js"] 
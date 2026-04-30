# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production

# Runtime stage
FROM node:18-alpine
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy node modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY . .

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["npm", "start"]

FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies needed for native modules (if any)
RUN apk add --no-cache libc6-compat

# Copy package files and configurations
COPY package.json package-lock.json* tsconfig.json nest-cli.json ./

# Install all dependencies
RUN npm install

# Copy application source code and prisma schema
COPY . .

# Generate Prisma Client
RUN if [ -f "./prisma/schema.prisma" ]; then npx prisma generate; fi

# Build the NestJS app
RUN npm run build

# Expose API port
EXPOSE 4000

# Default command to start the API
CMD ["node", "dist/main"]

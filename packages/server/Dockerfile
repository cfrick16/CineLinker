FROM node:18-slim AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy root package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy shared package
COPY packages/shared ./packages/shared

# Copy server package
COPY packages/server ./packages/server

# Install dependencies and build
RUN pnpm install
RUN cd packages/server && pnpm build

# Production stage
FROM node:18-slim

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files and workspace config
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./

# Copy built files and dependencies
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/packages/server/package.json ./packages/server/
COPY --from=builder /app/packages/server/dist ./packages/server/dist

# Install production dependencies only
RUN pnpm install --prod

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the application port
EXPOSE 8080

# Start the application
WORKDIR /app/packages/server
CMD ["node", "dist/index.js"] 
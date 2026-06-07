FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy package configurations to leverage Docker cache
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/payment-core/package.json ./packages/payment-core/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# Install workspace dependencies
RUN pnpm install --frozen-lockfile

# Copy codebase
COPY . .

# Expose API port
EXPOSE 4000

# Start server
CMD ["pnpm", "--filter", "api", "run", "start"]

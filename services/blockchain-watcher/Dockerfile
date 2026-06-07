FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy package configurations
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/blockchain-watcher/package.json ./services/blockchain-watcher/
COPY packages/payment-core/package.json ./packages/payment-core/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# Install workspace dependencies
RUN pnpm install --frozen-lockfile

# Copy codebase
COPY . .

# Start watcher
CMD ["pnpm", "--filter", "blockchain-watcher", "run", "start"]

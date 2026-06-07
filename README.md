# ChainPay

ChainPay is an advanced, developer-first cryptocurrency payment gateway and processing platform. Built as a high-performance monorepo using **pnpm workspaces** and **Turborepo**, it features a cyberpunk/terminal-inspired merchant dashboard, automated blockchain monitoring, and an API/SDK service layer.

---

## 🏗 Repository Structure

```
chainpay/
├── apps/
│   ├── dashboard/        # Next.js merchant dashboard (React, Tailwind CSS v4)
│   ├── api/              # Express-based backend REST API (Drizzle ORM, Postgres)
│   ├── web/              # Next.js customer-facing checkout application
│   └── docs/             # Next.js documentation portal
├── services/
│   └── blockchain-watcher/ # Node.js service monitoring EVM chains for transactions
└── packages/
    ├── payment-core/     # Core payment logic, schema definitions, and token configurations
    ├── wallet-core/      # Wallet connectivity logic, Wagmi config, and chain definitions
    ├── widget-sdk/       # SDK UMD, ESM, CommonJS and React/React Native widget loaders [NEW]
    ├── shared/           # Monorepo-wide shared utility functions (e.g., formatting)
    ├── ui/               # Shared component design system primitives
    ├── eslint-config/    # Shared ESLint linting configurations
    └── typescript-config/# Shared tsconfig.json configurations
```

---

## 🚀 Key Features

### 1. Merchant Dashboard (`apps/dashboard`)

- **Aesthetics**: Premium cyberpunk/terminal design with customized glassmorphism (`cyber-glass`), animated statuses, and telemetry typography.
- **Live Payments Log**: Real-time listing of transactions, amounts, networks, and statuses (`pending`, `detected`, `confirming`, `completed`, `failed`, `expired`).
- **Payment Detail Page (`/payments/[id]`)**:
  - **Live Confirmation Progress**: A multi-step visual pipeline (`Detected ➔ Confirming ➔ Confirmed`) with animated progress indicators and a live polling engine that updates every 5 seconds.
  - **Auto-Termination**: Intelligent polling lifecycle that automatically terminates when the payment reaches a terminal state (`completed`, `failed`, `expired`).
  - **Dynamic Requirements**: Automatically scales confirmation requirements based on the underlying network configurations (e.g., 3 confirmations on mainnet, 1 confirmation on localhost).
  - **Telemetry Details**: Displays complete payment metadata including short-form transaction hashes, wallet addresses, token symbols, exchange rates, and transaction dates.

### 2. Embeddable Widget SDK (`packages/widget-sdk`)

- **Framework-Agnostic Core**: Embeddable modal iframe container with custom backdrop styling, handling responsive layout adjustments and secure cross-origin postMessage communications.
- **Library Formats**: Bundles IIFE/UMD (`widget.js` compiled to public assets), ESM, and CommonJS formats.
- **Framework Adapters**: Pre-built bindings for React hook environments (`useChainPayWidget`) and mobile-friendly React Native containers (`ChainPayCheckout`).

### 3. Durable Workflows & Core Services

- **Durable Payment Lifecycles**: payment creation, polling events, block confirmation counts, and webhook notifications are managed via durable state workflows in **Inngest** to avoid fragile cron loops.
- **Blockchain Watcher**: Dedicated background watcher matching on-chain events to database records and emitting event triggers directly to the workflow runner.
- **Signed Webhook Deliveries**: Sign webhooks using HMAC-SHA256 signatures to securely deliver confirmations to merchant servers with automatic exponential backoffs.

---

## 🛠 Getting Started

### Prerequisites

- Node.js (>= 18)
- [pnpm](https://pnpm.io/) (>= 9.0.0)
- Docker (for running database & local Node containers)

### Development Workflow

1.  **Install Dependencies**:

    ```sh
    pnpm install
    ```

2.  **Run Dev Environment**:
    Starts all frontend apps (Dashboard, Web, Docs) and backend APIs simultaneously:

    ```sh
    pnpm dev
    ```

3.  **Run Blockchain Watcher**:
    ```sh
    pnpm watcher
    ```

### Command Reference

| Command            | Description                                            |
| :----------------- | :----------------------------------------------------- |
| `pnpm dev`         | Run all applications and packages in development mode  |
| `pnpm build`       | Compile and build all applications and packages        |
| `pnpm watcher`     | Run the background blockchain watcher service          |
| `pnpm lint`        | Lint the entire monorepo using ESLint                  |
| `pnpm check-types` | Run TypeScript compilation check across all packages   |
| `pnpm format`      | Run Prettier formatter to check/write style guidelines |

---

## ⚙️ CI/CD & Remote Caching

This monorepo supports Turborepo Remote Caching to share build caches across your team and CI/CD pipelines.

To set up Remote Caching with Vercel:

```sh
pnpm exec turbo login
pnpm exec turbo link
```

---

## 🚢 Production VPS Deployment

ChainPay supports a fully containerized deployment model for VPS hosting (e.g. DigitalOcean, Hetzner, AWS EC2) using **Docker Compose** and **Caddy** with a self-hosted instance of **Inngest**. The landing page, merchant dashboard, and documentation portals are hosted on **Vercel**, while backend API and watchers run on the VPS.

### 1. Generating Credentials
We provide a utility script to generate all required passwords, secrets, event keys, and Caddy password hashes. To generate or rotate your production environment file, run:
```sh
node scripts/generate-env.js
```
This generates a secure `.env.production` file at the root. You can force regeneration using the `--force` flag.

### 2. DNS Config
Point two DNS `A` records to your VPS IP:
- `api.nodecheckout.com` (maps to the Express API)
- `inngest.nodecheckout.com` (maps to the Inngest Dev Server dashboard)

### 3. Deploying
1. Copy the codebase onto your VPS.
2. Edit `.env.production` on the server to configure your EVM node `RPC_BASE_URL` (it defaults to `nodecheckout.com` domains automatically).
3. Launch all services using Docker Compose:
   ```sh
   docker compose -f docker-compose.prod.yml up -d --build
   ```
4. Access `https://inngest.nodecheckout.com`, log in with `admin` and your generated dashboard password, and sync your application handler by registering the endpoint `http://api:4000/api/inngest` (or `https://api.nodecheckout.com/api/inngest`).


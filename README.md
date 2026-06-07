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

### 2. Core Services & Shared Packages

- **Blockchain Watcher**: Dedicated background watcher matching on-chain events to database records.
- **@repo/shared**: Highly reusable formatting helpers (`shortHash`, `shortAddr`, `formatDate`) imported across all apps to prevent utility duplication.
- **Component Architecture Standards**:
  - `components/ui/`: Houses primitive layouts and design blocks (e.g., `MetaRow`, `SectionCard`).
  - `components/payments/`: Contains domain-specific modules (e.g., `ConfirmationProgress`, `PaymentDetail`).

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

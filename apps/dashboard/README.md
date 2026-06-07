# ChainPay Merchant Dashboard

This is the Next.js-based merchant dashboard application for **ChainPay**. It provides merchants with tools to manage API keys, view transaction logs, and track live cryptocurrency payment confirmations in real-time.

---

## 🎨 Design System & Visuals

- **Theme**: Sleek cyberpunk/terminal aesthetic.
- **Styling**: Built with **Tailwind CSS v4** utilizing custom utility properties.
- **Key Design Tokens**:
  - `cyber-glass`: Micro-gloss frosted panel container backgrounds.
  - `cyber-pulse-dot`: Glowing status indicators.
  - `cyber-telemetry-num`: Customized monospace layouts for cryptographic IDs and numbers.

---

## 📦 Features

- **Live Transactions Listing (`/payments`)**: Displays a real-time list of all payment logs with network, amount, and payment statuses.
- **Payment Details Page (`/payments/[id]`)**:
  - Interactive multi-step status updates (`Detected` ➔ `Confirming` ➔ `Confirmed`).
  - Automatic API polling (every 5 seconds) which stops when terminal states (`completed`, `failed`, `expired`) are reached.
  - Dynamic confirmation requirements fetched per-network.

---

## 🛠 Getting Started

### Run Development Server

To run only the dashboard locally:

```sh
pnpm --filter dashboard dev
```

### Build for Production

To build a production package:

```sh
pnpm --filter dashboard build
```

---

## 📂 Component Layout Guidelines

To maintain clean and modular code, dashboard components are organized as follows:

- `src/components/ui/`: Contains generic, primitive component layouts (e.g., `MetaRow`, `SectionCard`).
- `src/components/payments/`: Contains specific payment domains and logic templates (e.g., `ConfirmationProgress`, `PaymentDetail`).
- `packages/shared/src/format.ts`: Shared formatting functions (e.g., `shortAddr`, `shortHash`, `formatDate`) imported from the monorepo workspace.

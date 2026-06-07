# ChainPay Web Application

This is the customer-facing Next.js application for **ChainPay**. It provides checkout and pay pages where customers can connect their wallets, choose a payment method, view invoice details, and process transaction payments.

---

## 🚀 Features

- **Checkout interface**: Clean and simple interface for processing cryptocurrency invoices.
- **Wallet Integration**: Integrated with `@repo/wallet-core` to allow fast wallet connections (Wagmi/Viem).
- **UI Components**: Uses core UI styles and buttons from `@repo/ui` and `@repo/shared` to format transaction detail outputs.

---

## 🛠 Getting Started

### Run Development Server

To run only the web checkout app locally on port `3003`:

```sh
pnpm --filter web dev
```

### Build for Production

To build the production bundle:

```sh
pnpm --filter web build
```

---

## 📂 Project Dependencies & Integration

- `@repo/ui`: Shareable component design templates for consistent branding.
- `@repo/shared`: Formatter utilities (such as address and transaction hash shorteners).

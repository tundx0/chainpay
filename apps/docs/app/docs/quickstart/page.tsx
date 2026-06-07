import React from "react";
import CodeBlock from "../../components/CodeBlock";

export default function QuickStartPage() {
  const setupSnippets = {
    setup: `# 1. Clone the repository and install dependencies
pnpm install

# 2. Start PostgreSQL container in the background
docker compose up -d

# 3. Seed your database and setup mock tables
pnpm --filter api db:push
pnpm --filter api run db:seed`,
    dev: `# Start the developer environment (Dashboard, Landing Page, Docs Portal)
pnpm dev

# In a separate terminal, launch the blockchain watcher service
pnpm watcher`,
  };

  return (
    <div className="doc-content">
      <h1>Quick Start</h1>
      <p>
        Get your local ChainPay development environment up and running in under five minutes.
      </p>

      <h2>Prerequisites</h2>
      <p>Ensure you have the following installed on your machine:</p>
      <ul>
        <li>Node.js (version 18 or higher)</li>
        <li>pnpm (version 9.0.0 or higher)</li>
        <li>Docker Desktop (for running the PostgreSQL container)</li>
      </ul>

      <h2>Step 1: Installation & Seeding</h2>
      <p>Clone the repository, download dependencies, spin up the Postgres database, and run migrations and seed scripts:</p>
      <CodeBlock snippets={{ setup: setupSnippets.setup }} />

      <h2>Step 2: Start Development Servers</h2>
      <p>Launch the frontend and backend servers together under Turborepo, then start the blockchain watcher client:</p>
      <CodeBlock snippets={{ dev: setupSnippets.dev }} />

      <div className="doc-alert warning">
        <span className="doc-alert-title">⚠️ Run a local Ethereum node (Anvil)</span>
        <p>
          For local payment verification testing, run a local foundry Anvil node:
          <code className="inline-code">anvil --block-time 1</code>. This simulates EVM block mining every second so you can test payment confirmation intervals in real time.
        </p>
      </div>

      <h2>Step 3: Access Console</h2>
      <p>Verify that your services are running correctly at these local addresses:</p>
      <ul>
        <li><strong>Merchant Dashboard:</strong> <a href="http://localhost:3000">http://localhost:3000</a></li>
        <li><strong>Customer Landing Page:</strong> <a href="http://localhost:3003">http://localhost:3003</a></li>
        <li><strong>Express Rest API:</strong> <a href="http://localhost:4000/health">http://localhost:4000/health</a></li>
      </ul>
    </div>
  );
}

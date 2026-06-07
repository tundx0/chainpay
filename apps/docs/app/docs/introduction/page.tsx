import React from "react";

export default function IntroductionPage() {
  return (
    <div className="doc-content">
      <h1>Introduction</h1>
      <p>
        Welcome to the **ChainPay** developer documentation. ChainPay is an advanced, developer-first cryptocurrency payment gateway and state processing engine. It allows merchants to receive non-custodial crypto payments directly into their own wallets, monitor transactions in real time, and trigger durable automated workflows upon confirmation.
      </p>

      <h2>Core Architecture</h2>
      <p>
        ChainPay is designed around three decoupled, high-performance systems:
      </p>
      <ul>
        <li>
          <strong>Express REST API:</strong> The core server coordinating payment request creation, state querying, rate computations, and webhook registrations.
        </li>
        <li>
          <strong>Blockchain Watcher:</strong> A lightweight background service that scans target EVM blockchains (such as Base, Ethereum, and local testnets) for incoming transactions matching active payment IDs, posting events upon detection.
        </li>
        <li>
          <strong>Durable State Machine Workflows (Inngest):</strong> A resilient event-driven execution coordinator that orchestrates payment lifecycles, waits for confirmations, logs telemetry, and executes merchant webhook deliveries with exponential backoffs.
        </li>
      </ul>

      <h2>Key Features</h2>
      <ul>
        <li><strong>Cyberpunk Merchant Dashboard:</strong> Real-time confirmation progress visualizer with block telemetry logs.</li>
        <li><strong>Embeddable Checkout Widget:</strong> Light overlay iframe loader supporting standard JS, React hooks, and mobile React Native client views.</li>
        <li><strong>Signed Webhook Notifications:</strong> Webhooks signed with cryptographic HMAC-SHA256 headers to verify payload authenticity.</li>
        <li><strong>Self-Hosted Infrastructure:</strong> Zero cloud dependencies, fully containerized under Docker Compose and Caddy.</li>
      </ul>

      <div className="doc-alert">
        <span className="doc-alert-title">💡 Developer-First Philosophy</span>
        <p>ChainPay operates entirely non-custodially. Funds transfer directly from the customer's wallet to the merchant's wallet on-chain. ChainPay never holds, manages, or intercepts your assets.</p>
      </div>
    </div>
  );
}

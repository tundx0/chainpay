import React from "react";
import CodeBlock from "../../components/CodeBlock";

export default function ApiReferencePage() {
  const createPaymentReq = `{
  "amount": "0.05",
  "currency": "ETH",
  "description": "Invoice #82910",
  "network": "localhost"
}`;

  const createPaymentRes = `{
  "id": "pay_5y8x9z...",
  "merchantAddress": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "amount": "0.05",
  "currency": "ETH",
  "network": "localhost",
  "status": "pending",
  "checkoutUrl": "http://localhost:3000/pay/pay_5y8x9z...",
  "createdAt": "2026-06-07T21:40:00.000Z"
}`;

  const webhookVerify = `import crypto from "crypto";

// Webhook validation handler inside your Express/Node app
app.post("/webhooks/chainpay", (req, res) => {
  const signature = req.headers["x-chainpay-signature"];
  const clientSecret = process.env.CHAINPAY_WEBHOOK_SECRET;

  if (!signature) {
    return res.status(401).send("Missing signature header");
  }

  // Generate the HMAC signature using SHA-256
  const hmac = crypto.createHmac("sha256", clientSecret);
  const digest = hmac.update(JSON.stringify(req.body)).digest("hex");

  // Constant-time comparison to prevent timing attacks
  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature, "utf-8"),
    Buffer.from(digest, "utf-8")
  );

  if (!isValid) {
    return res.status(401).send("Invalid webhook signature");
  }

  console.log("Verified payment status:", req.body.status);
  res.status(200).send("Webhook received");
});`;

  return (
    <div className="doc-content">
      <h1>API Reference</h1>
      <p>
        The ChainPay REST API acts as the gateway for programmatically creating payments, tracking invoices, and registering webhooks.
      </p>

      <h2>Headers</h2>
      <p>All merchant API requests require your merchant address passed in the header payload:</p>
      <table className="doc-table">
        <thead>
          <tr>
            <th>Header Name</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code className="inline-code">X-Merchant-Address</code></td>
            <td>string (address)</td>
            <td>Your EVM merchant wallet address where checkout assets are sent.</td>
          </tr>
          <tr>
            <td><code className="inline-code">Content-Type</code></td>
            <td>string</td>
            <td>Must be <code className="inline-code">application/json</code>.</td>
          </tr>
        </tbody>
      </table>

      <h2>1. Create Payment Request</h2>
      <p>Endpoint: <code className="inline-code">POST /payments</code></p>
      
      <h3>Request Body</h3>
      <CodeBlock snippets={{ "JSON Payload": createPaymentReq }} />

      <h3>Response Payload</h3>
      <CodeBlock snippets={{ "JSON Response": createPaymentRes }} />

      <h2>2. Get Payment Status</h2>
      <p>Endpoint: <code className="inline-code">GET /payments/:id</code></p>
      <p>Queries database records and historical workflow logs. Returns full payment details, confirmations counted, and webhook attempts status history.</p>

      <h2>3. Webhooks Security</h2>
      <p>
        ChainPay signs webhook events using HMAC-SHA256 signatures, passing the hash signature inside the <code className="inline-code">x-chainpay-signature</code> header. You should verify webhook payloads on your server to prevent replay or spoofing attacks.
      </p>
      <CodeBlock snippets={{ "Node.js Verification": webhookVerify }} />
    </div>
  );
}

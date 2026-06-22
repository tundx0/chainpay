import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import { inngest } from "@repo/payment-core";
import { paymentWorkflow } from "./workflows/payment-workflow";
import { createPayment } from "./routes/payment/create-payment";
import { listPayments } from "./routes/payment/list-payments";
import { getPayment } from "./routes/payment/get-payment";
import { updateStatus } from "./routes/payment/update-status";
import { submitPayment } from "./routes/payment/submit-payment";
import { getRates } from "./routes/rates";

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    allowedHeaders: ["Content-Type", "X-Merchant-Address"],
  }),
);
app.use(express.json());

// ─── Inngest Router ────────────────────────────────────────────────────────────
app.use("/api/inngest", serve({ client: inngest, functions: [paymentWorkflow] }));

// ─── Health ───────────────────────────────────────────────────────────────────
app.get("/health", (_, res) => {
  res.json({ status: "ok", service: "chainpay-api" });
});

// ─── Payment Routes ───────────────────────────────────────────────────────────
app.post("/payments", createPayment);
app.get("/payments", listPayments);
app.get("/payments/:id", getPayment);
app.post("/payments/:id/submit", submitPayment);
app.patch("/payments/:id/status", updateStatus);
app.get("/rates", getRates);

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT ?? 4000;
app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`🚀  ChainPay API running on http://0.0.0.0:${PORT}`);
});

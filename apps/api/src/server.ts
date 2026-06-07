import express from "express";
import cors from "cors";
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

// ─── Health ───────────────────────────────────────────────────────────────────
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
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
app.listen(PORT, () => {
  console.log(`🚀  ChainPay API running on http://localhost:${PORT}`);
});

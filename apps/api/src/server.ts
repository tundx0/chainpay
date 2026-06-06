import express from "express";
import cors from "cors";
import { createPayment } from "./routes/payment/create-payment";
import { listPayments } from "./routes/payment/list-payments";
import { getPayment } from "./routes/payment/get-payment";

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Health ───────────────────────────────────────────────────────────────────
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

// ─── Payment Routes ───────────────────────────────────────────────────────────
app.post("/payments", createPayment);
app.get("/payments", listPayments);
app.get("/payments/:id", getPayment);

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`🚀  ChainPay API running on http://localhost:${PORT}`);
});

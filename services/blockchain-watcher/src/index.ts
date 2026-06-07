import { PaymentService, PaymentVerificationService } from "@repo/payment-core";
import { db } from "./db";
import { WATCHER_POLL_INTERVAL_MS } from "./config";
import { PaymentWatcher } from "./watchers/payment-watcher";

const paymentService = new PaymentService(db);
const verificationService = new PaymentVerificationService();
const watcher = new PaymentWatcher(paymentService, verificationService);

console.log(
  `🔭 ChainPay blockchain watcher starting (poll every ${WATCHER_POLL_INTERVAL_MS}ms)`,
);

watcher.start(WATCHER_POLL_INTERVAL_MS);

process.on("SIGINT", () => {
  console.log("\n[watcher] Shutting down");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n[watcher] Shutting down");
  process.exit(0);
});

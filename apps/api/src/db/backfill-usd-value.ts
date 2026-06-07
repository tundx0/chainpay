import { db } from "./index";
import { paymentRequests } from "@repo/payment-core";
import { eq, and, isNull } from "drizzle-orm";
import { PriceService } from "@repo/payment-core";

async function main() {
  console.log("🌱 Starting USD value backfill for completed payments...");
  const priceService = new PriceService();

  const completedPayments = await db
    .select()
    .from(paymentRequests)
    .where(
      and(
        eq(paymentRequests.status, "completed"),
        isNull(paymentRequests.usdValue),
      ),
    );

  console.log(
    `Found ${completedPayments.length} completed payments needing backfill.`,
  );

  for (const payment of completedPayments) {
    try {
      const rate = await priceService.getUsdRate(payment.currency);
      const usdValue = (Number(payment.amount) * rate).toFixed(2);

      await db
        .update(paymentRequests)
        .set({ usdValue })
        .where(eq(paymentRequests.id, payment.id));

      console.log(
        `✅ Backfilled payment ${payment.id} (${payment.amount} ${payment.currency}) -> $${usdValue} (rate: $${rate})`,
      );
    } catch (err) {
      console.error(`❌ Failed to backfill payment ${payment.id}:`, err);
    }
  }

  console.log("🌱 Backfill finished.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Backfill script failed:", err);
  process.exit(1);
});

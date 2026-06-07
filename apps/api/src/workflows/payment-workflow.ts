import { inngest } from "@repo/payment-core";
import { db } from "../db";
import {
  paymentRequests,
  paymentWorkflows,
  merchantWebhooks,
  webhookDeliveries,
  PriceService,
} from "@repo/payment-core";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

const priceService = new PriceService();

export const paymentWorkflow = inngest.createFunction(
  {
    id: "payment-workflow",
    name: "Payment Lifecycle Workflow",
    triggers: [{ event: "payment.created" }],
  },
  async ({ event, step }) => {
    const { paymentId } = event.data;

    // Helper: Log workflow state transition
    const logState = async (state: string, logMsg: string) => {
      await db.insert(paymentWorkflows).values({
        paymentId,
        state,
        stepLog: logMsg,
      });
    };

    // 1. Initial State: Waiting for Payment
    await step.run("initialize-status", async () => {
      await db
        .update(paymentRequests)
        .set({ status: "pending", updatedAt: new Date() })
        .where(eq(paymentRequests.id, paymentId));
      
      await logState("waiting_for_payment", "Workflow initialized. Awaiting payment transaction log from blockchain listener.");
    });

    // 2. Wait for payment detection event
    const receivedEvent = await step.waitForEvent("payment.received", {
      event: "payment.received",
      timeout: "24h",
      match: "data.paymentId",
    });

    if (!receivedEvent) {
      // Timeout reached
      await step.run("handle-timeout", async () => {
        await db
          .update(paymentRequests)
          .set({ status: "expired", updatedAt: new Date() })
          .where(eq(paymentRequests.id, paymentId));
        await logState("failed", "Payment request expired after 24 hours of inactivity.");
      });
      return { status: "expired" };
    }

    const { txHash, payerAddress } = receivedEvent.data;

    // 3. Update status to confirming
    await step.run("set-confirming", async () => {
      await db
        .update(paymentRequests)
        .set({
          txHash: txHash.toLowerCase(),
          payerAddress: payerAddress.toLowerCase(),
          status: "confirming",
          updatedAt: new Date(),
        })
        .where(eq(paymentRequests.id, paymentId));
      await logState("confirming", `Payment transfer detected on-chain. TX: ${txHash}. Waiting for block confirmations.`);
    });

    // 4. Wait for block confirmation event
    const confirmedEvent = await step.waitForEvent("payment.confirmed", {
      event: "payment.confirmed",
      timeout: "1h",
      match: "data.paymentId",
    });

    if (!confirmedEvent) {
      await step.run("handle-confirmation-timeout", async () => {
        await db
          .update(paymentRequests)
          .set({ status: "failed", updatedAt: new Date() })
          .where(eq(paymentRequests.id, paymentId));
        await logState("failed", "Confirmation timed out on-chain.");
      });
      return { status: "failed" };
    }

    // 5. Complete payment request record (calculate USD value and set to completed)
    const payment = await step.run("complete-payment", async () => {
      const [p] = await db
        .select()
        .from(paymentRequests)
        .where(eq(paymentRequests.id, paymentId))
        .limit(1);

      if (!p) throw new Error("Payment request not found");

      let usdValue = p.usdValue;
      if (!usdValue) {
        const rate = await priceService.getUsdRate(p.currency);
        usdValue = (Number(p.amount) * rate).toFixed(2);
      }

      const [updated] = await db
        .update(paymentRequests)
        .set({
          status: "completed",
          confirmations: 3,
          usdValue,
          updatedAt: new Date(),
          confirmedAt: new Date(),
        })
        .where(eq(paymentRequests.id, paymentId))
        .returning();

      if (!updated) {
        throw new Error("Failed to retrieve completed payment record");
      }

      await logState("confirmed", `Payment successfully settled and confirmed on-chain. USD Valuation: $${usdValue}.`);
      return updated;
    });

    // 6. Webhook stage
    await step.run("dispatch-webhook", async () => {
      if (!payment) {
        throw new Error("Payment record is missing or not updated");
      }

      // Find merchant webhook settings
      const [webhook] = await db
        .select()
        .from(merchantWebhooks)
        .where(eq(merchantWebhooks.merchantAddress, payment.merchantAddress!))
        .limit(1);

      if (!webhook) {
        await logState("completed", "Workflow completed. No webhook configured for merchant.");
        return;
      }

      const payload = JSON.stringify({
        event: "payment.success",
        data: {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          network: payment.network,
          txHash: payment.txHash,
          payerAddress: payment.payerAddress,
          usdValue: payment.usdValue,
          confirmedAt: payment.confirmedAt,
        },
      });

      // Compute HMAC-SHA256 signature
      const signature = crypto
        .createHmac("sha256", webhook.secret)
        .update(payload)
        .digest("hex");

      let attempt = 1;
      let success = false;
      let statusCode = null;
      let responseBody = "";

      try {
        const res = await fetch(webhook.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-ChainPay-Signature": signature,
          },
          body: payload,
        });

        statusCode = res.status;
        responseBody = await res.text();
        success = res.ok;
      } catch (err: any) {
        responseBody = err.message || String(err);
      }

      const existingAttempts = await db
        .select()
        .from(webhookDeliveries)
        .where(and(eq(webhookDeliveries.paymentId, paymentId), eq(webhookDeliveries.url, webhook.url)));
      attempt = existingAttempts.length + 1;

      await db.insert(webhookDeliveries).values({
        paymentId,
        url: webhook.url,
        payload,
        statusCode,
        responseBody: responseBody.slice(0, 1000),
        status: success ? "success" : "failed",
        attemptNumber: attempt,
      });

      if (!success) {
        await logState("webhook_failed", `Webhook dispatch attempt #${attempt} failed with status ${statusCode}. Retrying...`);
        throw new Error(`Webhook delivery failed with status ${statusCode}`);
      }

      await logState("completed", "Workflow completed. Webhook notification delivered successfully.");
    });

    return { status: "completed" };
  }
);

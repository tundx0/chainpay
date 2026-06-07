import { Request, Response } from "express";
import { PaymentService } from "@repo/payment-core/src/services/payment-service.ts";
import { CheckoutService } from "@repo/payment-core/src/services/checkout-service.ts";
import { paymentWorkflows, webhookDeliveries } from "@repo/payment-core";
import { eq, desc } from "drizzle-orm";
import { db } from "../../db";

const service = new PaymentService(db);
const checkoutService = new CheckoutService(db);

export async function getPayment(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const payment = await service.getPayment(id);

  if (!payment) {
    return res.status(404).json({ error: `Payment ${id} not found` });
  }

  const checkout = await checkoutService.getCheckoutData(id);

  const workflows = await db
    .select()
    .from(paymentWorkflows)
    .where(eq(paymentWorkflows.paymentId, id))
    .orderBy(desc(paymentWorkflows.createdAt));

  const webhooks = await db
    .select()
    .from(webhookDeliveries)
    .where(eq(webhookDeliveries.paymentId, id))
    .orderBy(desc(webhookDeliveries.createdAt));

  return res.json({ payment, checkout, workflows, webhooks });
}

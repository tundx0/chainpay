import { Request, Response } from "express";
import { PaymentService } from "@repo/payment-core/src/services/payment-service.ts";
import { createPaymentSchema } from "@repo/payment-core/src/types/payment.ts";
import { requireMerchantAddress } from "../../middleware/merchant-auth.ts";
import { db } from "../../db";

const service = new PaymentService(db);

export async function createPayment(req: Request, res: Response) {
  const merchantAddress = requireMerchantAddress(req, res);
  if (!merchantAddress) return;

  const parsed = createPaymentSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      issues: parsed.error.flatten().fieldErrors,
    });
  }

  const payment = await service.createPayment(parsed.data, merchantAddress);
  return res.status(201).json({ id: payment.id });
}

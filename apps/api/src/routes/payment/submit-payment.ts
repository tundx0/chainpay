import { Request, Response } from "express";
import { PaymentService } from "@repo/payment-core/src/services/payment-service.ts";
import { getMerchantAddressFromHeader } from "@repo/payment-core/src/utils/merchant-auth.ts";
import { db } from "../../db";
import { z } from "zod";

const service = new PaymentService(db);

const submitPaymentSchema = z.object({
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, "Invalid transaction hash"),
  payerAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid payer address"),
});

export async function submitPayment(req: Request, res: Response) {
  if (getMerchantAddressFromHeader(req.headers["x-merchant-address"])) {
    return res
      .status(403)
      .json({ error: "Checkout submission cannot use merchant credentials" });
  }

  const { id } = req.params as { id: string };
  const parsed = submitPaymentSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      issues: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const payment = await service.submitPaymentTransaction(
      id,
      parsed.data.txHash,
      parsed.data.payerAddress,
    );
    return res.json({ payment });
  } catch (err: any) {
    return res.status(404).json({ error: err?.message || "Payment not found" });
  }
}

import { Request, Response } from "express";
import { PaymentService } from "@repo/payment-core/src/services/payment-service.ts";
import { PAYMENT_STATUSES } from "@repo/payment-core/src/types/payment.ts";
import { getMerchantAddressFromHeader } from "@repo/payment-core/src/utils/merchant-auth.ts";
import { db } from "../../db";
import { z } from "zod";

const service = new PaymentService(db);

const updateStatusSchema = z.object({
  status: z.enum(PAYMENT_STATUSES, { message: "Invalid status" }),
});

export async function updateStatus(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const parsed = updateStatusSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      issues: parsed.error.flatten().fieldErrors,
    });
  }

  const merchantAddress = getMerchantAddressFromHeader(
    req.headers["x-merchant-address"],
  );

  try {
    if (merchantAddress) {
      const payment = await service.updatePaymentStatus(
        id,
        parsed.data.status,
        merchantAddress,
      );
      return res.json({ payment });
    }

    if (parsed.data.status !== "completed") {
      return res
        .status(401)
        .json({ error: "Merchant wallet address required" });
    }

    const payment = await service.completeCheckoutPayment(id);
    return res.json({ payment });
  } catch (err: any) {
    return res.status(404).json({ error: err?.message || "Payment not found" });
  }
}

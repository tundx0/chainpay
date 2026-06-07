import { Request, Response } from "express";
import { PaymentService } from "@repo/payment-core/src/services/payment-service.ts";
import { requireMerchantAddress } from "../../middleware/merchant-auth.ts";
import { db } from "../../db";

const service = new PaymentService(db);

export async function listPayments(req: Request, res: Response) {
  const merchantAddress = requireMerchantAddress(req, res);
  if (!merchantAddress) return;

  const payments = await service.listPayments(merchantAddress);
  return res.json({ payments });
}

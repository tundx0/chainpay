import { Request, Response } from "express";
import { PaymentService } from "@repo/payment-core/src/services/payment-service.ts";
import { db } from "../../db";

const service = new PaymentService(db);

export async function listPayments(_req: Request, res: Response) {
  const payments = await service.listPayments();
  return res.json({ payments });
}

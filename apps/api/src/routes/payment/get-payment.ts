import { Request, Response } from "express";
import { PaymentService } from "@repo/payment-core/src/services/payment-service.ts";
import { db } from "../../db";

const service = new PaymentService(db);

export async function getPayment(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const payment = await service.getPayment(id);

  if (!payment) {
    return res.status(404).json({ error: `Payment ${id} not found` });
  }

  return res.json({ payment });
}

import { Request, Response } from "express";
import { PaymentService } from "@repo/payment-core/src/services/payment-service.ts";
import { getMerchantAddressFromHeader } from "@repo/payment-core/src/utils/merchant-auth.ts";
import { db } from "../../db";

const service = new PaymentService(db);

export async function refundPayment(req: Request, res: Response) {
  const { id } = req.params as { id: string };

  const merchantAddress = getMerchantAddressFromHeader(
    req.headers["x-merchant-address"],
  );

  if (!merchantAddress) {
    return res.status(401).json({ error: "Merchant wallet address required" });
  }

  try {
    const payment = await service.updatePaymentStatus(
      id,
      "refunded",
      merchantAddress,
    );
    return res.json({ payment });
  } catch (err: any) {
    return res.status(404).json({ error: err?.message || "Payment not found" });
  }
}

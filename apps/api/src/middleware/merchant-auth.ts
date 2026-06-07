import type { Request, Response } from "express";
import { getMerchantAddressFromHeader } from "@repo/payment-core/src/utils/merchant-auth.ts";

export function requireMerchantAddress(
  req: Request,
  res: Response,
): string | null {
  const address = getMerchantAddressFromHeader(
    req.headers["x-merchant-address"],
  );

  if (!address) {
    res
      .status(401)
      .json({ error: "Connected merchant wallet address required" });
    return null;
  }

  return address;
}

import { Request, Response } from "express";
import { PriceService } from "@repo/payment-core";

const priceService = new PriceService();

export async function getRates(_req: Request, res: Response) {
  try {
    const [ethRate, btcRate] = await Promise.all([
      priceService.getUsdRate("ETH"),
      priceService.getUsdRate("BTC"),
    ]);

    return res.json({
      ETH: ethRate,
      BTC: btcRate,
      USDC: 1.0,
      USDT: 1.0,
    });
  } catch (error) {
    console.error("Failed to get rates:", error);
    return res.status(500).json({ error: "Failed to fetch exchange rates" });
  }
}

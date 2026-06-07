import { eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "../db/schema";
import { paymentRequests, merchantWallets } from "../db/schema";
import {
  getChainId,
  getRequiredConfirmations,
  getTokenConfig,
} from "../constants/tokens";
import { generatePaymentUri } from "../utils/generate-payment-uri";
import { parseAmountToAtomic } from "../utils/parse-amount";
import type { CheckoutData } from "../types/checkout";
import type { Currency, Network } from "../types/payment";
import { PriceService } from "./price-service";

type DB = PostgresJsDatabase<typeof schema>;

export class CheckoutService {
  private readonly priceService = new PriceService();
  constructor(private readonly db: DB) {}

  async getCheckoutData(paymentId: string): Promise<CheckoutData | null> {
    const [payment] = await this.db
      .select()
      .from(paymentRequests)
      .where(eq(paymentRequests.id, paymentId))
      .limit(1);

    if (!payment) return null;

    const network = payment.network as Network;
    const currency = payment.currency as Currency;

    if (currency === "BTC") {
      throw new Error("BTC checkout is not supported yet");
    }

    const [wallet] = await this.db
      .select()
      .from(merchantWallets)
      .where(eq(merchantWallets.network, payment.network))
      .limit(1);

    const merchantAddress =
      payment.merchantAddress ??
      wallet?.address ??
      "0x0000000000000000000000000000000000000000";

    const token = getTokenConfig(network, currency);
    const amountAtomic = parseAmountToAtomic(payment.amount, network, currency);

    const paymentUri = generatePaymentUri({
      address: merchantAddress,
      amount: payment.amount,
      network,
      currency,
    });

    const rate = await this.priceService.getUsdRate(currency);
    const usdAmount = Number(payment.amount) * rate;

    return {
      paymentId: payment.id,
      amount: Number(payment.amount),
      currency: payment.currency,
      network: payment.network,
      paymentUri,
      merchantAddress,
      chainId: getChainId(network),
      tokenType: token.type,
      tokenAddress: token.contractAddress,
      amountAtomic: amountAtomic.toString(),
      requiredConfirmations: getRequiredConfirmations(network),
      usdRate: rate,
      usdAmount: Number(usdAmount.toFixed(2)),
    };
  }
}

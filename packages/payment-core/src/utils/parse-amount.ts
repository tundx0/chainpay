import { getTokenConfig } from "../constants/tokens";
import type { Currency, Network } from "../types/payment";

export function parseAmountToAtomic(
  amount: string | number,
  network: Network,
  currency: Currency,
): bigint {
  const { decimals } = getTokenConfig(network, currency);
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount < 0) {
    throw new Error("Amount must be a non-negative number");
  }

  const safeDecimals = Math.min(decimals, 6);
  const factor = Math.max(0, decimals - safeDecimals);

  return (
    BigInt(Math.floor(numericAmount * 10 ** safeDecimals)) *
    BigInt(10 ** factor)
  );
}

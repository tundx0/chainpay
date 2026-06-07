import { getChainId, getTokenConfig } from "../constants/tokens";
import { parseAmountToAtomic } from "./parse-amount";
import type { Currency, Network } from "../types/payment";

export interface PaymentUriInput {
  address: string;
  amount: string | number;
  network: Network;
  currency: Currency;
}

export function generatePaymentUri({
  address,
  amount,
  network,
  currency,
}: PaymentUriInput): string {
  const token = getTokenConfig(network, currency);
  const chainId = getChainId(network);
  const amountAtomic = parseAmountToAtomic(amount, network, currency);

  if (token.type === "native") {
    return `ethereum:${address}@${chainId}?value=${amountAtomic.toString()}`;
  }

  if (!token.contractAddress) {
    throw new Error(`Missing contract address for ${currency} on ${network}`);
  }

  return `ethereum:${token.contractAddress}@${chainId}/transfer?address=${address}&uint256=${amountAtomic.toString()}`;
}

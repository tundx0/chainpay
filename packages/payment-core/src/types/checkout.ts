export interface CheckoutData {
  paymentId: string;
  amount: number;
  currency: string;
  network: string;
  paymentUri: string;
  merchantAddress: string;
  chainId: number;
  tokenType: "native" | "erc20";
  tokenAddress?: string;
  amountAtomic: string;
  requiredConfirmations: number;
  usdRate?: number;
  usdAmount?: number;
}

export interface SendPaymentParams {
  merchantAddress: `0x${string}`;
  amountAtomic: bigint;
  chainId: number;
  tokenType: "native" | "erc20";
  tokenAddress?: `0x${string}`;
}

export interface SendPaymentResult {
  txHash: `0x${string}`;
}

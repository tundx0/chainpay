export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export type WalletType = "metamask" | "walletconnect" | "coinbase";

export interface WalletState {
  connected: boolean;
  address?: string;
  chainId?: number;
  connector?: string;
}

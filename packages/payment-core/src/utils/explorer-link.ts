import { getNetworkConfig } from "../constants/tokens";
import type { Network } from "../types/payment";

export function buildExplorerTxUrl(network: Network, txHash: string): string {
  const { explorerBaseUrl } = getNetworkConfig(network);
  return `${explorerBaseUrl}/tx/${txHash}`;
}

export function buildExplorerAddressUrl(
  network: Network,
  address: string,
): string {
  const { explorerBaseUrl } = getNetworkConfig(network);
  return `${explorerBaseUrl}/address/${address}`;
}

import { createPublicClient, http, type PublicClient } from "viem";
import { arbitrum, base, foundry, mainnet, polygon } from "viem/chains";
import type { Network } from "../types/payment";

const CHAIN_BY_NETWORK = {
  ethereum: mainnet,
  base,
  polygon,
  arbitrum,
  localhost: foundry,
} as const;

const DEFAULT_RPC_URLS: Record<Network, string | undefined> = {
  ethereum: undefined,
  base: undefined,
  polygon: undefined,
  arbitrum: undefined,
  localhost: "http://127.0.0.1:8545",
};

function getRpcUrl(network: Network): string | undefined {
  const envKey = `RPC_${network.toUpperCase()}`;
  return process.env[envKey] ?? DEFAULT_RPC_URLS[network];
}

export function createChainClient(network: Network): PublicClient {
  return createPublicClient({
    chain: CHAIN_BY_NETWORK[network],
    transport: http(getRpcUrl(network)),
  }) as PublicClient;
}

export type ChainClient = PublicClient;
export type ChainClientFactory = (network: Network) => ChainClient;

export const defaultChainClientFactory: ChainClientFactory = createChainClient;

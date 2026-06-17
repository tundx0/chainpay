import { mainnet, sepolia, base, polygon, arbitrum, foundry } from "wagmi/chains";

export const supportedChains = [
  mainnet,
  sepolia,
  base,
  polygon,
  arbitrum,
  foundry,
] as const;

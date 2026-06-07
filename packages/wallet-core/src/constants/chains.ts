import { mainnet, base, polygon, arbitrum, foundry } from "wagmi/chains";

export const supportedChains = [
  mainnet,
  base,
  polygon,
  arbitrum,
  foundry,
] as const;

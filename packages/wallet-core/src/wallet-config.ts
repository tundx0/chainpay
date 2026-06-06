import { createConfig, http } from "wagmi";

import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";

import { mainnet, base, polygon, arbitrum } from "wagmi/chains";

import { supportedChains } from "./constants/chains";

export const wagmiConfig = createConfig({
  chains: supportedChains,

  connectors: typeof window !== "undefined" ? [
    injected(),

    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WC_ID || "ssr-fallback-id",
    }),

    coinbaseWallet({
      appName: "ChainPay",
    }),
  ] : [],

  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
});

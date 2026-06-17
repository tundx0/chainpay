import { createConfig, http, type Config } from "wagmi";

import {
  injected,
  walletConnect,
  coinbaseWallet,
  metaMask,
} from "wagmi/connectors";

import { mainnet, sepolia, base, polygon, arbitrum, foundry } from "wagmi/chains";

import { supportedChains } from "./constants/chains";

interface CreateWagmiConfigOptions {
  includeWalletConnect?: boolean;
}

export function createWagmiConfig(
  wcProjectId?: string,
  { includeWalletConnect = false }: CreateWagmiConfigOptions = {},
): Config {
  const projectId = wcProjectId ?? process.env.NEXT_PUBLIC_WC_ID;

  const connectors = [
    metaMask(),
    injected(),
    ...(includeWalletConnect && projectId
      ? [
          walletConnect({
            projectId,
            showQrModal: true,
            metadata: {
              name: "ChainPay",
              description: "Crypto payment infrastructure for modern merchants",
              url:
                typeof window !== "undefined"
                  ? window.location.origin
                  : "http://localhost:3000",
              icons: [],
            },
          }),
        ]
      : []),
    coinbaseWallet({
      appName: "ChainPay",
    }),
  ];

  return createConfig({
    chains: supportedChains,

    connectors,

    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [base.id]: http(),
      [polygon.id]: http(),
      [arbitrum.id]: http(),
      [foundry.id]: http("http://127.0.0.1:8545"), // Anvil local node
    },
  });
}

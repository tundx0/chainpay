import type { Currency, Network } from "../types/payment";

export type TokenType = "native" | "erc20";

export interface TokenConfig {
  type: TokenType;
  decimals: number;
  contractAddress?: `0x${string}`;
}

export interface NetworkTokenConfig {
  chainId: number;
  requiredConfirmations: number;
  explorerBaseUrl: string;
  tokens: Partial<Record<Currency, TokenConfig>>;
}

export const NETWORK_TOKEN_CONFIG: Record<Network, NetworkTokenConfig> = {
  sepolia: {
    chainId: 11_155_111,
    requiredConfirmations: 2,
    explorerBaseUrl: "https://sepolia.etherscan.io",
    tokens: {
      ETH: { type: "native", decimals: 18 },
      USDC: {
        type: "erc20",
        decimals: 6,
        contractAddress: "0x1c7D4B196Cb0C7B7dae389ea4e0c0DdB6C0a4c4",
      },
    },
  },
  ethereum: {
    chainId: 1,
    requiredConfirmations: 3,
    explorerBaseUrl: "https://etherscan.io",
    tokens: {
      ETH: { type: "native", decimals: 18 },
      USDC: {
        type: "erc20",
        decimals: 6,
        contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      },
      USDT: {
        type: "erc20",
        decimals: 6,
        contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      },
    },
  },
  base: {
    chainId: 8453,
    requiredConfirmations: 3,
    explorerBaseUrl: "https://basescan.org",
    tokens: {
      ETH: { type: "native", decimals: 18 },
      USDC: {
        type: "erc20",
        decimals: 6,
        contractAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      },
      USDT: {
        type: "erc20",
        decimals: 6,
        contractAddress: "0xfde4C96c8594986E9729cF877A2E6F812579131",
      },
    },
  },
  polygon: {
    chainId: 137,
    requiredConfirmations: 3,
    explorerBaseUrl: "https://polygonscan.com",
    tokens: {
      ETH: { type: "native", decimals: 18 },
      USDC: {
        type: "erc20",
        decimals: 6,
        contractAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      },
      USDT: {
        type: "erc20",
        decimals: 6,
        contractAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      },
    },
  },
  arbitrum: {
    chainId: 42161,
    requiredConfirmations: 3,
    explorerBaseUrl: "https://arbiscan.io",
    tokens: {
      ETH: { type: "native", decimals: 18 },
      USDC: {
        type: "erc20",
        decimals: 6,
        contractAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      },
      USDT: {
        type: "erc20",
        decimals: 6,
        contractAddress: "0xFd086bC7CD5C481DCC9DCc7388F45d7e455Ac475",
      },
    },
  },
  localhost: {
    chainId: 31337,
    requiredConfirmations: 1,
    explorerBaseUrl: "http://127.0.0.1:8545",
    tokens: {
      ETH: { type: "native", decimals: 18 },
      USDC: {
        type: "erc20",
        decimals: 6,
        contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      },
      USDT: {
        type: "erc20",
        decimals: 6,
        contractAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      },
    },
  },
};

export function getNetworkConfig(network: Network): NetworkTokenConfig {
  return NETWORK_TOKEN_CONFIG[network];
}

export function getTokenConfig(
  network: Network,
  currency: Currency,
): TokenConfig {
  const config = NETWORK_TOKEN_CONFIG[network].tokens[currency];

  if (!config) {
    throw new Error(`Unsupported currency ${currency} on ${network}`);
  }

  return config;
}

export function getChainId(network: Network): number {
  return NETWORK_TOKEN_CONFIG[network].chainId;
}

export function getRequiredConfirmations(network: Network): number {
  return NETWORK_TOKEN_CONFIG[network].requiredConfirmations;
}

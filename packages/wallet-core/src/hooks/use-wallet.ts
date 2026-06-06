import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { WalletType } from "../types/wallet";

const targetIdMap: Record<WalletType, string[]> = {
  metamask: ["metaMask", "io.metamask", "injected"],
  walletconnect: ["walletConnect"],
  coinbase: ["coinbaseWallet", "coinbaseWalletSDK"],
};

export function useWallet() {
  const { address, isConnected, chainId, connector } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();

  const connect = async (type: WalletType) => {
    const targetIds = targetIdMap[type];
    const conn = connectors.find((c) => targetIds.includes(c.id));
    if (!conn) {
      throw new Error(`Connector for ${type} not found`);
    }
    await connectAsync({ connector: conn });
  };

  const disconnect = async () => {
    await disconnectAsync();
  };

  const switchChain = async (targetChainId: number) => {
    await switchChainAsync({ chainId: targetChainId });
  };

  return {
    address,
    connected: isConnected,
    chainId,
    connector: connector?.name || connector?.id,
    connect,
    disconnect,
    switchChain,
  };
}

"use client";

import React, { useState } from "react";
import { useWallet, useSendPayment, WalletType } from "@repo/wallet-core";
import { getChainId } from "@repo/payment-core";
import type { CheckoutData } from "@repo/payment-core";
import type { Network } from "@repo/payment-core";
import { Button } from "@repo/ui/button";

interface PayButtonProps {
  checkout: CheckoutData;
  onPayStart: () => void;
  onPaySuccess: (result: { txHash: string }) => void;
  onPayError: (err: string) => void;
}

const networkNameMap: Record<string, string> = {
  ethereum: "Ethereum",
  base: "Base",
  polygon: "Polygon",
  arbitrum: "Arbitrum",
  localhost: "Anvil Local",
};

export function PayButton({
  checkout,
  onPayStart,
  onPaySuccess,
  onPayError,
}: PayButtonProps) {
  const { address, connected, chainId, connect, switchChain } = useWallet();
  const { sendPayment } = useSendPayment();
  const [showWallets, setShowWallets] = useState(false);
  const [connectingType, setConnectingType] = useState<WalletType | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const network = checkout.network as Network;
  const targetChainId = checkout.chainId || getChainId(network);
  const targetChainName = networkNameMap[network.toLowerCase()] || "Ethereum";
  const isCorrectNetwork = chainId === targetChainId;

  const handleConnect = async (type: WalletType) => {
    setConnectingType(type);
    setError(null);
    try {
      await connect(type);
      setShowWallets(false);
    } catch (err: any) {
      console.error(err);
      const errMsg = err?.message || "Failed to connect wallet.";
      setError(errMsg);
      onPayError(errMsg);
    } finally {
      setConnectingType(null);
    }
  };

  const handleSwitchNetwork = async () => {
    setIsSwitching(true);
    setError(null);
    try {
      await switchChain(targetChainId);
    } catch (err: any) {
      console.error(err);
      const errMsg = err?.message || `Failed to switch to ${targetChainName}`;
      setError(errMsg);
      onPayError(errMsg);
    } finally {
      setIsSwitching(false);
    }
  };

  const handlePay = async () => {
    if (!address) {
      onPayError("Connect your wallet before paying.");
      return;
    }

    setIsPaying(true);
    setError(null);
    onPayStart();

    try {
      const result = await sendPayment({
        merchantAddress: checkout.merchantAddress as `0x${string}`,
        amountAtomic: BigInt(checkout.amountAtomic),
        chainId: targetChainId,
        tokenType: checkout.tokenType,
        tokenAddress: checkout.tokenAddress as `0x${string}` | undefined,
      });

      onPaySuccess({ txHash: result.txHash });
    } catch (err: any) {
      console.error(err);
      const errMsg = err?.message || "Payment processing failed.";
      setError(errMsg);
      onPayError(errMsg);
    } finally {
      setIsPaying(false);
    }
  };

  if (!connected) {
    return (
      <div className="w-full mt-5">
        {!showWallets ? (
          <Button
            id="connect-pay-button"
            variant="primary"
            className="w-full justify-center py-3 px-4 text-sm cursor-pointer shadow-lg shadow-accent/25 hover:scale-[1.01] active:scale-[0.99]"
            onClick={() => setShowWallets(true)}
          >
            Connect Wallet to Pay
          </Button>
        ) : (
          <div className="flex flex-col gap-2 p-3 bg-zinc-950/40 border border-border/80 rounded-xl animate-fade-in">
            <span className="text-[10px] font-bold text-text-muted tracking-wider uppercase block text-center mb-1">
              Select Wallet
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(["metamask", "coinbase", "walletconnect"] as WalletType[]).map(
                (type) => {
                  const names = {
                    metamask: "MetaMask",
                    coinbase: "Coinbase",
                    walletconnect: "WalletConnect",
                  };
                  const isConnecting = connectingType === type;
                  return (
                    <Button
                      key={type}
                      variant="secondary"
                      className="py-2.5 text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer bg-zinc-900/40 border-border hover:bg-zinc-900/80 active:scale-[0.97]"
                      disabled={connectingType !== null}
                      onClick={() => handleConnect(type)}
                    >
                      {isConnecting ? (
                        <svg
                          className="animate-spin h-4 w-4 text-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      ) : (
                        <span className="capitalize">
                          {names[type].slice(0, 8)}..
                        </span>
                      )}
                    </Button>
                  );
                },
              )}
            </div>
            {error && (
              <span className="text-[10px] text-danger text-center mt-1 block">
                {error}
              </span>
            )}
            <Button
              variant="ghost"
              className="text-xs py-1.5 justify-center border-none hover:bg-transparent text-text-muted hover:text-text-secondary cursor-pointer"
              onClick={() => setShowWallets(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="w-full mt-5 flex flex-col gap-2">
        <Button
          id="switch-network-button"
          variant="secondary"
          className="w-full justify-center py-3 px-4 text-sm cursor-pointer border-neon hover:bg-accent-dim hover:text-accent font-semibold active:scale-[0.99]"
          disabled={isSwitching}
          onClick={handleSwitchNetwork}
        >
          {isSwitching ? (
            <div className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-accent"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Switching...
            </div>
          ) : (
            `Switch Network to ${targetChainName}`
          )}
        </Button>
        <span className="text-[10px] text-text-muted text-center leading-normal">
          Connected address:{" "}
          <code className="font-mono">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </code>
        </span>
      </div>
    );
  }

  return (
    <div className="w-full mt-5 flex flex-col gap-2">
      <Button
        id="pay-now-button"
        variant="primary"
        className="w-full justify-center py-3 px-4 text-sm cursor-pointer shadow-lg shadow-accent/25 hover:scale-[1.01] active:scale-[0.99]"
        disabled={isPaying}
        onClick={handlePay}
      >
        {isPaying ? (
          <div className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-black"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Confirming...
          </div>
        ) : (
          `Pay ${checkout.amount.toLocaleString()} ${checkout.currency}`
        )}
      </Button>
      {error && (
        <span className="text-[10px] text-danger text-center block">
          {error}
        </span>
      )}
      <span className="text-[10px] text-text-muted text-center leading-normal">
        Connected address:{" "}
        <code className="font-mono">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </code>
      </span>
    </div>
  );
}

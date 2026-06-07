"use client";

import React, { useState } from "react";
import { useWallet } from "@repo/wallet-core";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { CopyButton } from "@repo/ui/copy-button";

const chainInfo = [
  {
    id: 1,
    name: "Ethereum Mainnet",
    shortName: "Ethereum",
    color: "bg-indigo-500 text-indigo-400",
  },
  {
    id: 8453,
    name: "Base",
    shortName: "Base",
    color: "bg-blue-500 text-blue-400",
  },
  {
    id: 137,
    name: "Polygon",
    shortName: "Polygon",
    color: "bg-purple-500 text-purple-400",
  },
  {
    id: 42161,
    name: "Arbitrum",
    shortName: "Arbitrum",
    color: "bg-cyan-500 text-cyan-400",
  },
];

export function WalletInfo() {
  const { address, chainId, connector, disconnect, switchChain } = useWallet();
  const [switchingId, setSwitchingId] = useState<number | null>(null);

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const handleSwitchChain = async (id: number) => {
    setSwitchingId(id);
    try {
      await switchChain(id);
    } catch (err) {
      console.error("Failed to switch chain:", err);
    } finally {
      setSwitchingId(null);
    }
  };

  const currentChain = chainInfo.find((c) => c.id === chainId);

  return (
    <Card className="max-w-xl" glowColor="bg-emerald-500/10">
      {/* Header with Connection Status */}
      <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-semibold tracking-wide text-emerald-400 uppercase">
            Connected via {connector || "Wallet"}
          </span>
        </div>
        <Button
          variant="danger"
          onClick={() => disconnect()}
          className="px-4 py-2 text-xs"
        >
          Disconnect
        </Button>
      </div>

      {/* Wallet Address Display */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-zinc-500 tracking-wider uppercase">
          Active Address
        </label>
        <div className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800/80 rounded-2xl">
          <code className="text-zinc-200 font-mono text-sm tracking-wide sm:text-base">
            {address ? formatAddress(address) : "0x000...0000"}
          </code>
          <CopyButton
            value={address || ""}
            className="p-2 border border-zinc-800 rounded-xl hover:scale-105 active:scale-95 text-zinc-400 hover:text-zinc-200 bg-zinc-900"
          />
        </div>
      </div>

      {/* Current Network */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-zinc-500 tracking-wider uppercase">
          Active Network
        </label>
        <div className="flex items-center gap-3 p-4 bg-zinc-950/30 border border-zinc-850 rounded-2xl">
          <span
            className={`h-2.5 w-2.5 rounded-full ${currentChain ? "bg-emerald-500" : "bg-red-500"}`}
          />
          <span className="font-semibold text-zinc-200">
            {currentChain
              ? currentChain.name
              : `Unknown Network (ID: ${chainId})`}
          </span>
        </div>
      </div>

      {/* Chain Switcher */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold text-zinc-500 tracking-wider uppercase">
          Switch Networks
        </label>
        <div className="grid grid-cols-2 gap-2">
          {chainInfo.map((chain) => {
            const isCurrent = chainId === chain.id;
            const isSwitching = switchingId === chain.id;
            return (
              <Button
                key={chain.id}
                disabled={isCurrent || switchingId !== null}
                onClick={() => handleSwitchChain(chain.id)}
                variant={isCurrent ? "secondary" : "secondary"}
                className={`flex items-center justify-between p-3.5 border text-sm font-semibold transition-all duration-300 ${
                  isCurrent
                    ? "bg-zinc-800/80 border-zinc-700 text-zinc-300 cursor-default"
                    : "bg-zinc-900/30 border-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700/80 hover:bg-zinc-900/50"
                } disabled:opacity-60`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${isCurrent ? "bg-emerald-500" : chain.color.split(" ")[0]}`}
                  />
                  <span>{chain.shortName}</span>
                </div>

                {isSwitching && (
                  <svg
                    className="animate-spin h-4 w-4 text-indigo-400"
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
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

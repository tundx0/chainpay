"use client";

import React, { useState } from "react";
import { useWallet, WalletType } from "@repo/wallet-core";

const walletOptions: {
  type: WalletType;
  name: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    type: "metamask",
    name: "MetaMask",
    color:
      "from-orange-500/10 to-amber-500/10 border-orange-500/20 hover:border-orange-500/50 hover:bg-orange-500/5 text-orange-400",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 320 311.6" fill="currentColor">
        <path d="M312.4 171.7l-32.9-63.5-35.3-26.6 24 55.4z" fill="#E2761B" />
        <path d="M7.6 171.7l32.9-63.5 35.3-26.6-24 55.4z" fill="#E2761B" />
        <path d="M251.6 220l-13-57.8-33.1 36.3 43.1 24.3z" fill="#E2761B" />
        <path d="M68.4 220l13-57.8 33.1 36.3-43.1 24.3z" fill="#E2761B" />
        <path
          d="M114.5 198.5l-33-36.3 5-34.9-38.3 35.4 34 52.8z"
          fill="#E2761B"
        />
        <path
          d="M205.5 198.5l33-36.3-5-34.9 38.3 35.4-34 52.8z"
          fill="#E2761B"
        />
        <path d="M129 119.5L160 55l31 64.5-31 7.2z" fill="#E2761B" />
        <path d="M110.1 234.3l37 20-30.8 17.5-6.2-37.5z" fill="#E2761B" />
        <path d="M209.9 234.3l-37 20 30.8 17.5 6.2-37.5z" fill="#E2761B" />
        <path d="M160 279l32.3-30.8-32.3 8.3-32.3-8.3z" fill="#E2761B" />
        <path d="M243.6 162.2l-38.1 36.3 3.1 16.5 43-24.3z" fill="#D7C1B1" />
        <path d="M76.4 162.2l38.1 36.3-3.1 16.5-43-24.3z" fill="#D7C1B1" />
        <path d="M160 191.2l-30.8-7.2-3.1 16.5 33.9 19.5z" fill="#D7C1B1" />
        <path d="M160 191.2l30.8-7.2 3.1 16.5-33.9 19.5z" fill="#D7C1B1" />
        <path
          d="M205.5 198.5l-45.5-7.3-31 7.3-4.9-59.5 4.9-19.5 31 43.5 31-43.5 4.9 19.5z"
          fill="#161616"
        />
        <path d="M279.4 142.3l-35.3-26.6 24 55.4z" fill="#763D16" />
        <path d="M40.6 142.3l35.3-26.6-24 55.4z" fill="#763D16" />
        <path d="M147.1 254.3l-37-20 6.2 37.5z" fill="#763D16" />
        <path d="M172.9 254.3l37-20-6.2 37.5z" fill="#763D16" />
        <path d="M243.6 220l-43.1-24.3 9.4 58.6z" fill="#F89C35" />
        <path d="M76.4 220l43.1-24.3-9.4 58.6z" fill="#F89C35" />
        <path d="M110.1 234.3l6.2 37.5-6.2 3.7z" fill="#F89C35" />
        <path d="M209.9 234.3l-6.2 37.5 6.2 3.7z" fill="#F89C35" />
        <path d="M160 311.6l32.3-32.6H127.7z" fill="#F89C35" />
      </svg>
    ),
  },
  {
    type: "walletconnect",
    name: "WalletConnect",
    color:
      "from-blue-500/10 to-indigo-500/10 border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-500/5 text-blue-400",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="currentColor">
        <path d="M24.327 10.455c-4.599-4.599-12.055-4.599-16.654 0L1.758 16.37a.64.64 0 000 .907l2.84 2.84a.64.64 0 00.908 0l5.834-5.834a6.42 6.42 0 019.066 0l5.894 5.894a.64.64 0 00.908 0l2.84-2.84a.64.64 0 000-.907l-5.721-5.775zM31.285 16.37l-1.921-1.922a.64.64 0 00-.908 0l-5.834 5.835a2.57 2.57 0 01-3.626 0l-1.921-1.922a1.286 1.286 0 00-1.815 0l-1.922 1.922a2.57 2.57 0 01-3.626 0L3.824 14.448a.64.64 0 00-.908 0L.995 16.37a.64.64 0 000 .907l7.857 7.858a.64.64 0 00.908 0l5.834-5.835a2.57 2.57 0 013.626 0l5.834 5.835a.64.64 0 00.908 0l7.858-7.858a.64.64 0 00-.535-.907z" />
      </svg>
    ),
  },
  {
    type: "coinbase",
    name: "Coinbase Wallet",
    color:
      "from-blue-600/10 to-sky-600/10 border-blue-600/20 hover:border-blue-600/50 hover:bg-blue-600/5 text-blue-500",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 15c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z" />
      </svg>
    ),
  },
];

export function ConnectWallet() {
  const { connect } = useWallet();
  const [connectingType, setConnectingType] = useState<WalletType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async (type: WalletType) => {
    setConnectingType(type);
    setError(null);
    try {
      await connect(type);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ||
          "Failed to connect wallet. Make sure the extension is installed.",
      );
    } finally {
      setConnectingType(null);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative flex flex-col items-center text-center gap-6">
        <div className="p-3 bg-zinc-800/80 border border-zinc-700/50 rounded-2xl shadow-inner text-zinc-400">
          <svg
            className="w-8 h-8 animate-pulse text-indigo-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
            />
          </svg>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            Connect a Wallet
          </h2>
          <p className="text-sm text-zinc-400 max-w-xs">
            Select one of the supported wallets to authenticate and connect to
            ChainPay.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3 mt-2">
          {walletOptions.map((wallet) => {
            const isConnecting = connectingType === wallet.type;
            return (
              <button
                key={wallet.type}
                onClick={() => handleConnect(wallet.type)}
                disabled={connectingType !== null}
                className={`flex items-center gap-4 p-4 rounded-2xl border bg-zinc-900/30 transition-all duration-300 group relative ${wallet.color} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="p-2 bg-zinc-800/50 border border-zinc-700/40 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  {wallet.icon}
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-semibold text-zinc-200 group-hover:text-zinc-100 transition-colors">
                    {wallet.name}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {isConnecting ? "Connecting..." : "Click to connect"}
                  </span>
                </div>

                {isConnecting && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg
                      className="animate-spin h-5 w-5 text-indigo-400"
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
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="w-full mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-medium leading-5">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

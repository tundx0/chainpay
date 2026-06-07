"use client";

import React from "react";

interface MarketTickerProps {
  rates: Record<string, number>;
  loading?: boolean;
  lastUpdated?: string;
  showTitle?: boolean;
}

export function MarketTicker({
  rates,
  loading = false,
  lastUpdated,
  showTitle = true,
}: MarketTickerProps) {
  return (
    <div className="flex gap-4 items-center px-4 py-2.5 bg-[#0a0a0c]/20 border border-[#1f1f23]/50 rounded-xl font-mono text-[10px] text-[#52525b] tracking-wider flex-wrap">
      {showTitle && (
        <span className="text-[#a1a1aa] font-bold uppercase flex items-center gap-1.5 shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-[#CCFF00] animate-pulse shadow-[0_0_8px_#CCFF00]" />
          Market Telemetry:
        </span>
      )}
      <div className="flex gap-4 flex-wrap">
        <div className="flex gap-1.5">
          <span>ETH/USD:</span>
          <span className={`font-bold ${loading ? "animate-pulse text-[#52525b]" : "text-[#fafafa]"}`}>
            {rates.ETH ? `$${rates.ETH.toLocaleString()}` : "Loading..."}
          </span>
        </div>
        <div className="flex gap-1.5">
          <span>BTC/USD:</span>
          <span className={`font-bold ${loading ? "animate-pulse text-[#52525b]" : "text-[#fafafa]"}`}>
            {rates.BTC ? `$${rates.BTC.toLocaleString()}` : "Loading..."}
          </span>
        </div>
        <div className="flex gap-1.5">
          <span>USDC/USD:</span>
          <span className="text-[#CCFF00] font-bold">$1.00</span>
        </div>
      </div>
      {lastUpdated && (
        <span className="ml-auto text-[9px] text-[#52525b]/80 hidden md:inline">
          SYNC: {lastUpdated}
        </span>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";

interface PriceEstimatorProps {
  rates: Record<string, number>;
  initialAmount?: string;
  initialCurrency?: string;
}

export function PriceEstimator({
  rates,
  initialAmount = "1.5",
  initialCurrency = "ETH",
}: PriceEstimatorProps) {
  const [amount, setAmount] = useState<string>(initialAmount);
  const [currency, setCurrency] = useState<string>(initialCurrency);

  const rate = rates[currency] ?? 1.0;
  const calculatedUsd = Number(amount || 0) * rate;

  return (
    <div className="cyber-card p-6 flex flex-col gap-6 max-w-[500px] w-full mx-auto">
      <div className="cyber-grid-overlay" />
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-[#fafafa] mb-1">Estimation Telemetry</h3>
        <p className="text-xs text-[#a1a1aa] mb-4 leading-relaxed">
          Compute the target crypto invoice value against real-time rates.
        </p>
      </div>

      <div className="relative z-10 flex gap-3">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="flex-1 bg-black/40 border border-[#1f1f23] text-[#fafafa] px-4 py-3 rounded-xl font-mono text-[14px] outline-none transition-all duration-300 focus:border-[#CCFF00] focus:shadow-[0_0_12px_rgba(204,255,0,0.12)]"
        />
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="bg-black/40 border border-[#1f1f23] text-[#fafafa] px-4 py-3 rounded-xl font-mono text-[13px] outline-none transition-all duration-300 focus:border-[#CCFF00] font-bold cursor-pointer"
        >
          <option value="ETH">ETH</option>
          <option value="BTC">BTC</option>
          <option value="USDC">USDC</option>
          <option value="USDT">USDT</option>
        </select>
      </div>

      <div className="relative z-10 bg-[rgba(204,255,0,0.03)] border border-dashed border-[rgba(204,255,0,0.15)] p-4 rounded-xl flex flex-col gap-1.5 transition-all duration-300 hover:border-[#CCFF00]/40">
        <span className="text-[9px] text-[#52525b] font-bold tracking-wider uppercase">ESTIMATED USD VALUE</span>
        <span className="font-mono text-2xl font-black text-[#CCFF00] tracking-tight">
          $
          {calculatedUsd.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    </div>
  );
}

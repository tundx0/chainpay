"use client";

import React from "react";
import { CopyButton } from "@repo/ui/copy-button";
import { shortAddr } from "@repo/shared";

interface PaymentDetailsProps {
  amount: number;
  currency: string;
  network: string;
  merchantAddress: string;
  description: string | null;
  usdRate?: number;
  usdAmount?: number;
}

export function PaymentDetails({
  amount,
  currency,
  network,
  merchantAddress,
  description,
  usdRate,
  usdAmount,
}: PaymentDetailsProps) {
  return (
    <div className="flex flex-col gap-4">
      {description && (
        <div className="p-3 bg-zinc-950/30 border border-border/60 rounded-xl">
          <label className="text-[10px] font-bold text-text-muted tracking-wider uppercase block mb-1">
            Description
          </label>
          <p className="text-xs text-text-secondary leading-relaxed font-medium">
            {description}
          </p>
        </div>
      )}

      <div className="checkout-meta bg-zinc-950/20 p-4 rounded-xl border border-border/40 mt-0 pt-4">
        <div className="checkout-meta-row mb-3 last:mb-0">
          <span className="checkout-meta-key text-xs font-semibold text-text-muted tracking-wide uppercase">
            Network
          </span>
          <span className="checkout-meta-val capitalize text-xs font-bold text-text-secondary flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            {network}
          </span>
        </div>

        <div className="checkout-meta-row mb-3 last:mb-0">
          <span className="checkout-meta-key text-xs font-semibold text-text-muted tracking-wide uppercase">
            Asset / Currency
          </span>
          <span className="checkout-meta-val text-xs font-bold text-text-secondary">
            {currency}
          </span>
        </div>

        {usdRate !== undefined && (
          <div className="checkout-meta-row mb-3 last:mb-0">
            <span className="checkout-meta-key text-xs font-semibold text-text-muted tracking-wide uppercase">
              Exchange Rate
            </span>
            <span className="checkout-meta-val text-xs font-mono text-text-secondary">
              1 {currency} ≈ $
              {usdRate.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              USD
            </span>
          </div>
        )}

        {usdAmount !== undefined && (
          <div className="checkout-meta-row mb-3 last:mb-0">
            <span className="checkout-meta-key text-xs font-semibold text-text-muted tracking-wide uppercase">
              USD Equivalent
            </span>
            <span className="checkout-meta-val text-xs font-mono text-accent font-bold">
              $
              {usdAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              USD
            </span>
          </div>
        )}

        <div className="checkout-meta-row last:mb-0">
          <span className="checkout-meta-key text-xs font-semibold text-text-muted tracking-wide uppercase">
            Recipient Address
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs text-text-secondary">
              {shortAddr(merchantAddress)}
            </span>
            <CopyButton
              value={merchantAddress}
              className="p-1 h-auto text-text-secondary hover:text-text-primary rounded-lg border border-border bg-surface-raised cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

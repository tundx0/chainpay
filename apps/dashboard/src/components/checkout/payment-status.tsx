"use client";

import React, { useEffect, useState } from "react";
import { buildExplorerTxUrl } from "@repo/payment-core";
import type {
  Network,
  PaymentStatus as DbPaymentStatus,
} from "@repo/payment-core";

interface PaymentStatusProps {
  status: "pending" | "processing" | "completed" | "failed";
  amount: number;
  currency: string;
  network: string;
  txHash?: string;
  confirmations?: number;
  requiredConfirmations?: number;
  serverStatus?: DbPaymentStatus;
  errorMsg?: string | null;
}

export function PaymentStatus({
  status,
  amount,
  currency,
  network,
  txHash,
  confirmations = 0,
  requiredConfirmations = 1,
  serverStatus,
  errorMsg,
}: PaymentStatusProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (status === "processing") {
      const interval = setInterval(() => {
        setDots((d) => (d.length >= 3 ? "" : d + "."));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [status]);

  const formatHash = (hash: string) => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  if (status === "processing") {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in">
        <div className="relative mb-6 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-accent-border border-t-accent animate-spin" />
          <div className="absolute w-8 h-8 rounded-full bg-zinc-950 flex items-center justify-center border border-border/80">
            <span className="h-2.5 w-2.5 rounded-full bg-accent animate-ping" />
          </div>
        </div>

        <h3 className="text-sm font-bold text-text-primary tracking-wide uppercase">
          Broadcasting Transaction{dots}
        </h3>
        <p className="text-xs text-text-muted mt-2 max-w-xs leading-relaxed font-medium">
          Verifying signatures and monitoring the block explorer for
          confirmation.
        </p>

        <div className="w-full mt-6 p-3 bg-zinc-950/40 border border-border/60 rounded-xl text-left font-mono text-[10px] text-text-muted leading-relaxed flex flex-col gap-1">
          <div className="flex justify-between">
            <span>METHOD:</span>
            <span className="text-text-secondary">
              transfer(address,uint256)
            </span>
          </div>
          <div className="flex justify-between">
            <span>GAS PRICE:</span>
            <span className="text-accent">Auto-Optimize</span>
          </div>
          <div className="flex justify-between">
            <span>STATUS:</span>
            <span className="text-warning animate-pulse">MEMPOOL_PENDING</span>
          </div>
        </div>
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-6 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-accent-dim border border-accent/30 flex items-center justify-center mb-6 relative shadow-[0_0_20px_rgba(204,255,0,0.1)]">
          <svg
            className="w-8 h-8 text-accent"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        </div>

        <h3 className="text-base font-extrabold text-text-primary tracking-tight">
          {serverStatus === "completed"
            ? "Payment Confirmed"
            : "Payment Submitted"}
        </h3>
        <p className="text-xs text-text-muted mt-1 font-medium">
          {serverStatus === "completed"
            ? `Successfully processed ${amount.toLocaleString()} ${currency}`
            : `Sent ${amount.toLocaleString()} ${currency}. Awaiting on-chain confirmation.`}
        </p>

        {serverStatus === "confirming" || serverStatus === "detected" ? (
          <p className="text-[11px] text-warning mt-2 font-mono">
            {confirmations}/{requiredConfirmations} confirmations
          </p>
        ) : null}

        {txHash && (
          <div className="w-full mt-6 p-4 bg-zinc-950/40 border border-border/80 rounded-xl text-left">
            <div className="flex flex-col gap-1.5 font-mono text-[11px]">
              <span className="text-[10px] text-text-muted font-bold tracking-wider uppercase font-sans">
                Transaction Hash
              </span>
              <a
                href={buildExplorerTxUrl(network as Network, txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover font-semibold break-all leading-relaxed flex items-center gap-1.5"
              >
                {formatHash(txHash)}
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-6 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6 relative">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h3 className="text-base font-extrabold text-text-primary tracking-tight">
          Payment Failed
        </h3>
        <p className="text-xs text-text-muted mt-1 max-w-xs leading-normal">
          {errorMsg ||
            "The transaction was reverted or rejected by your wallet."}
        </p>
      </div>
    );
  }

  return null;
}

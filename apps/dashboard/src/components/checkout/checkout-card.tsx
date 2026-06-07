"use client";

import React, { useEffect, useState } from "react";
import { PaymentQr } from "./payment-qr";
import { PaymentDetails } from "./payment-details";
import { PaymentUri } from "./payment-uri";
import { PayButton } from "./pay-button";
import { PaymentStatus } from "./payment-status";
import { paymentClient } from "@repo/payment-core";
import { useWallet } from "@repo/wallet-core";
import type { PaymentRequest, CheckoutData } from "@repo/payment-core";

interface CheckoutCardProps {
  payment: PaymentRequest;
  checkout: CheckoutData;
}

type TabType = "qr" | "details" | "uri";

const STATUS_META = {
  pending: { label: "Awaiting Payment", badgeClass: "badge-pending" },
  detected: { label: "Payment Detected", badgeClass: "badge-detected" },
  confirming: { label: "Confirming", badgeClass: "badge-confirming" },
  completed: { label: "Completed", badgeClass: "badge-completed" },
  failed: { label: "Failed", badgeClass: "badge-failed" },
  expired: { label: "Expired", badgeClass: "badge-expired" },
};

export function CheckoutCard({ payment, checkout }: CheckoutCardProps) {
  const { address } = useWallet();
  const [activeTab, setActiveTab] = useState<TabType>("qr");
  const [status, setStatus] = useState<
    "pending" | "processing" | "completed" | "failed"
  >(
    payment.status === "completed" ||
      payment.status === "detected" ||
      payment.status === "confirming"
      ? "completed"
      : "pending",
  );
  const [txHash, setTxHash] = useState<string>(payment.txHash ?? "");
  const [serverStatus, setServerStatus] = useState(payment.status);
  const [confirmations, setConfirmations] = useState(payment.confirmations);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "completed") return;

    const poll = async () => {
      try {
        const { payment: latest } = await paymentClient.getPayment(payment.id);
        setServerStatus(latest.status);
        setConfirmations(latest.confirmations);
        if (latest.txHash) {
          setTxHash(latest.txHash);
        }
      } catch (error) {
        console.error("Failed to poll payment status:", error);
      }
    };

    void poll();
    const interval = setInterval(() => void poll(), 5_000);
    return () => clearInterval(interval);
  }, [status, payment.id]);

  const handlePayStart = () => {
    setStatus("processing");
    setErrorMsg(null);
  };

  const handlePaySuccess = async ({ txHash: hash }: { txHash: string }) => {
    setTxHash(hash);

    if (!address) {
      setStatus("failed");
      setErrorMsg("Wallet address unavailable after payment.");
      return;
    }

    try {
      await paymentClient.submitPayment(payment.id, hash, address);
      setStatus("completed");
    } catch (err: any) {
      console.error("Failed to record payment on backend:", err);
      setStatus("failed");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Payment was sent but could not be recorded. Save your transaction hash.",
      );
    }
  };

  const handlePayError = (err: string) => {
    setStatus("failed");
    setErrorMsg(err);
    setTimeout(() => {
      setStatus("pending");
      setErrorMsg(null);
    }, 4000);
  };

  const meta =
    status === "processing"
      ? { label: "Broadcasting", badgeClass: "badge-confirming" }
      : serverStatus in STATUS_META
        ? STATUS_META[serverStatus as keyof typeof STATUS_META]
        : status === "failed"
          ? STATUS_META.failed
          : STATUS_META.pending;

  return (
    <div className="checkout-card cyber-glass fade-up relative max-w-[400px] w-full border border-accent-border/40 shadow-[0_0_30px_rgba(204,255,0,0.02)]">
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="checkout-header border-b border-border/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="sidebar-logo-mark h-6 w-6">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M2 9.5L7 2l1.5 4.5H12L7 12l1.5-4.5H2Z" fill="#000000" />
            </svg>
          </div>
          <span className="sidebar-logo-text text-sm">
            Chain<span>Pay</span>
          </span>
        </div>

        <span className={`badge ${meta.badgeClass} ml-auto font-bold`}>
          {meta.label}
        </span>
      </div>

      <div className="checkout-body">
        {status === "pending" ? (
          <div className="flex flex-col">
            <div className="flex flex-col mb-5">
              <span className="checkout-amount font-bold">
                {Number(checkout.amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6,
                })}
              </span>
              <span className="checkout-currency text-text-muted mt-1 uppercase font-semibold flex items-center gap-1.5 flex-wrap">
                <span>
                  {checkout.currency} · {checkout.network}
                </span>
                {checkout.usdAmount !== undefined && (
                  <>
                    <span className="text-[10px] text-text-muted/60">•</span>
                    <span className="text-accent text-[11px] font-mono lowercase tracking-normal font-bold">
                      ≈ $
                      {checkout.usdAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      usd
                    </span>
                  </>
                )}
              </span>
            </div>

            <div className="flex p-1 bg-zinc-950/60 border border-border/80 rounded-xl mb-4">
              {(["qr", "details", "uri"] as TabType[]).map((tab) => {
                const labels = {
                  qr: "QR Code",
                  details: "Details",
                  uri: "Copy URI",
                };
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-surface-raised border border-border text-accent font-extrabold shadow-sm"
                        : "text-text-muted hover:text-text-secondary border border-transparent"
                    }`}
                  >
                    {labels[tab]}
                  </button>
                );
              })}
            </div>

            <div className="min-h-[220px] transition-all duration-300">
              {activeTab === "qr" && <PaymentQr uri={checkout.paymentUri} />}
              {activeTab === "details" && (
                <PaymentDetails
                  amount={checkout.amount}
                  currency={checkout.currency}
                  network={checkout.network}
                  merchantAddress={checkout.merchantAddress}
                  description={payment.description}
                  usdRate={checkout.usdRate}
                  usdAmount={checkout.usdAmount}
                />
              )}
              {activeTab === "uri" && <PaymentUri uri={checkout.paymentUri} />}
            </div>

            <PayButton
              checkout={checkout}
              onPayStart={handlePayStart}
              onPaySuccess={handlePaySuccess}
              onPayError={handlePayError}
            />
          </div>
        ) : (
          <PaymentStatus
            status={status}
            amount={checkout.amount}
            currency={checkout.currency}
            network={checkout.network}
            txHash={txHash}
            confirmations={confirmations}
            requiredConfirmations={checkout.requiredConfirmations}
            serverStatus={serverStatus}
            errorMsg={errorMsg}
          />
        )}
      </div>
    </div>
  );
}

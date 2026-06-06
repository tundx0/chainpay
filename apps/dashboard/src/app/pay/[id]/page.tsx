"use client";

import { use, useEffect, useState } from "react";
import { paymentClient } from "@repo/payment-core";
import type { PaymentRequest } from "@repo/payment-core";
import { Button } from "@repo/ui/button";

const STATUS_META = {
  pending:   { label: "Awaiting Payment", color: "var(--warning)",  dot: "var(--warning)" },
  completed: { label: "Completed",         color: "var(--success)",  dot: "var(--success)" },
  failed:    { label: "Failed",            color: "var(--danger)",   dot: "var(--danger)" },
  expired:   { label: "Expired",           color: "var(--text-muted)", dot: "var(--text-muted)" },
};

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [payment, setPayment] = useState<PaymentRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    paymentClient
      .getPayment(id)
      .then((r) => setPayment(r.payment))
      .catch((e) => setError(e instanceof Error ? e.message : "Payment not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const meta = payment ? STATUS_META[payment.status] : null;

  return (
    <div className="checkout-shell">
      <div className="checkout-card fade-up">
        {/* Header */}
        <div className="checkout-header">
          <div className="w-[26px] h-[26px] rounded-[6px] bg-accent flex items-center justify-center shrink-0">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M2 9.5L7 2l1.5 4.5H12L7 12l1.5-4.5H2Z" fill="#000000" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-text-primary tracking-[-0.2px]">
            Chain<span className="text-muted font-normal">Pay</span>
          </span>

          {meta && (
            <span className={`badge badge-${payment?.status} ml-auto`}>
              {meta.label}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="checkout-body">
          {loading && (
            <>
              <div className="skeleton h-[38px] w-[140px] mb-2" />
              <div className="skeleton h-4 w-20" />
            </>
          )}

          {error && (
            <div className="alert-error">{error}</div>
          )}

          {payment && (
            <>
              <div className="checkout-amount">
                {Number(payment.amount).toLocaleString()}
              </div>
              <div className="checkout-currency">
                {payment.currency} · {payment.network.charAt(0).toUpperCase() + payment.network.slice(1)}
              </div>

              {payment.description && (
                <p className="mt-3 text-[13px] text-muted">
                  {payment.description}
                </p>
              )}

              <div className="checkout-meta">
                <div className="checkout-meta-row">
                  <span className="checkout-meta-key">Payment ID</span>
                  <span className="mono-id checkout-meta-val">{payment.id}</span>
                </div>
                <div className="checkout-meta-row">
                  <span className="checkout-meta-key">Network</span>
                  <span className="checkout-meta-val capitalize">
                    {payment.network}
                  </span>
                </div>
                <div className="checkout-meta-row">
                  <span className="checkout-meta-key">Created</span>
                  <span className="checkout-meta-val">
                    {new Date(payment.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {payment.status === "pending" && (
                <Button
                  id="pay-now-button"
                  variant="primary"
                  className="w-full justify-center mt-5 py-3 px-4 text-sm"
                >
                  Pay Now
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

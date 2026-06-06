"use client";

import { use, useEffect, useState } from "react";
import { paymentClient } from "@repo/payment-core";
import type { PaymentRequest } from "@repo/payment-core";

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
          <div style={{
            width: 26, height: 26, borderRadius: 6,
            background: "var(--accent)", display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M2 9.5L7 2l1.5 4.5H12L7 12l1.5-4.5H2Z" fill="#000000" />
            </svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.2px" }}>
            Chain<span style={{ color: "var(--text-muted)", fontWeight: 400 }}>Pay</span>
          </span>

          {meta && (
            <span className={`badge badge-${payment?.status}`} style={{ marginLeft: "auto" }}>
              {meta.label}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="checkout-body">
          {loading && (
            <>
              <div className="skeleton" style={{ height: 38, width: 140, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 16, width: 80 }} />
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
                <p style={{ marginTop: 12, fontSize: 13, color: "var(--text-muted)" }}>
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
                  <span className="checkout-meta-val" style={{ textTransform: "capitalize" }}>
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
                <button
                  id="pay-now-button"
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", marginTop: 20, padding: "12px 16px", fontSize: 14 }}
                >
                  Pay Now
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

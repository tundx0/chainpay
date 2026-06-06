"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { paymentClient } from "@repo/payment-core";
import type { PaymentRequest } from "@repo/payment-core";

export default function DashboardContent() {
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentClient
      .listPayments()
      .then((d) => setPayments(d.payments))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = payments.length;
  const pending = payments.filter((p) => p.status === "pending").length;
  const completed = payments.filter((p) => p.status === "completed").length;
  const totalVolume = payments
    .filter((p) => p.status === "completed")
    .reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Page header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 className="page-title" style={{ textTransform: "uppercase", letterSpacing: "-0.02em" }}>Overview</h1>
          <p className="page-desc">Telemetry metrics and settlement activity.</p>
        </div>
        <Link href="/payments/new" className="btn btn-primary">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 1v10M1 6h10" strokeLinecap="round" />
          </svg>
          New Invoice
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="cyber-card">
          <div className="cyber-grid-overlay" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span className="stat-label" style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 10, letterSpacing: "0.05em", color: "var(--text-muted)" }}>[ TOTAL_REQUESTS ]</span>
            <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>RECORD_LOGS</span>
          </div>
          <div className="cyber-telemetry-num">{loading ? "—" : total}</div>
          <div className="stat-sub" style={{ marginTop: 8, fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>ALL_TIME_COUNT</div>
        </div>
        
        <div className="cyber-card">
          <div className="cyber-grid-overlay" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span className="stat-label" style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 10, letterSpacing: "0.05em", color: "var(--text-muted)" }}>[ PENDING_INVOICES ]</span>
            <span style={{ fontSize: 9, color: "var(--warning)", fontFamily: "var(--font-mono, monospace)" }}>AWAITING_TX</span>
          </div>
          <div className="cyber-telemetry-num" style={{ color: "var(--warning)", textShadow: "0 0 15px rgba(255, 255, 0, 0.15)" }}>
            {loading ? "—" : pending}
          </div>
          <div className="stat-sub" style={{ marginTop: 8, fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>UNSETTLED_FUNDS</div>
        </div>

        <div className="cyber-card" style={{ borderColor: "rgba(204, 255, 0, 0.2)" }}>
          <div className="cyber-grid-overlay" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span className="stat-label" style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 10, letterSpacing: "0.05em", color: "var(--text-muted)" }}>[ TOTAL_VOLUME ]</span>
            <span style={{ fontSize: 9, color: "var(--accent)", fontFamily: "var(--font-mono, monospace)", display: "flex", alignItems: "center", gap: 4 }}>
              <span className="cyber-pulse-dot" /> LIVE_LEDGER
            </span>
          </div>
          <div className="cyber-telemetry-num" style={{ color: "var(--accent)" }}>
            {loading ? "—" : totalVolume > 0 ? `$${totalVolume.toLocaleString()}` : "$0"}
          </div>
          <div className="stat-sub" style={{ marginTop: 8, fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>{completed} SETTLED_TX</div>
        </div>
      </div>

      {/* Recent payments */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 750, color: "var(--text-secondary)", fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.08em" }}>
            [ RECENT_TRANSACTIONS ]
          </span>
          <Link href="/payments" className="btn btn-ghost btn-sm" style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11 }}>
            View all &rarr;
          </Link>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="table-empty">
              <div className="skeleton" style={{ height: 14, width: 120, margin: "0 auto 8px" }} />
              <div className="skeleton" style={{ height: 12, width: 80, margin: "0 auto" }} />
            </div>
          ) : payments.length === 0 ? (
            <div className="table-empty">
              <p style={{ margin: 0, fontFamily: "var(--font-mono, monospace)", fontSize: 13 }}>NO_ACTIVE_INVOICE_LOGS</p>
              <p style={{ margin: "6px 0 0", fontSize: 12 }}>
                <Link href="/payments/new" style={{ color: "var(--accent)", textDecoration: "none", fontFamily: "var(--font-mono, monospace)" }}>
                  INITIALIZE_FIRST_PAYMENT &rarr;
                </Link>
              </p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Network</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td><span className="mono-id">{p.id}</span></td>
                    <td style={{ color: "var(--text-primary)", fontWeight: 600, fontFamily: "var(--font-mono, monospace)" }}>
                      {Number(p.amount).toLocaleString()}
                    </td>
                    <td style={{ fontFamily: "var(--font-mono, monospace)" }}>{p.currency}</td>
                    <td style={{ textTransform: "capitalize", fontFamily: "var(--font-mono, monospace)" }}>{p.network}</td>
                    <td>
                      <span className={`badge badge-${p.status}`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

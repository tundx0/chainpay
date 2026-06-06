"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { paymentClient } from "@repo/payment-core";
import type { PaymentRequest } from "@repo/payment-core";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentClient.listPayments();
      setPayments(data.payments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 className="page-title" style={{ textTransform: "uppercase", letterSpacing: "-0.02em" }}>Ledger</h1>
          <p className="page-desc">Complete cryptographic payment audit logs.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            id="refresh-payments"
            className="btn btn-ghost"
            style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11 }}
            onClick={() => void load()}
            disabled={loading}
          >
            {loading ? "SYS_SYNCING..." : "SYNC_LEDGER"}
          </button>
          <Link id="create-payment-link" href="/payments/new" className="btn btn-primary" style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11 }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4 }}>
              <path d="M6 1v10M1 6h10" strokeLinecap="round" />
            </svg>
            NEW_INVOICE
          </Link>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="table-wrap">
        {loading && payments.length === 0 ? (
          <div className="table-empty">
            <div className="skeleton" style={{ height: 14, width: 140, margin: "0 auto 8px" }} />
            <div className="skeleton" style={{ height: 12, width: 90, margin: "0 auto" }} />
          </div>
        ) : payments.length === 0 ? (
          <div className="table-empty">
            <p style={{ margin: 0, fontFamily: "var(--font-mono, monospace)", fontSize: 13 }}>NO_LEDGER_RECORDS_FOUND</p>
            <p style={{ margin: "6px 0 0", fontSize: 12 }}>
              <Link href="/payments/new" style={{ color: "var(--accent)", textDecoration: "none", fontFamily: "var(--font-mono, monospace)" }}>
                GENERATE_INVOICE_LOGS &rarr;
              </Link>
            </p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>INVOICE_ID</th>
                <th>AMOUNT</th>
                <th>CURRENCY</th>
                <th>L2_NETWORK</th>
                <th>METADATA_DESC</th>
                <th>STATE</th>
                <th>TIMESTAMP</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td><span className="mono-id">{p.id}</span></td>
                  <td style={{ color: "var(--text-primary)", fontWeight: 600, fontFamily: "var(--font-mono, monospace)" }}>
                    {Number(p.amount).toLocaleString()}
                  </td>
                  <td style={{ fontFamily: "var(--font-mono, monospace)" }}>{p.currency}</td>
                  <td style={{ textTransform: "uppercase", fontSize: 11, fontFamily: "var(--font-mono, monospace)", color: "var(--text-secondary)" }}>{p.network}</td>
                  <td style={{ color: "var(--text-muted)", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "var(--font-mono, monospace)", fontSize: 12 }}>
                    {p.description ?? <span style={{ color: "var(--border)" }}>NULL_DESC</span>}
                  </td>
                  <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                  <td style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)", fontSize: 12 }}>
                    {new Date(p.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

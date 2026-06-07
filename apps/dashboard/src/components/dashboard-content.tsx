"use client";

import Link from "next/link";
import { useWallet, useRates, usePayments } from "@repo/wallet-core";
import { MarketTicker } from "@repo/ui/market-ticker";

export default function DashboardContent() {
  const { address } = useWallet();
  const { data: ratesData, isLoading: ratesLoading } = useRates();
  const { data: paymentsData, isLoading: paymentsLoading } = usePayments(address);

  const rates = ratesData ?? { ETH: 0, BTC: 0 };
  const payments = paymentsData?.payments ?? [];
  const loading = paymentsLoading || ratesLoading;

  const total = payments.length;
  const pending = payments.filter((p) => p.status === "pending").length;
  const completed = payments.filter((p) => p.status === "completed").length;
  const totalVolume = payments
    .filter((p) => p.status === "completed")
    .reduce((s, p) => s + Number(p.usdValue || 0), 0);

  return (
    <div className="fade-up flex flex-col gap-8">
      {/* Page header */}
      <div className="page-header mb-0">
        <div>
          <h1 className="page-title uppercase tracking-[-0.02em]">Overview</h1>
          <p className="page-desc">
            Telemetry metrics and settlement activity.
          </p>
        </div>
        <Link href="/payments/new" className="btn btn-primary">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 1v10M1 6h10" strokeLinecap="round" />
          </svg>
          New Invoice
        </Link>
      </div>

      {/* Market Telemetry Ticker */}
      <MarketTicker rates={rates} />

      {/* Stats */}
      <div className="stats-grid">
        <div className="cyber-card">
          <div className="cyber-grid-overlay" />
          <div className="flex justify-between items-center mb-3">
            <span className="stat-label font-mono text-[10px] tracking-wider text-muted">
              [ TOTAL_REQUESTS ]
            </span>
            <span className="font-mono text-xxs text-muted">RECORD_LOGS</span>
          </div>
          <div className="cyber-telemetry-num">{loading ? "—" : total}</div>
          <div className="stat-sub mt-2 text-[11px] text-muted font-mono">
            ALL_TIME_COUNT
          </div>
        </div>

        <div className="cyber-card">
          <div className="cyber-grid-overlay" />
          <div className="flex justify-between items-center mb-3">
            <span className="stat-label font-mono text-[10px] tracking-wider text-muted">
              [ PENDING_INVOICES ]
            </span>
            <span className="font-mono text-xxs text-warning">AWAITING_TX</span>
          </div>
          <div className="cyber-telemetry-num text-warning glow-warning">
            {loading ? "—" : pending}
          </div>
          <div className="stat-sub mt-2 text-[11px] text-muted font-mono">
            UNSETTLED_FUNDS
          </div>
        </div>

        <div className="cyber-card border-accent-border">
          <div className="cyber-grid-overlay" />
          <div className="flex justify-between items-center mb-3">
            <span className="stat-label font-mono text-[10px] tracking-wider text-muted">
              [ TOTAL_VOLUME ]
            </span>
            <span className="font-mono text-xxs text-accent flex items-center gap-1">
              <span className="cyber-pulse-dot" /> LIVE_LEDGER
            </span>
          </div>
          <div className="cyber-telemetry-num text-accent">
            {loading
              ? "—"
              : totalVolume > 0
                ? `$${totalVolume.toLocaleString()}`
                : "$0"}
          </div>
          <div className="stat-sub mt-2 text-[11px] text-muted font-mono">
            {completed} SETTLED_TX
          </div>
        </div>
      </div>

      {/* Recent payments */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-[750] text-text-secondary font-mono tracking-[0.08em]">
            [ RECENT_TRANSACTIONS ]
          </span>
          <Link
            href="/payments"
            className="btn btn-ghost btn-sm font-mono text-[11px]"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="table-empty">
              <div className="skeleton h-[14px] w-[120px] mx-auto mb-2" />
              <div className="skeleton h-[12px] w-[80px] mx-auto" />
            </div>
          ) : payments.length === 0 ? (
            <div className="table-empty">
              <p className="m-0 font-mono text-[13px]">
                NO_ACTIVE_INVOICE_LOGS
              </p>
              <p className="mt-[6px] text-xs">
                <Link
                  href="/payments/new"
                  className="text-accent no-underline font-mono"
                >
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
                    <td>
                      <span className="mono-id">{p.id}</span>
                    </td>
                    <td className="text-text-primary font-semibold font-mono">
                      {Number(p.amount).toLocaleString()}
                    </td>
                    <td className="font-mono">{p.currency}</td>
                    <td className="capitalize font-mono">{p.network}</td>
                    <td>
                      <span className={`badge badge-${p.status}`}>
                        {p.status}
                      </span>
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

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { paymentClient } from "@repo/payment-core";
import type { PaymentRequest } from "@repo/payment-core";
import { useWallet } from "@repo/wallet-core";
import { Button } from "@repo/ui/button";

export default function PaymentsPage() {
  const { address } = useWallet();
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!address) {
      setPayments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await paymentClient.listPayments(address);
      setPayments(data.payments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="fade-up flex flex-col gap-6">
      <div className="page-header mb-0">
        <div>
          <h1 className="page-title uppercase tracking-[-0.02em]">Ledger</h1>
          <p className="page-desc">
            Complete cryptographic payment audit logs.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            id="refresh-payments"
            variant="ghost"
            className="font-mono text-[11px] border border-border"
            onClick={() => void load()}
            disabled={loading}
          >
            {loading ? "SYS_SYNCING..." : "SYNC_LEDGER"}
          </Button>
          <Link
            id="create-payment-link"
            href="/payments/new"
            className="btn btn-primary font-mono text-[11px]"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mr-1"
            >
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
            <div className="skeleton h-[14px] w-[140px] mx-auto mb-2" />
            <div className="skeleton h-[12px] w-[90px] mx-auto" />
          </div>
        ) : payments.length === 0 ? (
          <div className="table-empty">
            <p className="m-0 font-mono text-[13px]">NO_LEDGER_RECORDS_FOUND</p>
            <p className="mt-[6px] text-xs">
              <Link
                href="/payments/new"
                className="text-accent no-underline font-mono"
              >
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
                <tr
                  key={p.id}
                  className="cursor-pointer"
                  onClick={() => {
                    window.location.href = `/payments/${p.id}`;
                  }}
                >
                  <td>
                    <span className="mono-id">{p.id}</span>
                  </td>
                  <td className="text-text-primary font-semibold font-mono">
                    {Number(p.amount).toLocaleString()}
                  </td>
                  <td className="font-mono">{p.currency}</td>
                  <td className="uppercase text-[11px] font-mono text-text-secondary">
                    {p.network}
                  </td>
                  <td className="text-muted max-w-[180px] truncate font-mono text-xs">
                    {p.description ?? (
                      <span className="text-border">NULL_DESC</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge badge-${p.status}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="text-muted font-mono text-xs">
                    {new Date(p.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
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

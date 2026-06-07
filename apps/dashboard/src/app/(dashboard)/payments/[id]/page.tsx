"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { paymentClient, isWatchableStatus } from "@repo/payment-core";
import type { PaymentRequest } from "@repo/payment-core";
import { PaymentDetail } from "../../../../components/payments/payment-detail";

const POLL_INTERVAL_MS = 5_000;

export default function PaymentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [payment, setPayment] = useState<PaymentRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const fetchPayment = useCallback(async () => {
    try {
      const data = await paymentClient.getPayment(id);
      setPayment(data.payment);
      setError(null);

      // Stop polling once the payment reaches a terminal state
      if (!isWatchableStatus(data.payment.status)) {
        stopPolling();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load payment");
      stopPolling();
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchPayment();

    // Start polling; fetchPayment itself stops it when status becomes terminal
    intervalRef.current = setInterval(() => {
      void fetchPayment();
    }, POLL_INTERVAL_MS);

    return () => stopPolling();
  }, [fetchPayment]);

  const isLive = payment ? isWatchableStatus(payment.status) : false;

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col gap-4 fade-up max-w-[640px]">
        <div className="flex items-center gap-3 mb-2">
          <div className="skeleton h-[14px] w-[80px] rounded" />
          <div className="skeleton h-[14px] w-[60px] rounded" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card">
            <div className="skeleton h-[12px] w-[100px] mb-4 rounded" />
            <div className="skeleton h-[40px] w-full rounded" />
          </div>
        ))}
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !payment) {
    return (
      <div className="flex flex-col gap-4 fade-up max-w-[640px]">
        <Link
          href="/payments"
          className="flex items-center gap-1.5 text-xs font-mono text-muted hover:text-text-secondary transition-colors w-fit"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M10 3 5 8l5 5" />
          </svg>
          BACK_TO_LEDGER
        </Link>
        <div className="alert-error">{error ?? "Payment not found."}</div>
      </div>
    );
  }

  // ── Detail view ───────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 max-w-[640px]">
      {/* Page header */}
      <div className="page-header mb-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Link
              href="/payments"
              className="flex items-center gap-1.5 text-xs font-mono text-muted hover:text-text-secondary transition-colors"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M10 3 5 8l5 5" />
              </svg>
              LEDGER
            </Link>
            <span className="text-border font-mono text-xs">/</span>
            <span className="mono-id text-[11px]">{id}</span>
          </div>
          <h1 className="page-title uppercase tracking-[-0.02em] mt-1">
            Payment Detail
          </h1>
        </div>

        <span className={`badge badge-${payment.status}`}>
          {payment.status}
        </span>
      </div>

      {/* Detail cards */}
      <PaymentDetail payment={payment} isLive={isLive} />
    </div>
  );
}

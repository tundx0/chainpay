"use client";

import { use, useEffect, useState } from "react";
import { paymentClient } from "@repo/payment-core";
import type { PaymentRequest, CheckoutData } from "@repo/payment-core";
import { CheckoutCard } from "../../../components/checkout/checkout-card";

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<{
    payment: PaymentRequest;
    checkout: CheckoutData;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    paymentClient
      .getPayment(id)
      .then((r) => {
        if (r.payment && r.checkout) {
          setData({ payment: r.payment, checkout: r.checkout });
        } else {
          setError("Incomplete checkout data returned from API.");
        }
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Payment not found"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="checkout-shell">
      {loading && (
        <div className="checkout-card cyber-glass p-8 flex flex-col items-center justify-center min-h-[300px] max-w-[400px] w-full border border-border/85 rounded-2xl">
          <div className="w-10 h-10 rounded-full border-2 border-accent-border border-t-accent animate-spin mb-4" />
          <span className="text-xs text-text-muted font-bold tracking-wider uppercase">
            Loading Invoice...
          </span>
        </div>
      )}

      {error && (
        <div className="checkout-card cyber-glass p-8 flex flex-col items-center justify-center min-h-[200px] max-w-[400px] w-full border border-danger-dim rounded-2xl text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
          </div>
          <span className="text-sm font-bold text-red-400 mb-2">
            Error Retrieving Invoice
          </span>
          <p className="text-xs text-text-muted max-w-xs">{error}</p>
        </div>
      )}

      {data && <CheckoutCard payment={data.payment} checkout={data.checkout} />}
    </div>
  );
}

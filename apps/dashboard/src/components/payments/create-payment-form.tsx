"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  createPaymentSchema,
  type CreatePaymentSchema,
  CURRENCIES,
  NETWORKS,
  buildCheckoutUrl,
  paymentClient,
} from "@repo/payment-core";

interface CreatePaymentFormProps {
  onSuccess?: (paymentId: string) => void;
}

export function CreatePaymentForm({ onSuccess }: CreatePaymentFormProps) {
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (checkoutUrl) {
      void navigator.clipboard.writeText(checkoutUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePaymentSchema>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: { amount: 50, currency: "USDC", network: "base", description: "" },
  });

  const onSubmit = async (data: CreatePaymentSchema) => {
    setServerError(null);
    try {
      const { id } = await paymentClient.createPayment(data);
      setCheckoutUrl(buildCheckoutUrl(id));
      onSuccess?.(id);
      reset();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="cyber-card" style={{ maxWidth: 480, margin: "0 auto", width: "100%", padding: 32 }}>
      <div className="cyber-grid-overlay" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: 16, marginBottom: 24 }}>
        <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "var(--font-mono, monospace)", color: "var(--text-secondary)", letterSpacing: "0.08em" }}>
          [ GENERATE_INVOICE_PAYLOAD ]
        </span>
        <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>V1.0_CREATE</span>
      </div>

      <form id="create-payment-form" onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative", zIndex: 10 }}>
        {/* Amount */}
        <div className="form-group">
          <label htmlFor="amount" className="form-label" style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 10, letterSpacing: "0.05em", color: "var(--text-muted)", textTransform: "uppercase" }}>
            [ INVOICE_AMOUNT ]
          </label>
          <input
            id="amount"
            type="number"
            step="any"
            className="form-input"
            placeholder="50"
            style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 14 }}
            {...register("amount", { valueAsNumber: true })}
          />
          {errors.amount && <span className="form-error" style={{ fontFamily: "var(--font-mono, monospace)" }}>{errors.amount.message}</span>}
        </div>

        {/* Currency + Network side by side */}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="currency" className="form-label" style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 10, letterSpacing: "0.05em", color: "var(--text-muted)", textTransform: "uppercase" }}>
              [ CURRENCY_ASSET ]
            </label>
            <select id="currency" className="form-select" style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 13 }} {...register("currency")}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.currency && <span className="form-error" style={{ fontFamily: "var(--font-mono, monospace)" }}>{errors.currency.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="network" className="form-label" style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 10, letterSpacing: "0.05em", color: "var(--text-muted)", textTransform: "uppercase" }}>
              [ L2_SETTLE_NETWORK ]
            </label>
            <select id="network" className="form-select" style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 13 }} {...register("network")}>
              {NETWORKS.map((n) => (
                <option key={n} value={n}>{n.toUpperCase()}</option>
              ))}
            </select>
            {errors.network && <span className="form-error" style={{ fontFamily: "var(--font-mono, monospace)" }}>{errors.network.message}</span>}
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description" className="form-label" style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 10, letterSpacing: "0.05em", color: "var(--text-muted)", textTransform: "uppercase" }}>
            [ METADATA_DESCRIPTION ] <span className="form-label-opt">(optional)</span>
          </label>
          <input
            id="description"
            type="text"
            className="form-input"
            placeholder="e.g. Premium Subscription"
            style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 13 }}
            {...register("description")}
          />
          {errors.description && <span className="form-error" style={{ fontFamily: "var(--font-mono, monospace)" }}>{errors.description.message}</span>}
        </div>

        {serverError && <div className="alert-error" style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 12 }}>{serverError}</div>}

        <div style={{ height: 4 }} />

        <button
          id="create-payment-submit"
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
          style={{ justifyContent: "center", fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.05em", fontSize: 12, padding: "10px 16px" }}
        >
          {isSubmitting ? "INITIALIZING..." : "INITIALIZE_INVOICE_LOG"}
        </button>

        {checkoutUrl && (
          <div className="checkout-result" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginTop: 20 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="checkout-result-label" style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 9, letterSpacing: "0.08em" }}>[ INVOICE_CHECKOUT_URL ]</div>
              <div className="checkout-result-url" style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", fontSize: 12 }}>{checkoutUrl}</div>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="btn btn-ghost"
              style={{
                padding: 8,
                height: "auto",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(204, 255, 0, 0.2)",
                background: "rgba(204, 255, 0, 0.05)",
                color: "var(--accent)",
                cursor: "pointer",
                borderRadius: 6,
                transition: "all 0.2s ease",
              }}
            >
              {copied ? (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              ) : (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376A8.965 8.965 0 0 0 12 12.75a8.965 8.965 0 0 0-3.75 4.5m9 0a8.966 8.966 0 0 1-3 2.997m-7.002-12a9 9 0 1 1 18 0v1.125a3 3 0 0 1-3 3H2.25" />
                </svg>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

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
import { CopyButton } from "@repo/ui/copy-button";
import { Button } from "@repo/ui/button";

interface CreatePaymentFormProps {
  onSuccess?: (paymentId: string) => void;
}

export function CreatePaymentForm({ onSuccess }: CreatePaymentFormProps) {
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePaymentSchema>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      amount: 50,
      currency: "USDC",
      network: "base",
      description: "",
    },
  });

  const onSubmit = async (data: CreatePaymentSchema) => {
    setServerError(null);
    try {
      const { id } = await paymentClient.createPayment(data);
      setCheckoutUrl(buildCheckoutUrl(id));
      onSuccess?.(id);
      reset();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    }
  };

  return (
    <div className="cyber-card max-w-[480px] mx-auto w-full p-8">
      <div className="cyber-grid-overlay" />
      <div className="flex justify-between items-center border-b border-border pb-4 mb-6">
        <span className="text-[11px] font-bold font-mono text-text-secondary tracking-[0.08em]">
          [ GENERATE_INVOICE_PAYLOAD ]
        </span>
        <span className="font-mono text-xxs text-muted">V1.0_CREATE</span>
      </div>

      <form
        id="create-payment-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 relative z-10"
      >
        {/* Amount */}
        <div className="form-group">
          <label
            htmlFor="amount"
            className="form-label font-mono text-[10px] tracking-[0.05em] text-muted uppercase"
          >
            [ INVOICE_AMOUNT ]
          </label>
          <input
            id="amount"
            type="number"
            step="any"
            className="form-input font-mono text-sm"
            placeholder="50"
            {...register("amount", { valueAsNumber: true })}
          />
          {errors.amount && (
            <span className="form-error font-mono">
              {errors.amount.message}
            </span>
          )}
        </div>

        {/* Currency + Network side by side */}
        <div className="form-grid">
          <div className="form-group">
            <label
              htmlFor="currency"
              className="form-label font-mono text-[10px] tracking-wider text-muted uppercase"
            >
              [ CURRENCY_ASSET ]
            </label>
            <select
              id="currency"
              className="form-select font-mono text-[13px]"
              {...register("currency")}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.currency && (
              <span className="form-error font-mono">
                {errors.currency.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label
              htmlFor="network"
              className="form-label font-mono text-[10px] tracking-wider text-muted uppercase"
            >
              [ L2_SETTLE_NETWORK ]
            </label>
            <select
              id="network"
              className="form-select font-mono text-[13px]"
              {...register("network")}
            >
              {NETWORKS.map((n) => (
                <option key={n} value={n}>
                  {n.toUpperCase()}
                </option>
              ))}
            </select>
            {errors.network && (
              <span className="form-error font-mono">
                {errors.network.message}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label
            htmlFor="description"
            className="form-label font-mono text-[10px] tracking-wider text-muted uppercase"
          >
            [ METADATA_DESCRIPTION ]{" "}
            <span className="form-label-opt">(optional)</span>
          </label>
          <input
            id="description"
            type="text"
            className="form-input font-mono text-[13px]"
            placeholder="e.g. Premium Subscription"
            {...register("description")}
          />
          {errors.description && (
            <span className="form-error font-mono">
              {errors.description.message}
            </span>
          )}
        </div>

        {serverError && (
          <div className="alert-error font-mono text-xs">{serverError}</div>
        )}

        <div className="h-1" />

        <Button
          id="create-payment-submit"
          type="submit"
          variant="primary"
          className="justify-center font-mono tracking-[0.05em] text-xs py-[10px] px-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? "INITIALIZING..." : "INITIALIZE_INVOICE_LOG"}
        </Button>

        {checkoutUrl && (
          <div className="checkout-result flex items-center justify-between gap-4 mt-5">
            <div className="flex-1 min-w-0">
              <div className="checkout-result-label font-mono text-xxs tracking-[0.08em]">
                [ INVOICE_CHECKOUT_URL ]
              </div>
              <div className="checkout-result-url truncate text-xs">
                {checkoutUrl}
              </div>
            </div>
            <CopyButton
              value={checkoutUrl}
              className="p-2 h-auto shrink-0 flex items-center justify-center border border-accent-border bg-accent-dim text-accent cursor-pointer rounded-[6px] transition-all duration-200 ease-in-out"
            />
          </div>
        )}
      </form>
    </div>
  );
}

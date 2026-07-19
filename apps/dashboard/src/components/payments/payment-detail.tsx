"use client";

import Link from "next/link";
import type { PaymentRequest, Network } from "@repo/payment-core";
import {
  buildExplorerTxUrl,
  buildExplorerAddressUrl,
  getRequiredConfirmations,
} from "@repo/payment-core";
import { CopyButton } from "@repo/ui/copy-button";
import { shortHash, shortAddr, formatDate } from "@repo/shared";
import { MetaRow } from "../ui/meta-row";
import { SectionCard } from "../ui/section-card";
import { ConfirmationProgress } from "./confirmation-progress";
import { RefundButton } from "./refund-button";
import { buildCheckoutUrl } from "@repo/payment-core";

interface PaymentDetailProps {
  payment: PaymentRequest;
  isLive: boolean;
  workflows?: any[];
  webhooks?: any[];
}

export function PaymentDetail({
  payment,
  isLive,
  workflows = [],
  webhooks = [],
}: PaymentDetailProps) {
  const required = getRequiredConfirmations(payment.network as Network);
  const explorerTxUrl = payment.txHash
    ? buildExplorerTxUrl(payment.network as Network, payment.txHash)
    : null;
  const explorerAddrUrl = payment.payerAddress
    ? buildExplorerAddressUrl(payment.network as Network, payment.payerAddress)
    : null;

  return (
    <div className="flex flex-col gap-4 fade-up">
      <ConfirmationProgress
        status={payment.status}
        confirmations={payment.confirmations}
        required={required}
        isLive={isLive}
      />

      <SectionCard title="Settlement">
        <MetaRow label="Amount">
          <span className="font-mono font-bold text-text-primary">
            {Number(payment.amount).toLocaleString()}
          </span>
          <span className="font-mono text-xs text-muted">
            {payment.currency}
          </span>
        </MetaRow>
        <MetaRow label="Network">
          <span className="flex items-center gap-1.5 font-mono text-xs text-text-secondary capitalize">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {payment.network}
          </span>
        </MetaRow>
        {payment.description && (
          <MetaRow label="Description">
            <span className="text-xs text-text-secondary max-w-[220px] text-right">
              {payment.description}
            </span>
          </MetaRow>
        )}
        {payment.merchantAddress && (
          <MetaRow label="Merchant Addr">
            <span className="font-mono text-xs text-text-secondary">
              {shortAddr(payment.merchantAddress)}
            </span>
            <CopyButton
              value={payment.merchantAddress}
              className="p-1 h-auto text-muted hover:text-text-primary rounded border border-border bg-surface-raised cursor-pointer"
            />
          </MetaRow>
        )}
        <MetaRow label="Checkout URL">
          <span className="font-mono text-xs text-text-secondary truncate max-w-[200px]">
            {buildCheckoutUrl(payment.id)}
          </span>
          <CopyButton
            value={buildCheckoutUrl(payment.id)}
            className="p-1 h-auto text-muted hover:text-text-primary rounded border border-border bg-surface-raised cursor-pointer"
          />
        </MetaRow>
        <RefundButton payment={payment} onRefunded={() => window.location.reload()} />
      </SectionCard>

      <SectionCard title="Transaction">
        {payment.txHash ? (
          <>
            <MetaRow label="Tx Hash">
              <span className="font-mono text-xs text-text-secondary">
                {shortHash(payment.txHash)}
              </span>
              <CopyButton
                value={payment.txHash}
                className="p-1 h-auto text-muted hover:text-text-primary rounded border border-border bg-surface-raised cursor-pointer"
              />
              {explorerTxUrl && (
                <Link
                  href={explorerTxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded border border-border bg-surface-raised text-muted hover:text-accent transition-colors"
                  title="View on explorer"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 2H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4" />
                    <path d="M9 1h6v6" />
                    <path d="M15 1 7 9" />
                  </svg>
                </Link>
              )}
            </MetaRow>

            {payment.payerAddress && (
              <MetaRow label="Payer Addr">
                <span className="font-mono text-xs text-text-secondary">
                  {shortAddr(payment.payerAddress)}
                </span>
                <CopyButton
                  value={payment.payerAddress}
                  className="p-1 h-auto text-muted hover:text-text-primary rounded border border-border bg-surface-raised cursor-pointer"
                />
                {explorerAddrUrl && (
                  <Link
                    href={explorerAddrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded border border-border bg-surface-raised text-muted hover:text-accent transition-colors"
                    title="View address on explorer"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 2H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4" />
                      <path d="M9 1h6v6" />
                      <path d="M15 1 7 9" />
                    </svg>
                  </Link>
                )}
              </MetaRow>
            )}

            {payment.blockNumber && (
              <MetaRow label="Block">
                <span className="font-mono text-xs text-text-secondary">
                  {payment.blockNumber}
                </span>
              </MetaRow>
            )}
          </>
        ) : (
          <p className="text-xs font-mono text-muted py-2">
            NO_TX_HASH — payment not yet detected on-chain.
          </p>
        )}
      </SectionCard>

      <SectionCard title="Timeline">
        <MetaRow label="Created">
          <span className="font-mono text-xs text-text-secondary">
            {formatDate(payment.createdAt)}
          </span>
        </MetaRow>
        <MetaRow label="Confirmed">
          <span
            className="font-mono text-xs"
            style={{
              color: payment.confirmedAt
                ? "var(--accent)"
                : "var(--text-muted)",
            }}
          >
            {formatDate(payment.confirmedAt)}
          </span>
        </MetaRow>
      </SectionCard>

      {/* Durable Workflows observability */}
      <SectionCard title="Durable Workflow Trace">
        {workflows.length === 0 ? (
          <p className="text-xs font-mono text-muted py-1">
            NO_WORKFLOW_TRACES_YET — workflow initialization pending.
          </p>
        ) : (
          <div className="flex flex-col gap-3.5 my-1">
            {workflows.map((wf) => (
              <div key={wf.id} className="flex flex-col gap-1 border-b border-border/40 pb-2 last:border-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xxs font-bold text-accent uppercase tracking-wider">
                    {wf.state.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] text-muted font-mono">
                    {formatDate(wf.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed m-0 font-sans">
                  {wf.stepLog}
                </p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Webhook Delivery observability */}
      <SectionCard title="Webhook Deliveries">
        {webhooks.length === 0 ? (
          <p className="text-xs font-mono text-muted py-1">
            NO_WEBHOOKS_DISPATCHED — payment not yet completed or no webhook registered.
          </p>
        ) : (
          <div className="flex flex-col gap-4 my-1">
            {webhooks.map((wh) => (
              <div key={wh.id} className="flex flex-col gap-2 border-b border-border/40 pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-semibold text-text-primary">
                    Attempt #{wh.attemptNumber}
                  </span>
                  <span className={`badge text-[10px] py-0.5 px-2 font-mono uppercase font-bold rounded ${wh.status === "success" ? "bg-accent-dim text-accent-hover border border-accent/20" : "bg-warning/10 text-warning border border-warning/20"}`}>
                    {wh.status}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 font-mono text-[11px] text-text-secondary">
                  <div className="flex justify-between">
                    <span className="text-muted">URL:</span>
                    <span className="text-right break-all max-w-[280px]">{wh.url}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Status:</span>
                    <span>{wh.statusCode ?? "CONNECTION_TIMEOUT"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Time:</span>
                    <span>{formatDate(wh.createdAt)}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 mt-1">
                  <span className="font-mono text-[10px] text-muted">[ RESPONSE_BODY ]</span>
                  <pre className="bg-[#0e0e11] text-text-secondary border border-border p-2 rounded text-[10px] font-mono whitespace-pre-wrap break-all max-h-[80px] overflow-y-auto">
                    {wh.responseBody || "Empty Response"}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

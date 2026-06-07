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

interface PaymentDetailProps {
  payment: PaymentRequest;
  isLive: boolean;
}

export function PaymentDetail({ payment, isLive }: PaymentDetailProps) {
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
    </div>
  );
}

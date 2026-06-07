"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useWallet } from "@repo/wallet-core";
import { Button } from "@repo/ui/button";
import { shortAddr } from "@repo/shared";

const CRUMBS: Record<
  string,
  { label: string; parent?: { label: string; href: string } }
> = {
  "/": { label: "Overview" },
  "/payments": { label: "Payments" },
  "/payments/new": {
    label: "New",
    parent: { label: "Payments", href: "/payments" },
  },
};

function shortId(id: string) {
  // Show first 8 chars if it looks like a UUID, otherwise show whole id
  return id.length > 16 ? `${id.slice(0, 8)}…` : id;
}

export function Topbar() {
  const path = usePathname();
  const { address, disconnect } = useWallet();

  // dynamic /pay/[id] crumb (checkout)
  const isPay = path.startsWith("/pay/");
  // dynamic /payments/[id] crumb (merchant detail)
  const isPaymentDetail =
    path.startsWith("/payments/") && path !== "/payments/new";

  const rawId = isPay
    ? (path.split("/pay/")[1] ?? null)
    : isPaymentDetail
      ? (path.split("/payments/")[1] ?? null)
      : null;

  const crumb = CRUMBS[path];

  return (
    <header className="app-topbar cyber-glass border-b border-border relative z-50">
      <nav className="breadcrumb">
        {isPay ? (
          <>
            <span className="breadcrumb-item">Checkout</span>
            <span className="breadcrumb-sep text-accent">/</span>
            <span className="breadcrumb-current mono-id">{rawId}</span>
          </>
        ) : isPaymentDetail ? (
          <>
            <Link href="/payments" className="breadcrumb-item">
              Payments
            </Link>
            <span className="breadcrumb-sep text-accent">/</span>
            <span className="breadcrumb-current mono-id">
              {rawId ? shortId(rawId) : "Detail"}
            </span>
          </>
        ) : crumb?.parent ? (
          <>
            <Link href={crumb.parent.href} className="breadcrumb-item">
              {crumb.parent.label}
            </Link>
            <span className="breadcrumb-sep text-accent">/</span>
            <span className="breadcrumb-current">{crumb.label}</span>
          </>
        ) : (
          <span className="breadcrumb-current">
            {crumb?.label ?? "Dashboard"}
          </span>
        )}
      </nav>

      <div className="flex items-center gap-4">
        {address && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-text-secondary bg-surface border border-border rounded-[6px] py-[4px] px-[8px]">
              {shortAddr(address)}
            </span>
            <Button
              onClick={() => void disconnect()}
              variant="danger"
              className="font-mono text-[11px] py-[4px] px-[8px] h-auto cursor-pointer"
            >
              LOG_OUT
            </Button>
          </div>
        )}

        <span className="text-[11px] font-semibold text-accent bg-accent-dim border border-accent-border rounded-[6px] py-[4px] px-[10px] tracking-[0.05em] font-mono flex items-center gap-[6px]">
          <span className="cyber-pulse-dot" />
          API_ACTIVE
        </span>
      </div>
    </header>
  );
}

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useWallet } from "@repo/wallet-core";
import { Button } from "@repo/ui/button";

const CRUMBS: Record<string, { label: string; parent?: { label: string; href: string } }> = {
  "/": { label: "Overview" },
  "/payments": { label: "Payments" },
  "/payments/new": { label: "New", parent: { label: "Payments", href: "/payments" } },
};

export function Topbar() {
  const path = usePathname();
  const { address, disconnect } = useWallet();

  // dynamic /pay/[id] crumb
  const isPay = path.startsWith("/pay/");
  const id = isPay ? path.split("/pay/")[1] : null;

  const crumb = CRUMBS[path];

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <header className="app-topbar cyber-glass border-b border-border relative z-50">
      <nav className="breadcrumb">
        {isPay ? (
          <>
            <span className="breadcrumb-item">Checkout</span>
            <span className="breadcrumb-sep text-accent">/</span>
            <span className="breadcrumb-current mono-id">{id}</span>
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
          <span className="breadcrumb-current">{crumb?.label ?? "Dashboard"}</span>
        )}
      </nav>

      <div className="flex items-center gap-4">
        {address && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-text-secondary bg-surface border border-border rounded-[6px] py-[4px] px-[8px]">
              {formatAddress(address)}
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

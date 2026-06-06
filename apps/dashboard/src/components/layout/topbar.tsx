"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useWallet } from "@repo/wallet-core";

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
    <header className="app-topbar cyber-glass" style={{ borderBottom: "1px solid var(--border)", position: "relative", zIndex: 50 }}>
      <nav className="breadcrumb">
        {isPay ? (
          <>
            <span className="breadcrumb-item">Checkout</span>
            <span className="breadcrumb-sep" style={{ color: "var(--accent)" }}>/</span>
            <span className="breadcrumb-current mono-id">{id}</span>
          </>
        ) : crumb?.parent ? (
          <>
            <Link href={crumb.parent.href} className="breadcrumb-item">
              {crumb.parent.label}
            </Link>
            <span className="breadcrumb-sep" style={{ color: "var(--accent)" }}>/</span>
            <span className="breadcrumb-current">{crumb.label}</span>
          </>
        ) : (
          <span className="breadcrumb-current">{crumb?.label ?? "Dashboard"}</span>
        )}
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {address && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: 11,
                color: "var(--text-secondary)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: "4px 8px",
              }}
            >
              {formatAddress(address)}
            </span>
            <button
              onClick={() => void disconnect()}
              className="btn btn-ghost"
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: 11,
                padding: "4px 8px",
                height: "auto",
                borderColor: "rgba(239, 68, 68, 0.2)",
                color: "var(--danger)",
                background: "rgba(239, 68, 68, 0.05)",
                cursor: "pointer",
              }}
            >
              LOG_OUT
            </button>
          </div>
        )}

        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--accent)",
            background: "var(--accent-dim)",
            border: "1px solid var(--accent-border)",
            borderRadius: 6,
            padding: "4px 10px",
            letterSpacing: "0.05em",
            fontFamily: "var(--font-mono, monospace)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span className="cyber-pulse-dot" />
          API_ACTIVE
        </span>
      </div>
    </header>
  );
}

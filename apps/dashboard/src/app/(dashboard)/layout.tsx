"use client";

import { useWallet } from "@repo/wallet-core";
import { Sidebar } from "../../components/layout/sidebar";
import { Topbar } from "../../components/layout/topbar";
import { ConnectWallet } from "../../components/wallet/connect-wallet";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { connected } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          color: "var(--text-secondary)",
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            border: "2px solid var(--accent)",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 0.6s linear infinite",
          }}
        />
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  if (!connected) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          background: "#000000",
          color: "var(--text-primary)",
          position: "relative",
          overflow: "hidden",
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        {/* Cyber grid backdrop */}
        <div className="cyber-grid-overlay" />

        {/* Ambient neon backdrop glows */}
        <div
          style={{
            position: "absolute",
            top: "-15%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            height: "500px",
            background: "radial-gradient(circle, rgba(204, 255, 0, 0.05) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Header navigation bar */}
        <header
          className="cyber-glass"
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            borderBottom: "1px solid var(--border)",
            padding: "16px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontWeight: 800, fontSize: 18, letterSpacing: "-0.03em" }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000000",
                fontWeight: 900,
                fontSize: 13,
                boxShadow: "0 0 10px rgba(204, 255, 0, 0.3)",
              }}
            >
              CP
            </div>
            <span>
              CHAIN<span style={{ color: "var(--accent)", fontWeight: 500 }}>PAY</span>
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)" }}>
              <span className="cyber-pulse-dot" />
              <span style={{ fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.05em", color: "var(--accent)" }}>SYS_ONLINE</span>
            </div>
            <div style={{ height: 12, width: 1, background: "var(--border)" }} />
            <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>V1.0.0_BETA</span>
          </div>
        </header>

        {/* Main Split Layout container */}
        <main
          style={{
            position: "relative",
            zIndex: 10,
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr",
            maxWidth: 1280,
            margin: "0 auto",
            width: "100%",
            padding: "40px 40px 80px",
            alignItems: "center",
            gap: 64,
          }}
          className="lg:grid-cols-2"
        >
          {/* Left Panel: Telemetry & Value Proposition */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  alignSelf: "flex-start",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 10px",
                  borderRadius: 4,
                  background: "rgba(204, 255, 0, 0.05)",
                  border: "1px solid rgba(204, 255, 0, 0.15)",
                  fontSize: 10,
                  fontFamily: "var(--font-mono, monospace)",
                  fontWeight: 600,
                  color: "var(--accent)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                [ MERCHANT_PORTAL_GATEWAY ]
              </div>
              <h1
                style={{
                  fontSize: "clamp(36px, 4.5vw, 54px)",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                Settle payments <span style={{ color: "var(--accent)" }}>instantly</span>. Settle on-chain.
              </h1>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "var(--text-secondary)",
                  margin: 0,
                  maxWidth: 520,
                }}
              >
                A high-performance crypto payment rail designed for modern businesses. Issue checkouts, request deposits, and track settlement volume on Base and Ethereum.
              </p>
            </div>

            {/* Feature Ledger block */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                background: "rgba(10,10,12,0.4)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "20px 24px",
                fontFamily: "var(--font-mono, monospace)",
                fontSize: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8, color: "var(--text-muted)" }}>
                <span>FEATURE_INDEX</span>
                <span>STATE_STATUS</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span style={{ color: "var(--text-primary)" }}>01 // NON-CUSTODIAL ESCROW</span>
                <span style={{ color: "var(--accent)" }}>SECURE</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span style={{ color: "var(--text-primary)" }}>02 // BASE L2 LOW-FEE RAIL</span>
                <span style={{ color: "var(--accent)" }}>ENABLED</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span style={{ color: "var(--text-primary)" }}>03 // FULL INVOICE LEDGER</span>
                <span style={{ color: "var(--accent)" }}>ONLINE</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Gated Wallet Widget */}
          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <div
              style={{
                width: "100%",
                maxWidth: 440,
                padding: 4,
                borderRadius: 24,
                background: "linear-gradient(135deg, rgba(204, 255, 0, 0.1) 0%, transparent 100%)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
              }}
            >
              <ConnectWallet />
            </div>
          </div>
        </main>

        <footer
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: "20px 40px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            fontFamily: "var(--font-mono, monospace)",
            color: "var(--text-muted)",
          }}
        >
          <span>CHAINPAY_SYSTEMS &copy; {new Date().getFullYear()}</span>
          <span>STABLE_VERSION_RELEASE_APPROVED</span>
        </footer>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Topbar />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}


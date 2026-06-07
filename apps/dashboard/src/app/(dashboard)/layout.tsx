"use client";

import { useWallet } from "@repo/wallet-core";
import { Sidebar } from "../../components/layout/sidebar";
import { Topbar } from "../../components/layout/topbar";
import { ConnectWallet } from "../../components/wallet/connect-wallet";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { connected } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-text-secondary">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-[spin_0.6s_linear_infinite]" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `,
          }}
        />
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-text-primary relative overflow-hidden font-inter">
        {/* Cyber grid backdrop */}
        <div className="cyber-grid-overlay" />

        {/* Ambient neon backdrop glows */}
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-[radial-gradient(circle,rgba(204,255,0,0.05)_0%,transparent_70%)] pointer-events-none z-[1]" />

        {/* Header navigation bar */}
        <header className="cyber-glass relative z-10 w-full border-b border-border py-4 px-10 flex items-center justify-between">
          <div className="flex items-center gap-3 font-extrabold text-lg tracking-[-0.03em]">
            <div className="w-7 h-7 rounded-[6px] bg-accent flex items-center justify-center text-black font-[900] text-[13px] shadow-[0_0_10px_rgba(204, 255, 0, 0.3)]">
              CP
            </div>
            <span>
              CHAIN<span className="text-accent font-medium">PAY</span>
            </span>
          </div>

          <div className="flex items-center gap-5 text-xs">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <span className="cyber-pulse-dot" />
              <span className="font-mono tracking-[0.05em] text-accent">
                SYS_ONLINE
              </span>
            </div>
            <div className="h-3 w-[1px] bg-border" />
            <span className="text-muted font-mono">V1.0.0_BETA</span>
          </div>
        </header>

        {/* Main Split Layout container */}
        <main className="lg:grid-cols-2 relative z-10 flex-1 grid grid-cols-1 max-w-[1280px] mx-auto w-full pt-10 px-10 pb-20 items-center gap-16">
          {/* Left Panel: Telemetry & Value Proposition */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="self-start inline-flex items-center gap-2 py-[4px] px-[10px] rounded-[4px] bg-accent-dim border border-accent-border text-[10px] font-mono font-semibold text-accent tracking-[0.08em] uppercase">
                [ MERCHANT_PORTAL_GATEWAY ]
              </div>
              <h1 className="text-[clamp(36px,4.5vw,54px)] font-[900] tracking-[-0.04em] leading-[1.05] m-0 uppercase">
                Settle payments <span className="text-accent">instantly</span>.
                Settle on-chain.
              </h1>
              <p className="text-[15px] leading-1.6 text-text-secondary m-0 max-w-[520px]">
                A high-performance crypto payment rail designed for modern
                businesses. Issue checkouts, request deposits, and track
                settlement volume on Base and Ethereum.
              </p>
            </div>

            {/* Feature Ledger block */}
            <div className="flex flex-col gap-3 bg-zinc-950/40 border border-border rounded-lg py-5 px-6 font-mono text-xs">
              <div className="flex justify-between border-b border-border pb-2 text-muted">
                <span>FEATURE_INDEX</span>
                <span>STATE_STATUS</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-primary">
                  01 // NON-CUSTODIAL ESCROW
                </span>
                <span className="text-accent">SECURE</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-primary">
                  02 // BASE L2 LOW-FEE RAIL
                </span>
                <span className="text-accent">ENABLED</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-primary">
                  03 // FULL INVOICE LEDGER
                </span>
                <span className="text-accent">ONLINE</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Gated Wallet Widget */}
          <div className="flex justify-center w-full">
            <div className="w-full max-w-[440px] p-1 rounded-[24px] bg-[linear-gradient(135deg,rgba(204,255,0,0.1)_0%,transparent_100%)] shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
              <ConnectWallet />
            </div>
          </div>
        </main>

        <footer className="relative z-10 w-full max-w-[1280px] mx-auto py-5 px-10 border-t border-border flex justify-between text-[10px] font-mono text-muted">
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

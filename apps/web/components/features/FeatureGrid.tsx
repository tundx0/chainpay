"use client";

import React from "react";

export default function FeatureGrid() {
  return (
    <section className="animate-fade-in-up flex flex-col gap-12">
      <div className="text-center flex flex-col gap-3">
        <span className="font-mono text-[10px] text-accent font-bold tracking-widest uppercase">
          [ CORE_CAPABILITIES ]
        </span>
        <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Designed for modern high-scale Web3 apps
        </h2>
        <p className="text-text-secondary text-[14px] max-w-xl mx-auto leading-relaxed">
          A developer-centric stack built for speed, direct wallet delivery, and telemetry transparency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* FEATURE 1 */}
        <div className="cyber-card flex flex-col gap-4 border-border/80 bg-black/40">
          <div className="cyber-grid-overlay opacity-30" />
          <div className="relative z-10 h-10 w-10 rounded-xl bg-accent-dim border border-accent-border flex items-center justify-center text-accent shadow-inner">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h4 className="relative z-10 text-[15px] font-extrabold text-text-primary tracking-tight">Instant Settlement</h4>
          <p className="relative z-10 text-xs text-text-secondary leading-relaxed">
            Payments settle directly into your merchant wallet address. Zero platform intermediary holds, zero withdrawal fees. 
          </p>
        </div>

        {/* FEATURE 2 */}
        <div className="cyber-card flex flex-col gap-4 border-border/80 bg-black/40">
          <div className="cyber-grid-overlay opacity-30" />
          <div className="relative z-10 h-10 w-10 rounded-xl bg-accent-dim border border-accent-border flex items-center justify-center text-accent shadow-inner">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h4 className="relative z-10 text-[15px] font-extrabold text-text-primary tracking-tight">Automatic Verification</h4>
          <p className="relative z-10 text-xs text-text-secondary leading-relaxed">
            Our lightweight background node watcher monitors block RPCs, verifying payments autonomously and immediately.
          </p>
        </div>

        {/* FEATURE 3 */}
        <div className="cyber-card flex flex-col gap-4 border-border/80 bg-black/40">
          <div className="cyber-grid-overlay opacity-30" />
          <div className="relative z-10 h-10 w-10 rounded-xl bg-accent-dim border border-accent-border flex items-center justify-center text-accent shadow-inner">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="relative z-10 text-[15px] font-extrabold text-text-primary tracking-tight">USD Analytics Tracking</h4>
          <p className="relative z-10 text-xs text-text-secondary leading-relaxed">
            Persist historical pricing metadata on compilation endpoints to monitor transaction growth and telemetry.
          </p>
        </div>

      </div>
    </section>
  );
}

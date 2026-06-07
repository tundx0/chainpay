"use client";

import React from "react";
import FlowVisualizer from "./FlowVisualizer";

export default function Hero() {
  return (
    <section className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-5 gap-12 items-center pt-8">
      {/* Hero Left Content */}
      <div className="lg:col-span-3 flex flex-col gap-6 text-left max-w-2xl">
        <div className="flex w-fit items-center gap-2 px-3.5 py-1.5 bg-surface border border-border rounded-full font-mono text-[10px] text-text-muted tracking-widest uppercase shadow-inner">
          <span className="cyber-pulse-dot" />
          <span className="text-text-secondary font-bold">LIVE_WEB3_INFRASTRUCTURE</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-text-primary">
          The Developer-First <br />
          <span className="bg-gradient-to-r from-accent to-[#DFFF00] bg-clip-text text-transparent">
            Web3 Payment Gateway
          </span>
        </h1>
        
        <p className="text-[14.5px] md:text-[15.5px] text-text-secondary leading-relaxed font-normal">
          Integrate high-speed payment processor checkout, live telemetry
          monitoring, and automated on-chain settlement validation for EVM
          blockchains. Direct to wallet, non-custodial, zero fees.
        </p>

        <div className="flex gap-4 mt-2">
          <a 
            href={process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://localhost:3000"} 
            className="px-6 py-3 bg-accent text-black text-[13.5px] font-extrabold rounded-xl hover-glow-accent"
          >
            Get Started Free &rarr;
          </a>
          <a 
            href={process.env.NEXT_PUBLIC_DOCS_URL ?? "http://localhost:3001"} 
            className="px-6 py-3 border border-border bg-surface-raised/40 text-text-primary text-[13.5px] font-semibold rounded-xl hover:bg-surface hover-scale-subtle"
          >
            Read Docs
          </a>
        </div>
      </div>

      {/* Hero Right Visualizer */}
      <div className="lg:col-span-2 flex justify-center items-center lg:justify-end animate-float">
        <FlowVisualizer />
      </div>
    </section>
  );
}

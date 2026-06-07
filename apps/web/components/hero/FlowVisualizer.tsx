"use client";

import React, { useEffect, useState } from "react";

type FlowStep = "idle" | "sending" | "verifying" | "settling" | "settled";

export default function FlowVisualizer() {
  const [step, setStep] = useState<FlowStep>("idle");
  const [merchantBalance, setMerchantBalance] = useState<number>(142.500);

  useEffect(() => {
    const sequence = [
      { next: "sending" as const, delay: 1500 },
      { next: "verifying" as const, delay: 1800 },
      { next: "settling" as const, delay: 1500 },
      { next: "settled" as const, delay: 1000 },
      { next: "idle" as const, delay: 2500 },
    ];

    let current = 0;
    let timer: NodeJS.Timeout;

    const run = () => {
      timer = setTimeout(() => {
        const item = sequence[current];
        if (!item) return;

        setStep(item.next);

        if (item.next === "settled") {
          setMerchantBalance((prev) => prev + 1.5);
        }

        current = (current + 1) % sequence.length;
        run();
      }, sequence[current]?.delay ?? 2000);
    };

    run();

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="cyber-card w-full max-w-[500px] border-[#1f1f23]/80 p-8 flex flex-col gap-8 relative overflow-hidden bg-black/50 select-none">
      <div className="cyber-grid-overlay opacity-30" />
      
      {/* Title Header */}
      <div className="relative z-10 flex justify-between items-center border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
          <span className="font-mono text-[9px] font-bold text-text-secondary tracking-widest uppercase">
            On-Chain Telemetry Visualizer
          </span>
        </div>
        <span className="font-mono text-[9px] text-text-muted">
          STATUS: {step.toUpperCase()}
        </span>
      </div>

      {/* Nodes Container */}
      <div className="relative z-10 flex justify-between items-center min-h-[160px] relative px-2">
        
        {/* Connection SVGs */}
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center">
          <svg className="w-full h-10 px-10" viewBox="0 0 320 40" fill="none">
            {/* Left to Middle Line */}
            <path 
              d="M 10 20 L 145 20" 
              stroke="#1f1f23" 
              strokeWidth="2.5" 
              strokeDasharray="4 4" 
            />
            {step === "sending" && (
              <circle r="4" fill="#CCFF00" className="shadow-[0_0_8px_#CCFF00]">
                <animateMotion 
                  path="M 10 20 L 145 20" 
                  dur="1.5s" 
                  repeatCount="1" 
                  fill="freeze"
                />
              </circle>
            )}

            {/* Middle to Right Line */}
            <path 
              d="M 175 20 L 310 20" 
              stroke="#1f1f23" 
              strokeWidth="2.5" 
              strokeDasharray="4 4" 
            />
            {step === "settling" && (
              <circle r="4" fill="#CCFF00" className="shadow-[0_0_8px_#CCFF00]">
                <animateMotion 
                  path="M 175 20 L 310 20" 
                  dur="1.5s" 
                  repeatCount="1" 
                  fill="freeze"
                />
              </circle>
            )}
          </svg>
        </div>

        {/* CUSTOMER WALLET NODE */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className={`h-14 w-14 rounded-2xl border bg-black/80 flex items-center justify-center transition-all duration-300 ${
            step === "sending" ? "border-accent shadow-[0_0_15px_rgba(204,255,0,0.15)] scale-105" : "border-border"
          }`}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={step === "sending" ? "text-accent" : "text-text-muted"}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <span className="font-mono text-[9px] text-text-secondary tracking-wider">PAYER_ADDR</span>
        </div>

        {/* WATCHER CONSOLE NODE */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="relative h-20 w-20 flex items-center justify-center">
            {/* Spinning decorative ring */}
            <div className={`absolute inset-0 rounded-full border border-dashed transition-all duration-700 ${
              step === "verifying" ? "border-yellow-400 rotate-180 animate-spin" : "border-border/60 animate-spin-slow"
            }`} />
            
            {/* Inner Glowing Orb */}
            <div className={`h-14 w-14 rounded-full border bg-black flex flex-col items-center justify-center transition-all duration-300 ${
              step === "verifying" 
                ? "border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.2)] bg-yellow-950/10" 
                : step === "settling" || step === "settled"
                  ? "border-accent shadow-[0_0_20px_rgba(204,255,0,0.2)] bg-accent-dim/10"
                  : "border-border"
            }`}>
              {step === "verifying" ? (
                <span className="font-mono text-[8px] font-bold text-yellow-400 animate-pulse">[CHECK]</span>
              ) : step === "settled" ? (
                <span className="font-mono text-[8px] font-bold text-accent">[OK]</span>
              ) : (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-text-muted">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              )}
            </div>
          </div>
          <span className="font-mono text-[9px] text-text-secondary tracking-wider">WATCHER_NODE</span>
        </div>

        {/* MERCHANT WALLET NODE */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="relative">
            {step === "settled" && (
              <div className="absolute -inset-2 rounded-2xl bg-accent-dim/30 animate-ping-success pointer-events-none" />
            )}
            <div className={`h-14 w-14 rounded-2xl border bg-black/80 flex items-center justify-center transition-all duration-300 ${
              step === "settled" ? "border-accent shadow-[0_0_20px_rgba(204,255,0,0.3)] bg-accent-dim/20 scale-105" : "border-border"
            }`}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={step === "settled" ? "text-accent" : "text-text-muted"}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <span className="font-mono text-[9px] text-text-secondary tracking-wider">MERCHANT_SECURE</span>
        </div>

      </div>

      {/* Telemetry Output Details */}
      <div className="relative z-10 bg-black/40 border border-border p-4 rounded-xl flex flex-col gap-3 font-mono text-[11px] text-text-secondary">
        <div className="flex justify-between items-center">
          <span>TX_PAYLOAD_VALUE:</span>
          <span className="text-text-primary font-bold">1.500 ETH</span>
        </div>
        <div className="flex justify-between items-center">
          <span>MERCHANT_BALANCE:</span>
          <span className={`font-bold transition-all duration-300 ${step === "settled" ? "text-accent scale-105" : "text-text-primary"}`}>
            {merchantBalance.toFixed(3)} ETH
          </span>
        </div>
        <div className="flex justify-between items-center border-t border-border/50 pt-2.5">
          <span>VERIFICATION_RESULT:</span>
          {step === "verifying" ? (
            <span className="text-yellow-400 font-bold animate-pulse">[ FETCHING_BLOCK_RPC ]</span>
          ) : step === "settling" || step === "settled" ? (
            <span className="text-accent font-bold">[ CONFIRMED_HASH_SUCCESS ]</span>
          ) : (
            <span className="text-text-muted">[ STANDBY_AWAITING_PAYMENT ]</span>
          )}
        </div>
      </div>
    </div>
  );
}

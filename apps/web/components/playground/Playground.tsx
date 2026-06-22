"use client";

import React, { useState } from "react";
import { CopyButton } from "@repo/ui/copy-button";

type ChainPayWidget = {
  open: (opts: {
    paymentId: string;
    checkoutUrl: string;
    onSuccess: (data: unknown) => void;
    onClose: () => void;
  }) => void;
};

type ChainPayWindow = Window & { ChainPay?: ChainPayWidget };

export default function Playground() {
  const [activeTab, setActiveTab] = useState<"react" | "node" | "curl">("react");
  
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://localhost:3000";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

  const codeSnippets = {
    react: `import { CheckoutCard } from "@repo/ui";

function App() {
  return (
    <CheckoutCard 
      amount="1.5"
      currency="ETH"
      merchant="0x7099...79C8"
      onComplete={(tx) => console.log("Paid:", tx)}
    />
  );
}`,
    node: `import { CheckoutService } from "@repo/payment-core";

const checkout = new CheckoutService();
const session = await checkout.createSession({
  amount: "1.5",
  currency: "ETH",
  description: "Invoice #1042"
});

console.log("Pay URL:", session.checkoutUrl);`,
    curl: `curl -X POST ${apiUrl}/payments \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": "1.5",
    "currency": "ETH",
    "description": "Invoice #1042"
  }'`,
  };

  return (
    <section className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
      <div className="lg:col-span-2 flex flex-col gap-5 text-left">
        <div className="font-mono text-[10px] text-accent font-bold tracking-widest uppercase">
          [ EASY_INTEGRATION ]
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-text-primary leading-tight">
          Ready to deploy in <br />
          under 5 lines of code
        </h2>
        <p className="text-text-secondary text-[14px] leading-relaxed">
          We provide clean React components, backend Node libraries, and raw API wrappers to fit any stack. Connect your database, seed merchant addresses, and start receiving secure payments directly into your self-custody wallet.
        </p>
        <div className="flex gap-4 items-center mt-1">
          <button
            onClick={() => {
              const SCRIPT_URL = `${dashboardUrl}/widget.js`;
              const openWidget = () => {
                (window as ChainPayWindow).ChainPay?.open({
                  paymentId: "pay_demo",
                  checkoutUrl: dashboardUrl,
                  onSuccess: (data) => console.log("Demo paid:", data),
                  onClose: () => console.log("Demo closed"),
                });
              };
              if (!(window as ChainPayWindow).ChainPay) {
                const script = document.createElement("script");
                script.src = SCRIPT_URL;
                script.onload = openWidget;
                document.body.appendChild(script);
              } else {
                openWidget();
              }
            }}
            className="bg-accent text-bg hover:bg-accent-hover transition-colors font-bold font-mono text-[11px] uppercase tracking-wider py-2.5 px-4 rounded-xl cursor-pointer flex items-center gap-1.5 border border-transparent shadow-[0_0_15px_rgba(204,255,0,0.1)]"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Launch Demo Widget
          </button>
        </div>
        <div className="flex flex-col gap-2.5 mt-4">
          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>Zero configuration required</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>Sub-second block detection latency</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>Automated Drizzle/Postgres integration</span>
          </div>
        </div>
      </div>

      {/* IDE Layout Panel */}
      <div className="lg:col-span-3 cyber-card p-0 overflow-hidden flex flex-col border-border/80 bg-black/60">
        <div className="bg-[#121214] border-b border-border px-4 py-3.5 flex justify-between items-center">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-border" />
            <div className="h-2.5 w-2.5 rounded-full bg-border" />
            <div className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab("react")}
              className={`font-mono text-[10.5px] px-2.5 py-1 rounded transition-all duration-200 ${activeTab === "react" ? "bg-accent-dim text-accent border border-accent-border" : "text-text-muted hover:text-text-secondary"}`}
            >
              React SDK
            </button>
            <button 
              onClick={() => setActiveTab("node")}
              className={`font-mono text-[10.5px] px-2.5 py-1 rounded transition-all duration-200 ${activeTab === "node" ? "bg-accent-dim text-accent border border-accent-border" : "text-text-muted hover:text-text-secondary"}`}
            >
              Node.js API
            </button>
            <button 
              onClick={() => setActiveTab("curl")}
              className={`font-mono text-[10.5px] px-2.5 py-1 rounded transition-all duration-200 ${activeTab === "curl" ? "bg-accent-dim text-accent border border-accent-border" : "text-text-muted hover:text-text-secondary"}`}
            >
              cURL
            </button>
          </div>
        </div>

        {/* Code editor view */}
        <div className="p-5 font-mono text-[12.5px] leading-relaxed text-text-secondary overflow-x-auto bg-[#040405] relative min-h-[220px]">
          <div className="absolute right-4 top-4">
            <CopyButton 
              value={codeSnippets[activeTab]} 
              className="!border-border hover:!border-accent hover:!text-accent !bg-[#0a0a0c]/80 flex items-center justify-center p-2 rounded-md transition-colors"
            />
          </div>

          <pre className="text-left select-all animate-code-fade">
            {/* eslint-disable react/no-unescaped-entities */}
            {activeTab === "react" && (
              <code>
                <span className="text-text-muted">import</span> {"{"} CheckoutCard {"}"} <span className="text-text-muted">from</span> <span className="text-[#CCFF00]">"@repo/ui"</span>;<br /><br />
                <span className="text-text-muted">function</span> <span className="text-text-primary">App</span>() {"{"}<br />
                {"  "}<span className="text-text-muted">return</span> (<br />
                {"    "}&lt;<span className="text-text-primary font-bold">CheckoutCard</span> <br />
                {"      "}amount=<span className="text-[#CCFF00]">"1.5"</span><br />
                {"      "}currency=<span className="text-[#CCFF00]">"ETH"</span><br />
                {"      "}merchant=<span className="text-[#CCFF00]">"0x7099...79C8"</span><br />
                {"      "}onComplete={"{"}(tx) =&gt; console.log(<span className="text-[#CCFF00]">"Paid:"</span>, tx){"}"}<br />
                {"    "}/&gt;<br />
                {"  "});<br />
                {"}"}
              </code>
            )}

            {activeTab === "node" && (
              <code>
                <span className="text-text-muted">import</span> {"{"} CheckoutService {"}"} <span className="text-text-muted">from</span> <span className="text-[#CCFF00]">"@repo/payment-core"</span>;<br /><br />
                <span className="text-text-muted">const</span> checkout = <span className="text-text-muted">new</span> <span className="text-text-primary font-bold">CheckoutService</span>();<br />
                <span className="text-text-muted">const</span> session = <span className="text-text-muted">await</span> checkout.createSession({"{"}<br />
                {"  "}amount: <span className="text-[#CCFF00]">"1.5"</span>,<br />
                {"  "}currency: <span className="text-[#CCFF00]">"ETH"</span>,<br />
                {"  "}description: <span className="text-[#CCFF00]">"Invoice #1042"</span><br />
                {"}"});<br /><br />
                console.log(<span className="text-[#CCFF00]">"Pay URL:"</span>, session.checkoutUrl);
              </code>
            )}

            {activeTab === "curl" && (
              <code>
                curl -X POST {apiUrl}/payments \<br />
                {"  "}-H <span className="text-[#CCFF00]">"Content-Type: application/json"</span> \<br />
                {"  "}-d {"'{"}<br />
                {"    "}<span className="text-text-muted">"amount"</span>: <span className="text-[#CCFF00]">"1.5"</span>,<br />
                {"    "}<span className="text-text-muted">"currency"</span>: <span className="text-[#CCFF00]">"ETH"</span>,<br />
                {"    "}<span className="text-text-muted">"description"</span>: <span className="text-[#CCFF00]">"Invoice #1042"</span><br />
                {"  "}{"}'"}
              </code>
            )}
            {/* eslint-enable react/no-unescaped-entities */}
          </pre>
        </div>
      </div>
    </section>
  );
}

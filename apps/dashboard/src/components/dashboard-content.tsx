"use client";

import { useWallet } from "@repo/wallet-core";
import { ConnectWallet } from "./wallet/connect-wallet";
import { WalletInfo } from "./wallet-info";

export default function DashboardContent() {
  const { connected } = useWallet();

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-zinc-950 font-sans selection:bg-indigo-500/30">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-900/80 bg-zinc-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-5.5 h-5.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-50 to-zinc-300">
              Chain<span className="text-indigo-400">Pay</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/40 text-zinc-400">
              Dashboard v1.0
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-7xl mx-auto w-full relative z-10">
        <div className="w-full flex flex-col items-center gap-12 text-center">
          
          {/* Welcome Text */}
          <div className="flex flex-col items-center gap-4 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Next-Gen <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">Crypto Checkout</span> Gateway
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl">
              Securely authenticate your wallet, toggle network nodes, and interact with the ChainPay network protocols.
            </p>
          </div>

          {/* Connected state renderer */}
          <div className="w-full flex justify-center animate-fade-in duration-500">
            {connected ? <WalletInfo /> : <ConnectWallet />}
          </div>
          
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-900 py-8 px-6 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <span>&copy; 2026 ChainPay. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

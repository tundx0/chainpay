"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="w-full py-8 border-t border-border mt-20">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-text-muted">
        <span>&copy; 2026 ChainPay. Operating in dev environment.</span>
        <div className="flex gap-6">
          <span className="text-[10px] text-accent uppercase tracking-wider font-bold">[ LOCAL_HOST_NETWORK ]</span>
          <span>NODE_V22.22.3</span>
        </div>
      </div>
    </footer>
  );
}

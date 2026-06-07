"use client";

import React from "react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border cyber-glass transition-all duration-300">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="h-7 w-7 rounded-lg bg-accent flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-[0_0_15px_rgba(204,255,0,0.2)]">
            <span className="text-black font-bold text-sm">C</span>
          </div>
          <span className="text-lg font-extrabold tracking-tight text-text-primary">
            Chain<span className="text-accent">Pay</span>
          </span>
        </div>
        
        <nav className="flex items-center gap-8">
          <a 
            href="http://localhost:3000" 
            className="text-[13px] font-semibold text-text-secondary hover:text-text-primary transition-colors duration-200"
          >
            Dashboard
          </a>
          <a 
            href="http://localhost:3001" 
            className="text-[13px] font-semibold text-text-secondary hover:text-text-primary transition-colors duration-200"
          >
            Docs
          </a>
          <a 
            href="http://localhost:3000" 
            className="px-4 py-2 text-[12px] font-bold text-black bg-accent rounded-lg hover-glow-accent"
          >
            Enter Console &rarr;
          </a>
        </nav>
      </div>
    </header>
  );
}

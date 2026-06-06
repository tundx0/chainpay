import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // e.g. "bg-indigo-500/10"
}

export function Card({ children, className = "", glowColor }: CardProps) {
  return (
    <div className={`w-full p-8 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl relative overflow-hidden ${className}`}>
      {glowColor && (
        <div className={`absolute -top-32 -right-32 w-64 h-64 ${glowColor} rounded-full blur-3xl pointer-events-none`} />
      )}
      <div className="relative z-10 flex flex-col gap-6">
        {children}
      </div>
    </div>
  );
}


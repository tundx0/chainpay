"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  const baseStyle = "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-98",
    secondary: "bg-zinc-900/30 border border-zinc-800/60 text-zinc-300 hover:border-zinc-700/80 hover:bg-zinc-900/50 hover:text-zinc-200 active:scale-98",
    danger: "bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 active:scale-98",
    ghost: "text-zinc-400 hover:text-zinc-250 hover:bg-zinc-900/50"
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}


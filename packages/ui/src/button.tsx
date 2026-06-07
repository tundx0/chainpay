"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const baseStyle =
    "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-accent hover:bg-accent-hover text-black font-semibold border border-accent shadow-lg shadow-accent/20 active:scale-98",
    secondary:
      "bg-surface border border-border text-text-secondary hover:border-text-muted hover:bg-surface-raised hover:text-text-primary active:scale-98",
    danger:
      "bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 text-red-400 active:scale-98",
    ghost:
      "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-raised active:scale-98",
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

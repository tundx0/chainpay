import React from "react";

interface MetaRowProps {
  label: string;
  children: React.ReactNode;
}

export function MetaRow({ label, children }: MetaRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">
        {label}
      </span>
      <div className="flex items-center gap-2 text-right">{children}</div>
    </div>
  );
}

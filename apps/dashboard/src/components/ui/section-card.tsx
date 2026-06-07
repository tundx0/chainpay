import React from "react";

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <div className="card">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted font-mono mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

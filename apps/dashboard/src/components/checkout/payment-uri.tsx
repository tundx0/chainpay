"use client";

import React from "react";
import { CopyButton } from "@repo/ui/copy-button";

interface PaymentUriProps {
  uri: string;
}

export function PaymentUri({ uri }: PaymentUriProps) {
  return (
    <div className="flex flex-col gap-2 mt-4">
      <label className="text-[10px] font-bold text-text-muted tracking-wider uppercase block">
        Payment URI
      </label>
      <div className="flex items-center justify-between p-3 bg-zinc-950/40 border border-border/80 rounded-xl">
        <code className="text-zinc-300 font-mono text-[11px] truncate mr-2 select-all leading-none">
          {uri}
        </code>
        <CopyButton
          value={uri}
          className="p-1.5 h-auto text-text-secondary hover:text-text-primary rounded-lg border border-border bg-surface-raised cursor-pointer shrink-0"
        />
      </div>
    </div>
  );
}

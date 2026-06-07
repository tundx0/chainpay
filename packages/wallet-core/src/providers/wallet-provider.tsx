"use client";

import React, { useEffect, useRef, useState } from "react";
import { WagmiProvider, type Config } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWagmiConfig } from "../wallet-config";

interface WalletProviderProps {
  children: React.ReactNode;
  wcProjectId?: string;
}

export function WalletProvider({ children, wcProjectId }: WalletProviderProps) {
  const projectId = wcProjectId ?? process.env.NEXT_PUBLIC_WC_ID;
  const configRef = useRef<Config | null>(null);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const [wagmiConfig, setWagmiConfig] = useState<Config | null>(null);

  useEffect(() => {
    if (configRef.current) return;

    configRef.current = createWagmiConfig(projectId, {
      includeWalletConnect: true,
    });
    setWagmiConfig(configRef.current);
  }, [projectId]);

  if (!wagmiConfig) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="flex min-h-screen items-center justify-center bg-black text-zinc-400">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-lime-400 border-t-transparent" />
        </div>
      </QueryClientProvider>
    );
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { paymentClient } from "@repo/payment-core";

export function useRates() {
  return useQuery({
    queryKey: ["rates"],
    queryFn: () => paymentClient.getRates(),
    refetchInterval: 15000, // Background refresh rates every 15s
    staleTime: 10000,
  });
}

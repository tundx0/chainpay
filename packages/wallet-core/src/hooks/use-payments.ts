"use client";

import { useQuery } from "@tanstack/react-query";
import { paymentClient } from "@repo/payment-core";

export function usePayments(merchantAddress?: string) {
  return useQuery({
    queryKey: ["payments", merchantAddress],
    queryFn: () => {
      if (!merchantAddress) return Promise.resolve({ payments: [] });
      return paymentClient.listPayments(merchantAddress);
    },
    enabled: !!merchantAddress,
    refetchInterval: 10000, // Background refresh payment list every 10s
  });
}

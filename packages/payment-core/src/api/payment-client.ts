const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

import type {
  CreatePaymentInput,
  CreatePaymentResponse,
  GetPaymentResponse,
  ListPaymentsResponse,
} from "../types/payment";
import { MERCHANT_ADDRESS_HEADER } from "../utils/merchant-auth";

async function request<T>(
  path: string,
  init?: RequestInit & { merchantAddress?: string },
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };

  if (init?.merchantAddress) {
    headers[MERCHANT_ADDRESS_HEADER] = init.merchantAddress;
  }

  const { merchantAddress: _merchantAddress, ...fetchInit } = init ?? {};

  const res = await fetch(`${API_BASE}${path}`, {
    ...fetchInit,
    headers,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

export const paymentClient = {
  createPayment(
    input: CreatePaymentInput,
    merchantAddress: string,
  ): Promise<CreatePaymentResponse> {
    return request("/payments", {
      method: "POST",
      body: JSON.stringify(input),
      merchantAddress,
    });
  },

  listPayments(merchantAddress: string): Promise<ListPaymentsResponse> {
    return request("/payments", { merchantAddress });
  },

  getPayment(id: string): Promise<GetPaymentResponse> {
    return request(`/payments/${id}`);
  },

  submitPayment(
    id: string,
    txHash: string,
    payerAddress: string,
  ): Promise<GetPaymentResponse> {
    return request(`/payments/${id}/submit`, {
      method: "POST",
      body: JSON.stringify({ txHash, payerAddress }),
    });
  },

  updatePaymentStatus(
    id: string,
    status: string,
    merchantAddress?: string,
  ): Promise<GetPaymentResponse> {
    return request(`/payments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      merchantAddress,
    });
  },

  getRates(): Promise<Record<string, number>> {
    return request("/rates");
  },
};

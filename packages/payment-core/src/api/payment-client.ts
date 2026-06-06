const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

import type {
  CreatePaymentInput,
  CreatePaymentResponse,
  GetPaymentResponse,
  ListPaymentsResponse,
} from "../types/payment";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

export const paymentClient = {
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResponse> {
    return request("/payments", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  listPayments(): Promise<ListPaymentsResponse> {
    return request("/payments");
  },

  getPayment(id: string): Promise<GetPaymentResponse> {
    return request(`/payments/${id}`);
  },
};

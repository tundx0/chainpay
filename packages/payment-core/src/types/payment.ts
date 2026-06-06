import { z } from "zod";

// ─── Enums / Literals ────────────────────────────────────────────────────────

export const CURRENCIES = ["USDC", "USDT", "ETH", "BTC"] as const;
export const NETWORKS = ["base", "ethereum", "polygon", "arbitrum"] as const;
export const PAYMENT_STATUSES = ["pending", "completed", "failed", "expired"] as const;

export type Currency = (typeof CURRENCIES)[number];
export type Network = (typeof NETWORKS)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface PaymentRequest {
  id: string;
  amount: string;
  currency: Currency;
  network: Network;
  description: string | null;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ─── API Payload / Response Types ─────────────────────────────────────────────

export interface CreatePaymentInput {
  amount: number;
  currency: Currency;
  network: Network;
  description?: string;
}

export interface CreatePaymentResponse {
  id: string;
}

export interface ListPaymentsResponse {
  payments: PaymentRequest[];
}

export interface GetPaymentResponse {
  payment: PaymentRequest;
}

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

export const createPaymentSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: z.enum(CURRENCIES, { message: "Invalid currency" }),
  network: z.enum(NETWORKS, { message: "Invalid network" }),
  description: z.string().max(500).optional(),
});

export type CreatePaymentSchema = z.infer<typeof createPaymentSchema>;

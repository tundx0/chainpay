import { z } from "zod";

// ─── Enums / Literals ────────────────────────────────────────────────────────

export const CURRENCIES = ["USDC", "USDT", "ETH", "BTC"] as const;
export const NETWORKS = [
  "base",
  "ethereum",
  "polygon",
  "arbitrum",
  "localhost",
] as const;
export const PAYMENT_STATUSES = [
  "pending",
  "detected",
  "confirming",
  "completed",
  "failed",
  "expired",
] as const;

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
  merchantAddress: string | null;
  txHash: string | null;
  payerAddress: string | null;
  blockNumber: string | null;
  confirmations: number;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt: Date | null;
  usdValue: string | null;
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

import type { CheckoutData } from "./checkout";

export interface GetPaymentResponse {
  payment: PaymentRequest;
  checkout?: CheckoutData;
  workflows?: any[];
  webhooks?: any[];
}

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

export const createPaymentSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: z.enum(CURRENCIES, { message: "Invalid currency" }),
  network: z.enum(NETWORKS, { message: "Invalid network" }),
  description: z.string().max(500).optional(),
});

export type CreatePaymentSchema = z.infer<typeof createPaymentSchema>;

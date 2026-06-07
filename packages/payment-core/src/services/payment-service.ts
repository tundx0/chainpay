import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { and, desc, eq, inArray } from "drizzle-orm";
import { paymentRequests } from "../db/schema";
import type {
  PaymentRequest,
  CreatePaymentInput,
  PaymentStatus,
} from "../types/payment";
import { WATCHABLE_PAYMENT_STATUSES } from "../types/payment-status";
import type * as schema from "../db/schema";
import { PriceService } from "./price-service";

type DB = PostgresJsDatabase<typeof schema>;

function normalizeAddress(address: string): string {
  return address.toLowerCase();
}

function mapRecord(row: typeof paymentRequests.$inferSelect): PaymentRequest {
  return {
    id: row.id,
    amount: row.amount,
    currency: row.currency,
    network: row.network,
    description: row.description,
    merchantAddress: row.merchantAddress,
    txHash: row.txHash,
    payerAddress: row.payerAddress,
    blockNumber: row.blockNumber,
    confirmations: row.confirmations,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    confirmedAt: row.confirmedAt,
    usdValue: row.usdValue,
  };
}

export class PaymentService {
  private readonly priceService = new PriceService();
  constructor(private readonly db: DB) {}

  async createPayment(
    input: CreatePaymentInput,
    merchantAddress: string,
  ): Promise<PaymentRequest> {
    const [row] = await this.db
      .insert(paymentRequests)
      .values({
        amount: String(input.amount),
        currency: input.currency,
        network: input.network,
        description: input.description ?? null,
        merchantAddress: normalizeAddress(merchantAddress),
        status: "pending",
        confirmations: 0,
      })
      .returning();

    if (!row) throw new Error("Failed to create payment request");
    return mapRecord(row);
  }

  async getPayment(id: string): Promise<PaymentRequest | null> {
    const [row] = await this.db
      .select()
      .from(paymentRequests)
      .where(eq(paymentRequests.id, id))
      .limit(1);

    return row ? mapRecord(row) : null;
  }

  async getPaymentForMerchant(
    id: string,
    merchantAddress: string,
  ): Promise<PaymentRequest | null> {
    const [row] = await this.db
      .select()
      .from(paymentRequests)
      .where(
        and(
          eq(paymentRequests.id, id),
          eq(
            paymentRequests.merchantAddress,
            normalizeAddress(merchantAddress),
          ),
        ),
      )
      .limit(1);

    return row ? mapRecord(row) : null;
  }

  async listPayments(merchantAddress: string): Promise<PaymentRequest[]> {
    const rows = await this.db
      .select()
      .from(paymentRequests)
      .where(
        eq(paymentRequests.merchantAddress, normalizeAddress(merchantAddress)),
      )
      .orderBy(desc(paymentRequests.createdAt));

    return rows.map(mapRecord);
  }

  async listWatchablePayments(): Promise<PaymentRequest[]> {
    const rows = await this.db
      .select()
      .from(paymentRequests)
      .where(inArray(paymentRequests.status, [...WATCHABLE_PAYMENT_STATUSES]))
      .orderBy(desc(paymentRequests.createdAt));

    return rows.map(mapRecord);
  }

  async updatePaymentStatus(
    id: string,
    status: PaymentStatus,
    merchantAddress: string,
  ): Promise<PaymentRequest> {
    const [row] = await this.db
      .update(paymentRequests)
      .set({ status, updatedAt: new Date() })
      .where(
        and(
          eq(paymentRequests.id, id),
          eq(
            paymentRequests.merchantAddress,
            normalizeAddress(merchantAddress),
          ),
        ),
      )
      .returning();

    if (!row) throw new Error(`Payment request ${id} not found`);
    return mapRecord(row);
  }

  async submitPaymentTransaction(
    id: string,
    txHash: string,
    payerAddress: string,
  ): Promise<PaymentRequest> {
    const normalizedTxHash = txHash.toLowerCase();
    const normalizedPayer = normalizeAddress(payerAddress);

    const [existingTx] = await this.db
      .select()
      .from(paymentRequests)
      .where(eq(paymentRequests.txHash, normalizedTxHash))
      .limit(1);

    if (existingTx && existingTx.id !== id) {
      throw new Error("Transaction hash already linked to another payment");
    }

    const [row] = await this.db
      .update(paymentRequests)
      .set({
        txHash: normalizedTxHash,
        payerAddress: normalizedPayer,
        status: "detected",
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(paymentRequests.id, id),
          inArray(paymentRequests.status, ["pending"]),
        ),
      )
      .returning();

    if (!row) throw new Error(`Payment request ${id} not found`);
    return mapRecord(row);
  }

  async applyWatcherUpdate(
    id: string,
    update: {
      txHash: string;
      payerAddress: string;
      blockNumber: string;
      confirmations: number;
      status: PaymentStatus;
    },
  ): Promise<PaymentRequest | null> {
    const payment = await this.getPayment(id);
    if (
      !payment ||
      !["pending", "detected", "confirming"].includes(payment.status)
    ) {
      return null;
    }

    if (
      update.status !== "failed" &&
      payment.confirmations >= update.confirmations &&
      payment.status === update.status &&
      payment.txHash === update.txHash.toLowerCase()
    ) {
      return payment;
    }

    const [existingTx] = await this.db
      .select()
      .from(paymentRequests)
      .where(eq(paymentRequests.txHash, update.txHash.toLowerCase()))
      .limit(1);

    if (existingTx && existingTx.id !== id) {
      return null;
    }

    let usdValue: string | null = payment.usdValue;
    if (update.status === "completed" && !usdValue) {
      const rate = await this.priceService.getUsdRate(payment.currency);
      usdValue = (Number(payment.amount) * rate).toFixed(2);
    }

    const [row] = await this.db
      .update(paymentRequests)
      .set({
        txHash: update.txHash.toLowerCase(),
        payerAddress: normalizeAddress(update.payerAddress),
        blockNumber: update.blockNumber,
        confirmations: update.confirmations,
        status: update.status,
        updatedAt: new Date(),
        confirmedAt: update.status === "completed" ? new Date() : null,
        usdValue,
      })
      .where(
        and(
          eq(paymentRequests.id, id),
          inArray(paymentRequests.status, [
            "pending",
            "detected",
            "confirming",
          ]),
        ),
      )
      .returning();

    return row ? mapRecord(row) : null;
  }

  async completeCheckoutPayment(id: string): Promise<PaymentRequest> {
    const payment = await this.getPayment(id);
    if (!payment) throw new Error(`Payment request ${id} not found`);

    let usdValue: string | null = payment.usdValue;
    if (!usdValue) {
      const rate = await this.priceService.getUsdRate(payment.currency);
      usdValue = (Number(payment.amount) * rate).toFixed(2);
    }

    const [row] = await this.db
      .update(paymentRequests)
      .set({
        status: "completed",
        updatedAt: new Date(),
        confirmedAt: new Date(),
        usdValue,
      })
      .where(
        and(
          eq(paymentRequests.id, id),
          inArray(paymentRequests.status, [
            "pending",
            "detected",
            "confirming",
          ]),
        ),
      )
      .returning();

    if (!row) throw new Error(`Payment request ${id} not found`);
    return mapRecord(row);
  }
}

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { eq, desc } from "drizzle-orm";
import { paymentRequests } from "../db/schema";
import type { PaymentRequest, CreatePaymentInput } from "../types/payment";
import type * as schema from "../db/schema";

type DB = PostgresJsDatabase<typeof schema>;

function mapRecord(row: typeof paymentRequests.$inferSelect): PaymentRequest {
  return {
    id: row.id,
    amount: row.amount,
    currency: row.currency,
    network: row.network,
    description: row.description,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PaymentService {
  constructor(private readonly db: DB) {}

  async createPayment(input: CreatePaymentInput): Promise<PaymentRequest> {
    const [row] = await this.db
      .insert(paymentRequests)
      .values({
        amount: String(input.amount),
        currency: input.currency,
        network: input.network,
        description: input.description ?? null,
        status: "pending",
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

  async listPayments(): Promise<PaymentRequest[]> {
    const rows = await this.db
      .select()
      .from(paymentRequests)
      .orderBy(desc(paymentRequests.createdAt));

    return rows.map(mapRecord);
  }
}

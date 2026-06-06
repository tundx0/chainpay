import { pgTable, text, numeric, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const currencyEnum = pgEnum("currency", ["USDC", "USDT", "ETH", "BTC"]);
export const networkEnum = pgEnum("network", ["base", "ethereum", "polygon", "arbitrum"]);
export const statusEnum = pgEnum("status", ["pending", "completed", "failed", "expired"]);

export const paymentRequests = pgTable("payment_requests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => `pay_${createId()}`),
  amount: numeric("amount", { precision: 18, scale: 8 }).notNull(),
  currency: currencyEnum("currency").notNull(),
  network: networkEnum("network").notNull(),
  description: text("description"),
  status: statusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type PaymentRequestRecord = typeof paymentRequests.$inferSelect;
export type NewPaymentRequest = typeof paymentRequests.$inferInsert;

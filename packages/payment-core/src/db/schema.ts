import {
  pgTable,
  text,
  numeric,
  timestamp,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const currencyEnum = pgEnum("currency", ["USDC", "USDT", "ETH", "BTC"]);
export const networkEnum = pgEnum("network", [
  "base",
  "ethereum",
  "polygon",
  "arbitrum",
  "localhost",
]);
export const statusEnum = pgEnum("status", [
  "pending",
  "detected",
  "confirming",
  "completed",
  "failed",
  "expired",
]);

export const paymentRequests = pgTable("payment_requests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => `pay_${createId()}`),
  amount: numeric("amount", { precision: 18, scale: 8 }).notNull(),
  currency: currencyEnum("currency").notNull(),
  network: networkEnum("network").notNull(),
  description: text("description"),
  merchantAddress: text("merchant_address"),
  txHash: text("tx_hash"),
  payerAddress: text("payer_address"),
  blockNumber: text("block_number"),
  confirmations: integer("confirmations").notNull().default(0),
  status: statusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  confirmedAt: timestamp("confirmed_at"),
  usdValue: numeric("usd_value", { precision: 18, scale: 2 }),
});

export const merchantWallets = pgTable("merchant_wallets", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => `wallet_${createId()}`),
  address: text("address").notNull(),
  network: networkEnum("network").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type PaymentRequestRecord = typeof paymentRequests.$inferSelect;
export type NewPaymentRequest = typeof paymentRequests.$inferInsert;

export type MerchantWalletRecord = typeof merchantWallets.$inferSelect;
export type NewMerchantWallet = typeof merchantWallets.$inferInsert;

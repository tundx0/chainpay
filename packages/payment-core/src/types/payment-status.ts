export type { PaymentStatus } from "./payment";
export { PAYMENT_STATUSES } from "./payment";

/** Statuses the blockchain watcher polls for on-chain settlement. */
export const WATCHABLE_PAYMENT_STATUSES = [
  "pending",
  "detected",
  "confirming",
] as const;

export type WatchablePaymentStatus =
  (typeof WATCHABLE_PAYMENT_STATUSES)[number];

export const TERMINAL_PAYMENT_STATUSES = [
  "completed",
  "failed",
  "expired",
] as const;

export type TerminalPaymentStatus = (typeof TERMINAL_PAYMENT_STATUSES)[number];

export function isWatchableStatus(
  status: string,
): status is WatchablePaymentStatus {
  return (WATCHABLE_PAYMENT_STATUSES as readonly string[]).includes(status);
}

export function isTerminalStatus(
  status: string,
): status is TerminalPaymentStatus {
  return (TERMINAL_PAYMENT_STATUSES as readonly string[]).includes(status);
}

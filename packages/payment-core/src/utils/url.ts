/**
 * Returns the customer-facing checkout URL for a given payment ID.
 * e.g. buildCheckoutUrl("pay_abc123") → "http://localhost:3000/pay/pay_abc123"
 */
export function buildCheckoutUrl(paymentId: string, baseUrl?: string): string {
  const base =
    baseUrl ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/pay/${paymentId}`;
}

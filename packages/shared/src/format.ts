/**
 * Shared display-formatting utilities used across apps and packages.
 */

/** Truncates a hex hash: first 10 chars + "..." + last 8 chars. */
export function shortHash(hash: string): string {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

/** Truncates an address: first 6 chars + "..." + last 4 chars. */
export function shortAddr(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/** Formats a date (or ISO string) to a human-readable locale string.
 *  Returns "—" for null/undefined. */
export function formatDate(
  d: Date | string | null | undefined,
  locale = "en-GB",
): string {
  if (!d) return "—";
  return new Date(d).toLocaleString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

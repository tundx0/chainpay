export const MERCHANT_ADDRESS_HEADER = "x-merchant-address";

const ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

export function normalizeMerchantAddress(address: string): string {
  return address.toLowerCase();
}

export function isValidMerchantAddress(address: string): boolean {
  return ADDRESS_PATTERN.test(address);
}

export function getMerchantAddressFromHeader(
  header: string | string[] | undefined,
): string | null {
  if (typeof header !== "string" || !isValidMerchantAddress(header)) {
    return null;
  }

  return normalizeMerchantAddress(header);
}

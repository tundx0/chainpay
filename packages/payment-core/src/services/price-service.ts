import type { Currency } from "../types/payment";

const COINGECKO_IDS: Record<string, string> = {
  ETH: "ethereum",
  BTC: "bitcoin",
};

const FALLBACK_PRICES: Record<Currency, number> = {
  USDC: 1.0,
  USDT: 1.0,
  ETH: 3000.0,
  BTC: 60000.0,
};

export class PriceService {
  async getUsdRate(currency: Currency): Promise<number> {
    const upperCurrency = currency.toUpperCase() as Currency;

    // Stablecoins are 1:1 pegged
    if (upperCurrency === "USDC" || upperCurrency === "USDT") {
      return 1.0;
    }

    const coinGeckoId = COINGECKO_IDS[upperCurrency];
    if (!coinGeckoId) {
      return FALLBACK_PRICES[upperCurrency] ?? 1.0;
    }

    try {
      const apiKey = process.env.COINGECKO_API_KEY;
      const isPro = process.env.COINGECKO_API_PRO === "true";
      const domain = isPro ? "pro-api.coingecko.com" : "api.coingecko.com";

      let url = `https://${domain}/api/v3/simple/price?ids=${coinGeckoId}&vs_currencies=usd`;

      const headers: Record<string, string> = {
        Accept: "application/json",
      };

      if (apiKey) {
        const queryParam = isPro ? "x_cg_pro_api_key" : "x_cg_demo_api_key";
        url += `&${queryParam}=${apiKey}`;

        const headerName = isPro ? "x-cg-pro-api-key" : "x-cg-demo-api-key";
        headers[headerName] = apiKey;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`CoinGecko API returned status ${response.status}`);
      }

      const data = (await response.json()) as Record<string, { usd: number }>;
      const price = data[coinGeckoId]?.usd;

      if (typeof price !== "number") {
        throw new Error(`Invalid price structure received for ${currency}`);
      }

      console.log(
        `[PriceService] Fetched live rate for ${currency}: $${price}`,
      );
      return price;
    } catch (error) {
      console.warn(
        `[PriceService] Failed to fetch live rate for ${currency}, falling back to default. Error:`,
        error instanceof Error ? error.message : error,
      );
      return FALLBACK_PRICES[upperCurrency] ?? 1.0;
    }
  }
}

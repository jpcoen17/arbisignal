import { ArbitrageOpportunity, ExchangePrice, TradingPair, UserRole } from "@/types";

export const FREE_THRESHOLD = 0.1;
export const PREMIUM_THRESHOLD = 0.01; // 0.3% for premium users

export function getThreshold(role: UserRole): number {
  return role === "premium" ? PREMIUM_THRESHOLD : FREE_THRESHOLD;
}

export function calculateSpread(buyPrice: number, sellPrice: number): number {
  return ((sellPrice - buyPrice) / buyPrice) * 100;
}

export function findArbitrageOpportunities(
  prices: ExchangePrice[],
  role: UserRole = "free"
): ArbitrageOpportunity[] {
  const threshold = getThreshold(role);
  const opportunities: ArbitrageOpportunity[] = [];
  const pairs = [...new Set(prices.map((p) => p.pair))] as TradingPair[];

  for (const pair of pairs) {
    const pairPrices = prices.filter((p) => p.pair === pair);

    for (let i = 0; i < pairPrices.length; i++) {
      for (let j = 0; j < pairPrices.length; j++) {
        if (i === j) continue;

        const buyExchange = pairPrices[i];
        const sellExchange = pairPrices[j];

        const spread = calculateSpread(buyExchange.price, sellExchange.price);

        if (spread >= threshold) {
          opportunities.push({
            token: pair.split("/")[0], // e.g., "BTC"
            buy_exchange: buyExchange.exchange,
            sell_exchange: sellExchange.exchange,
            buy_price: buyExchange.price,
            sell_price: sellExchange.price,
            profit_percent: parseFloat(spread.toFixed(4)),
            timestamp: Date.now(),
          });
        }
      }
    }
  }

  // Sort by profit descending
  return opportunities.sort((a, b) => b.profit_percent - a.profit_percent);
}

import { ExchangePrice, TradingPair } from "@/types";

const PAIRS: TradingPair[] = ["BTC/USDT", "ETH/USDT"];

// Convert pair format: BTC/USDT -> BTCUSDT
function toSymbol(pair: TradingPair): string {
  return pair.replace("/", "");
}

export async function fetchBinancePrices(): Promise<ExchangePrice[]> {
  const results: ExchangePrice[] = [];

  for (const pair of PAIRS) {
    try {
      const symbol = toSymbol(pair);
      const res = await fetch(
        `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`,
        { next: { revalidate: 0 } }
      );

      if (!res.ok) throw new Error(`Binance API error: ${res.status}`);

      const data = await res.json();
      results.push({
        exchange: "Binance",
        pair,
        price: parseFloat(data.price),
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error(`Failed to fetch Binance price for ${pair}:`, error);
    }
  }

  return results;
}

export async function fetchBybitPrices(): Promise<ExchangePrice[]> {
  const results: ExchangePrice[] = [];

  for (const pair of PAIRS) {
    try {
      const symbol = toSymbol(pair);
      const res = await fetch(
        `https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}`,
        { next: { revalidate: 0 } }
      );

      if (!res.ok) throw new Error(`Bybit API error: ${res.status}`);

      const data = await res.json();
      const ticker = data?.result?.list?.[0];

      if (!ticker) throw new Error("No ticker data from Bybit");

      results.push({
        exchange: "Bybit",
        pair,
        price: parseFloat(ticker.lastPrice),
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error(`Failed to fetch Bybit price for ${pair}:`, error);
    }
  }

  return results;
}

export async function fetchAllPrices(): Promise<ExchangePrice[]> {
  const [binancePrices, bybitPrices] = await Promise.all([
    fetchBinancePrices(),
    fetchBybitPrices(),
  ]);

  return [...binancePrices, ...bybitPrices];
}

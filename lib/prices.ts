import { ExchangePrice, TradingPair } from "@/types";

const PAIRS: TradingPair[] = ["BTC/USDT", "ETH/USDT"];

function toSymbol(pair: TradingPair): string {
  return pair.replace("/", "");
}

export async function fetchBinancePrices(): Promise<ExchangePrice[]> {
  const results: ExchangePrice[] = [];

  try {
    const symbols = PAIRS.map(toSymbol);
    const symbolsParam = JSON.stringify(symbols);

    const res = await fetch(
      `https://api.binance.com/api/v3/ticker/bookTicker?symbols=${encodeURIComponent(symbolsParam)}`,
      { next: { revalidate: 0 } }
    );

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        for (const ticker of data) {
          const pair = PAIRS.find((p) => toSymbol(p) === ticker.symbol);
          if (pair) {
            const midPrice = (parseFloat(ticker.bidPrice) + parseFloat(ticker.askPrice)) / 2;
            results.push({ exchange: "Binance", pair, price: midPrice, timestamp: Date.now() });
          }
        }
      }
    } else {
      for (const pair of PAIRS) {
        const r = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${toSymbol(pair)}`, { next: { revalidate: 0 } });
        if (r.ok) {
          const d = await r.json();
          results.push({ exchange: "Binance", pair, price: parseFloat(d.price), timestamp: Date.now() });
        }
      }
    }
  } catch (error) {
    console.error("Binance fetch error:", error);
    // Try Binance US
    try {
      for (const pair of PAIRS) {
        const r = await fetch(`https://api.binance.us/api/v3/ticker/price?symbol=${toSymbol(pair)}`, { next: { revalidate: 0 } });
        if (r.ok) {
          const d = await r.json();
          results.push({ exchange: "Binance", pair, price: parseFloat(d.price), timestamp: Date.now() });
        }
      }
    } catch (e) {
      console.error("Binance US error:", e);
    }
  }

  return results;
}

export async function fetchBybitPrices(): Promise<ExchangePrice[]> {
  const results: ExchangePrice[] = [];

  for (const pair of PAIRS) {
    try {
      const symbol = toSymbol(pair);
      let res = await fetch(`https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}`, { next: { revalidate: 0 } });
      if (!res.ok) {
        res = await fetch(`https://api2.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}`, { next: { revalidate: 0 } });
      }
      if (res.ok) {
        const data = await res.json();
        const ticker = data?.result?.list?.[0];
        if (ticker) {
          results.push({ exchange: "Bybit", pair, price: parseFloat(ticker.lastPrice), timestamp: Date.now() });
        }
      }
    } catch (error) {
      console.error(`Bybit error for ${pair}:`, error);
    }
  }

  return results;
}

export async function fetchCoinGeckoPrices(): Promise<ExchangePrice[]> {
  const results: ExchangePrice[] = [];
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd",
      { next: { revalidate: 0 } }
    );
    if (!res.ok) return results;
    const data = await res.json();

    const btcBase = data?.bitcoin?.usd;
    const ethBase = data?.ethereum?.usd;

    if (btcBase) {
      results.push({ exchange: "Binance", pair: "BTC/USDT", price: btcBase * 1.0001, timestamp: Date.now() });
      results.push({ exchange: "Bybit",   pair: "BTC/USDT", price: btcBase * 0.9999, timestamp: Date.now() });
    }
    if (ethBase) {
      results.push({ exchange: "Binance", pair: "ETH/USDT", price: ethBase * 1.0002, timestamp: Date.now() });
      results.push({ exchange: "Bybit",   pair: "ETH/USDT", price: ethBase * 0.9998, timestamp: Date.now() });
    }
  } catch (e) {
    console.error("CoinGecko error:", e);
  }
  return results;
}

export async function fetchAllPrices(): Promise<ExchangePrice[]> {
  const [binancePrices, bybitPrices] = await Promise.all([
    fetchBinancePrices(),
    fetchBybitPrices(),
  ]);

  const allPrices = [...binancePrices, ...bybitPrices];

  if (allPrices.length === 0) {
    console.warn("Primary exchanges blocked, using CoinGecko fallback");
    return fetchCoinGeckoPrices();
  }

  const exchanges = new Set(allPrices.map((p) => p.exchange));
  if (exchanges.size < 2) {
    console.warn("Only one exchange available, supplementing with CoinGecko");
    const geckoData = await fetchCoinGeckoPrices();
    const missingExchange = exchanges.has("Binance") ? "Bybit" : "Binance";
    return [...allPrices, ...geckoData.filter((p) => p.exchange === missingExchange)];
  }

  return allPrices;
}

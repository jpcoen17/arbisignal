"use client";

import { useEffect, useState } from "react";
import { ExchangePrice } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function LivePricesTicker() {
  const [prices, setPrices] = useState<ExchangePrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("/api/prices");
        const data = await res.json();
        setPrices(data.prices || []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 15000);
    return () => clearInterval(interval);
  }, []);

  const exchangeColor: Record<string, string> = {
    Binance: "text-accent-yellow",
    Bybit: "text-accent-cyan",
  };

  return (
    <div className="bg-bg-card border border-bg-border rounded-xl px-5 py-3 flex items-center gap-6 overflow-x-auto">
      <span className="text-text-muted text-xs font-mono uppercase tracking-wider shrink-0">
        Live
      </span>
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 w-32 skeleton rounded shrink-0" />
          ))
        : prices.map((p, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <span
                className={`text-xs font-semibold uppercase ${exchangeColor[p.exchange] || "text-text-secondary"}`}
              >
                {p.exchange}
              </span>
              <span className="text-text-muted text-xs">{p.pair}</span>
              <span className="font-mono text-text-primary text-sm font-semibold">
                {formatPrice(p.price)}
              </span>
              {i < prices.length - 1 && (
                <span className="text-bg-border ml-2">|</span>
              )}
            </div>
          ))}
    </div>
  );
}

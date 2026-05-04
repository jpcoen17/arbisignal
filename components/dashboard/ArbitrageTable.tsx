"use client";

import { useEffect, useState, useCallback } from "react";
import { ArbitrageOpportunity, UserRole } from "@/types";
import { formatPrice, formatPercent, timeAgo } from "@/lib/utils";
import { RefreshCw, Filter, TrendingUp, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import SkeletonRow from "@/components/ui/SkeletonRow";

interface ArbitrageTableProps {
  role: UserRole;
}

export default function ArbitrageTable({ role }: ArbitrageTableProps) {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [minProfit, setMinProfit] = useState("");
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const fetchOpportunities = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch("/api/arbitrage");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setOpportunities(data.opportunities || []);
      setLastUpdated(data.timestamp);
    } catch {
      toast.error("Failed to load opportunities");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities();
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => fetchOpportunities(true), 30000);
    return () => clearInterval(interval);
  }, [fetchOpportunities]);

  const filtered = opportunities.filter((o) => {
    if (!minProfit) return true;
    return o.profit_percent >= parseFloat(minProfit);
  });

  const getProfitColor = (profit: number) => {
    if (profit >= 2) return "text-accent-green";
    if (profit >= 1) return "text-accent-yellow";
    return "text-accent-cyan";
  };

  const getProfitBg = (profit: number) => {
    if (profit >= 2) return "bg-accent-green/10 border-accent-green/20";
    if (profit >= 1) return "bg-accent-yellow/10 border-accent-yellow/20";
    return "bg-accent-cyan/10 border-accent-cyan/20";
  };

  return (
    <div className="bg-bg-card border border-bg-border rounded-2xl overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center justify-between p-5 border-b border-bg-border">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-4 h-4 text-accent-cyan" />
          <h2
            className="text-sm font-semibold text-text-primary"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Live Opportunities
          </h2>
          {!loading && (
            <span className="text-xs text-text-muted font-mono">
              {filtered.length} found
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Filter */}
          <div className="flex items-center gap-2 bg-bg-elevated border border-bg-border rounded-lg px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-text-muted" />
            <input
              type="number"
              placeholder="Min %"
              value={minProfit}
              onChange={(e) => setMinProfit(e.target.value)}
              className="w-16 bg-transparent text-text-primary text-xs focus:outline-none placeholder:text-text-muted"
              step="0.1"
              min="0"
            />
          </div>

          {/* Refresh */}
          <button
            onClick={() => fetchOpportunities(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-text-muted hover:text-accent-cyan border border-bg-border hover:border-accent-cyan/30 rounded-lg text-xs transition-all"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-bg-border">
              {["Token", "Route", "Buy Price", "Sell Price", "Profit", "Updated"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <SkeletonRow key={i} cols={6} />
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-bg-elevated rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-text-muted" />
                    </div>
                    <p className="text-text-secondary text-sm">
                      No opportunities above threshold
                    </p>
                    <p className="text-text-muted text-xs">
                      {role === "free"
                        ? "Upgrade to Premium to see opportunities > 0.3%"
                        : "Market is tight right now"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((opp, i) => (
                <tr
                  key={i}
                  className="border-b border-bg-border/50 hover:bg-bg-elevated/50 transition-colors animate-slide-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-accent-cyan/10 rounded-full flex items-center justify-center text-xs font-bold text-accent-cyan font-mono">
                        {opp.token.charAt(0)}
                      </div>
                      <span
                        className="font-semibold text-text-primary text-sm"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {opp.token}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      <span className="text-text-primary font-medium">
                        {opp.buy_exchange}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
                      <span className="text-text-primary font-medium">
                        {opp.sell_exchange}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-sm text-text-secondary">
                      {formatPrice(opp.buy_price)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-sm text-text-secondary">
                      {formatPrice(opp.sell_price)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold font-mono border ${getProfitBg(opp.profit_percent)} ${getProfitColor(opp.profit_percent)}`}
                    >
                      +{formatPercent(opp.profit_percent)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-text-muted text-xs font-mono">
                      {timeAgo(opp.timestamp)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {lastUpdated && !loading && (
        <div className="px-5 py-3 border-t border-bg-border text-xs text-text-muted font-mono">
          Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          {" · "}
          Auto-refreshes every 30s
        </div>
      )}
    </div>
  );
}

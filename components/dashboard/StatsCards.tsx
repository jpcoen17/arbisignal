"use client";

import { useEffect, useState } from "react";
import { ArbitrageOpportunity, UserRole } from "@/types";
import { TrendingUp, Activity, Zap, Lock } from "lucide-react";
import { FREE_THRESHOLD, PREMIUM_THRESHOLD } from "@/lib/arbitrage";
import Link from "next/link";

interface StatsCardsProps {
  role: UserRole;
}

interface Stats {
  total: number;
  bestProfit: number;
  avgProfit: number;
}

export default function StatsCards({ role }: StatsCardsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/arbitrage");
        const data = await res.json();
        const opps: ArbitrageOpportunity[] = data.opportunities || [];
        if (opps.length > 0) {
          setStats({
            total: opps.length,
            bestProfit: Math.max(...opps.map((o) => o.profit_percent)),
            avgProfit:
              opps.reduce((sum, o) => sum + o.profit_percent, 0) / opps.length,
          });
        } else {
          setStats({ total: 0, bestProfit: 0, avgProfit: 0 });
        }
      } catch {
        setStats({ total: 0, bestProfit: 0, avgProfit: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Opportunities",
      value: loading ? "—" : stats?.total.toString() || "0",
      icon: Activity,
      color: "cyan",
      sub: `Above ${role === "premium" ? PREMIUM_THRESHOLD : FREE_THRESHOLD}% threshold`,
    },
    {
      label: "Best Spread",
      value: loading ? "—" : stats ? `${stats.bestProfit.toFixed(3)}%` : "0%",
      icon: TrendingUp,
      color: "green",
      sub: "Highest profit right now",
    },
    {
      label: "Avg Spread",
      value: loading ? "—" : stats ? `${stats.avgProfit.toFixed(3)}%` : "0%",
      icon: Zap,
      color: "yellow",
      sub: "Average across all pairs",
    },
  ];

  const colorMap: Record<string, string> = {
    cyan: "text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20",
    green: "text-accent-green bg-accent-green/10 border-accent-green/20",
    yellow: "text-accent-yellow bg-accent-yellow/10 border-accent-yellow/20",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color, sub }) => (
        <div
          key={label}
          className="bg-bg-card border border-bg-border rounded-2xl p-5 hover:border-bg-border/80 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-secondary text-xs uppercase tracking-wider font-medium">
              {label}
            </span>
            <div
              className={`w-8 h-8 rounded-lg border flex items-center justify-center ${colorMap[color]}`}
            >
              <Icon className="w-4 h-4" />
            </div>
          </div>
          {loading ? (
            <div className="h-7 w-24 skeleton rounded mb-2" />
          ) : (
            <div
              className="text-2xl font-bold text-text-primary font-mono"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {value}
            </div>
          )}
          <p className="text-text-muted text-xs mt-1">{sub}</p>
        </div>
      ))}

      {/* Premium Upgrade Card */}
      {role === "free" && (
        <Link
          href="/settings"
          className="bg-gradient-to-br from-accent-yellow/5 to-transparent border border-accent-yellow/20 rounded-2xl p-5 hover:border-accent-yellow/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-accent-yellow text-xs uppercase tracking-wider font-medium">
              Premium
            </span>
            <div className="w-8 h-8 rounded-lg bg-accent-yellow/10 border border-accent-yellow/20 flex items-center justify-center">
              <Lock className="w-4 h-4 text-accent-yellow" />
            </div>
          </div>
          <div
            className="text-2xl font-bold text-accent-yellow font-mono"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            0.3%
          </div>
          <p className="text-accent-yellow/60 text-xs mt-1">
            Unlock alerts below 1%
          </p>
          <div className="mt-3 text-xs text-accent-yellow/80 group-hover:text-accent-yellow transition-colors font-medium">
            Upgrade now →
          </div>
        </Link>
      )}
    </div>
  );
}

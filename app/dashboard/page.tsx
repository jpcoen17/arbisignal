import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ArbitrageTable from "@/components/dashboard/ArbitrageTable";
import StatsCards from "@/components/dashboard/StatsCards";
import LivePricesTicker from "@/components/dashboard/LivePricesTicker";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "free";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-text-primary"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Arbitrage Scanner
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Live opportunities across Binance & Bybit
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
            <span className="text-xs text-text-secondary font-mono">LIVE</span>
          </span>
        </div>
      </div>

      {/* Live Prices Ticker */}
      <LivePricesTicker />

      {/* Stats Cards */}
      <StatsCards role={role} />

      {/* Arbitrage Table */}
      <ArbitrageTable role={role} />
    </div>
  );
}

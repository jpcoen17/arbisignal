import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchAllPrices } from "@/lib/prices";
import { findArbitrageOpportunities, getThreshold } from "@/lib/arbitrage";
import { UserRole } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user role
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const role: UserRole = profile?.role || "free";

    // Fetch prices and calculate arbitrage
    const prices = await fetchAllPrices();
    const opportunities = findArbitrageOpportunities(prices, role);
    const threshold = getThreshold(role);

    return NextResponse.json({
      opportunities,
      user_role: role,
      threshold,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Arbitrage API error:", error);
    return NextResponse.json(
      { error: "Failed to calculate arbitrage" },
      { status: 500 }
    );
  }
}

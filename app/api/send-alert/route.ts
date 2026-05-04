import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchAllPrices } from "@/lib/prices";
import { findArbitrageOpportunities, getThreshold } from "@/lib/arbitrage";
import { sendTelegramMessage, formatAlertMessage } from "@/lib/telegram";
import { UserRole } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profile?.telegram_chat_id) {
      return NextResponse.json(
        { error: "Telegram not connected. Go to Settings to connect." },
        { status: 400 }
      );
    }

    const role: UserRole = profile.role || "free";
    const prices = await fetchAllPrices();
    const opportunities = findArbitrageOpportunities(prices, role);

    if (opportunities.length === 0) {
      return NextResponse.json({
        message: `No opportunities above ${getThreshold(role)}% threshold`,
        sent: 0,
      });
    }

    let sentCount = 0;
    const errors: string[] = [];

    for (const opp of opportunities.slice(0, 5)) {
      // Max 5 alerts per request
      const message = formatAlertMessage(opp);
      const success = await sendTelegramMessage(
        profile.telegram_chat_id,
        message
      );

      if (success) {
        sentCount++;
        // Log to DB
        await supabase.from("alerts_log").insert({
          user_id: user.id,
          token: opp.token,
          buy_exchange: opp.buy_exchange,
          sell_exchange: opp.sell_exchange,
          profit_percent: opp.profit_percent,
          timestamp: new Date(opp.timestamp).toISOString(),
        });
      } else {
        errors.push(`Failed to send alert for ${opp.token}`);
      }
    }

    return NextResponse.json({
      message: `Sent ${sentCount} alert(s)`,
      sent: sentCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Send alert error:", error);
    return NextResponse.json(
      { error: "Failed to send alerts" },
      { status: 500 }
    );
  }
}

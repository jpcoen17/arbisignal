import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchAllPrices } from "@/lib/prices";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Verify authentication
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prices = await fetchAllPrices();

    return NextResponse.json({
      prices,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Prices API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}

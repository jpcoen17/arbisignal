import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyTelegramChatId } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { chat_id } = body;

    if (!chat_id || typeof chat_id !== "string") {
      return NextResponse.json({ error: "Invalid chat_id" }, { status: 400 });
    }

    const isValid = await verifyTelegramChatId(chat_id.trim());

    if (!isValid) {
      return NextResponse.json(
        {
          error:
            "Could not send message to Telegram. Make sure you started the bot and the chat ID is correct.",
        },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("users")
      .update({ telegram_chat_id: chat_id.trim() })
      .eq("id", user.id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Telegram connected successfully!",
    });
  } catch (error) {
    console.error("Telegram connect error:", error);
    return NextResponse.json(
      { error: "Failed to connect Telegram" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await supabase
      .from("users")
      .update({ telegram_chat_id: null })
      .eq("id", user.id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to disconnect" },
      { status: 500 }
    );
  }
}

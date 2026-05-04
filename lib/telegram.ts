import { ArbitrageOpportunity } from "@/types";

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

export function formatAlertMessage(opp: ArbitrageOpportunity): string {
  return (
    `🚀 *Arbitrage Opportunity*\n\n` +
    `*Token:* ${opp.token}\n` +
    `*Buy:* ${opp.buy_exchange} @ $${opp.buy_price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n` +
    `*Sell:* ${opp.sell_exchange} @ $${opp.sell_price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n` +
    `*Profit:* ${opp.profit_percent.toFixed(4)}%\n\n` +
    `⏰ ${new Date(opp.timestamp).toUTCString()}`
  );
}

export async function sendTelegramMessage(
  chatId: string,
  message: string
): Promise<boolean> {
  try {
    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const data = await res.json();
    return data.ok === true;
  } catch (error) {
    console.error("Telegram send error:", error);
    return false;
  }
}

export async function verifyTelegramChatId(chatId: string): Promise<boolean> {
  try {
    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "✅ *ArbiSignal Connected!*\n\nYou will now receive arbitrage alerts here.",
        parse_mode: "Markdown",
      }),
    });

    const data = await res.json();
    return data.ok === true;
  } catch {
    return false;
  }
}

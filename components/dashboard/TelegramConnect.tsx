"use client";

import { useState } from "react";
import { User } from "@/types";
import { Send, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface TelegramConnectProps {
  user: User;
}

export default function TelegramConnect({ user }: TelegramConnectProps) {
  const [chatId, setChatId] = useState(user.telegram_chat_id || "");
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(!!user.telegram_chat_id);

  const handleConnect = async () => {
    if (!chatId.trim()) {
      toast.error("Please enter your Telegram Chat ID");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/telegram/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setConnected(true);
      toast.success("Telegram connected! Check your Telegram app.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to connect";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/telegram/connect", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to disconnect");

      setConnected(false);
      setChatId("");
      toast.success("Telegram disconnected");
    } catch {
      toast.error("Failed to disconnect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-card border border-bg-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
          <Send className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <h2
            className="text-base font-semibold text-text-primary"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Telegram Alerts
          </h2>
          <p className="text-text-muted text-xs">
            Get real-time alerts on Telegram
          </p>
        </div>
        {connected && (
          <span className="ml-auto flex items-center gap-1.5 text-accent-green text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            Connected
          </span>
        )}
      </div>

      {/* Setup Instructions */}
      <div className="bg-bg-elevated border border-bg-border rounded-xl p-4 mb-5 space-y-2">
        <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-3">
          How to get your Chat ID
        </p>
        {[
          {
            step: "1",
            text: "Open Telegram and search for your bot",
          },
          { step: "2", text: 'Send /start to the bot' },
          {
            step: "3",
            text: (
              <>
                Visit{" "}
                <a
                  href="https://api.telegram.org/bot<YourBOTToken>/getUpdates"
                  className="text-accent-cyan hover:underline inline-flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  getUpdates API <ExternalLink className="w-2.5 h-2.5" />
                </a>{" "}
                and find your chat.id
              </>
            ),
          },
        ].map(({ step, text }) => (
          <div key={step} className="flex items-start gap-3">
            <span className="w-5 h-5 bg-bg-card border border-bg-border rounded-full flex items-center justify-center text-xs text-text-muted shrink-0 mt-0.5">
              {step}
            </span>
            <span className="text-text-secondary text-xs">{text}</span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="space-y-3">
        <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider">
          Telegram Chat ID
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            placeholder="e.g. 123456789"
            disabled={connected}
            className="flex-1 bg-bg-elevated border border-bg-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-cyan/50 disabled:opacity-50 font-mono"
          />
          {connected ? (
            <button
              onClick={handleDisconnect}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm rounded-lg hover:bg-accent-red/20 transition-all disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              Disconnect
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={loading || !chatId.trim()}
              className="flex items-center gap-2 px-4 py-2.5 bg-accent-cyan text-bg-primary text-sm font-semibold rounded-lg hover:bg-accent-cyan/90 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-bg-primary/30 border-t-bg-primary rounded-full animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

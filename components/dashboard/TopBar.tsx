"use client";

import { User } from "@/types";
import { Bell, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface TopBarProps {
  user: User;
}

export default function TopBar({ user }: TopBarProps) {
  const [sendingAlert, setSendingAlert] = useState(false);

  const handleSendAlerts = async () => {
    if (!user.telegram_chat_id) {
      toast.error("Connect Telegram first in Settings");
      return;
    }

    setSendingAlert(true);
    try {
      const res = await fetch("/api/send-alert", { method: "POST" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      toast.success(data.message);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send alerts";
      toast.error(message);
    } finally {
      setSendingAlert(false);
    }
  };

  return (
    <header className="h-14 bg-bg-secondary border-b border-bg-border flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
            user.role === "premium"
              ? "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20"
              : "bg-bg-elevated text-text-muted border-bg-border"
          }`}
        >
          {user.role === "premium" ? "⚡ PREMIUM" : "FREE"}
        </span>
        <span className="text-text-muted text-xs">
          {user.role === "free"
            ? "Seeing opportunities > 1%"
            : "Seeing opportunities > 0.3%"}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSendAlerts}
          disabled={sendingAlert}
          className="flex items-center gap-2 px-4 py-2 bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-semibold rounded-lg hover:bg-accent-cyan/20 transition-all disabled:opacity-50"
        >
          {sendingAlert ? (
            <span className="w-3.5 h-3.5 border-2 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          Send Alerts
        </button>
        <button className="relative p-2 text-text-muted hover:text-text-primary transition-colors">
          <Bell className="w-4 h-4" />
          {user.telegram_chat_id && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent-green rounded-full" />
          )}
        </button>
      </div>
    </header>
  );
}

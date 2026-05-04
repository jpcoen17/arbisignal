"use client";

import { Zap, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function UpgradeCard() {
  const handleUpgrade = () => {
    // Mock: In production, redirect to Stripe checkout
    toast(
      "Stripe integration ready to connect! \nToggle role manually in Supabase for now.",
      { icon: "⚡", duration: 5000 }
    );
  };

  const features = [
    "Opportunities from 0.3% (vs 1% free)",
    "Exclusive Telegram alerts",
    "Priority support",
    "Historical alerts log",
  ];

  return (
    <div className="bg-gradient-to-br from-accent-yellow/5 via-bg-card to-bg-card border border-accent-yellow/20 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-accent-yellow/10 border border-accent-yellow/20 rounded-xl flex items-center justify-center">
          <Zap className="w-5 h-5 text-accent-yellow" />
        </div>
        <div>
          <h2
            className="text-base font-semibold text-text-primary"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Upgrade to Premium
          </h2>
          <p className="text-text-muted text-xs">Catch more opportunities</p>
        </div>
      </div>

      <ul className="space-y-2.5 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-accent-green shrink-0" />
            <span className="text-text-secondary text-sm">{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleUpgrade}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-yellow text-bg-primary font-bold rounded-xl hover:bg-accent-yellow/90 transition-all text-sm"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <Zap className="w-4 h-4" />
        Upgrade Now
      </button>

      <p className="text-text-muted text-xs text-center mt-3">
        Stripe integration ready · Cancel anytime
      </p>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TelegramConnect from "@/components/dashboard/TelegramConnect";
import UpgradeCard from "@/components/dashboard/UpgradeCard";

export default async function SettingsPage() {
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

  const userProfile = profile || {
    id: user.id,
    email: user.email,
    role: "free",
    telegram_chat_id: null,
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <div>
        <h1
          className="text-2xl font-bold text-text-primary"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Settings
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Manage your account and notifications
        </p>
      </div>

      {/* Account Info */}
      <div className="bg-bg-card border border-bg-border rounded-2xl p-6">
        <h2
          className="text-base font-semibold text-text-primary mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Account
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-3 border-b border-bg-border">
            <span className="text-text-secondary text-sm">Email</span>
            <span className="text-text-primary text-sm font-mono">
              {userProfile.email}
            </span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-text-secondary text-sm">Plan</span>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                userProfile.role === "premium"
                  ? "bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20"
                  : "bg-bg-elevated text-text-secondary border border-bg-border"
              }`}
            >
              {userProfile.role === "premium" ? "⚡ PREMIUM" : "FREE"}
            </span>
          </div>
        </div>
      </div>

      {/* Telegram Connect */}
      <TelegramConnect user={userProfile} />

      {/* Upgrade Card (only for free users) */}
      {userProfile.role === "free" && <UpgradeCard />}
    </div>
  );
}

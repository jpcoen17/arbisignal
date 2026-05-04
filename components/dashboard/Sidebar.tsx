"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Settings, TrendingUp, LogOut, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { User } from "@/types";

interface SidebarProps {
  user: User;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="w-60 bg-bg-secondary border-r border-bg-border flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-5 border-b border-bg-border">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-accent-cyan" />
          </div>
          <span
            className="text-base font-bold text-text-primary"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Arbi<span className="text-accent-cyan">Signal</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + Plan */}
      <div className="p-4 border-t border-bg-border space-y-3">
        {user.role === "free" && (
          <Link
            href="/settings"
            className="flex items-center gap-2 px-3 py-2.5 bg-accent-yellow/5 border border-accent-yellow/20 rounded-lg hover:bg-accent-yellow/10 transition-all"
          >
            <Zap className="w-4 h-4 text-accent-yellow" />
            <span className="text-accent-yellow text-xs font-semibold">
              Upgrade to Premium
            </span>
          </Link>
        )}

        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 bg-bg-elevated border border-bg-border rounded-full flex items-center justify-center text-xs font-bold text-text-secondary">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-text-primary text-xs font-medium truncate">
              {user.email}
            </p>
            <p
              className={`text-xs font-semibold ${
                user.role === "premium"
                  ? "text-accent-yellow"
                  : "text-text-muted"
              }`}
            >
              {user.role === "premium" ? "⚡ Premium" : "Free Plan"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-text-muted hover:text-accent-red text-sm rounded-lg hover:bg-accent-red/5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Eye, EyeOff, TrendingUp, Zap } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role: "free" },
          },
        });

        if (error) throw error;

        // Insert user record with free role
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          await supabase.from("users").upsert({
            id: user.id,
            email: user.email,
            role: "free",
            telegram_chat_id: null,
          });
        }

        toast.success("Account created! Check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success("Welcome back!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-green/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-accent-cyan/10 border border-accent-cyan/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent-cyan" />
            </div>
            <span
              className="text-2xl font-bold text-text-primary"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Arbi<span className="text-accent-cyan">Signal</span>
            </span>
          </div>
          <p className="text-text-secondary text-sm">
            Real-time crypto arbitrage alerts
          </p>
        </div>

        {/* Card */}
        <div className="bg-bg-card border border-bg-border rounded-2xl p-8 shadow-2xl glow-cyan">
          <div className="mb-6">
            <h1
              className="text-xl font-semibold text-text-primary mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {isSignUp ? "Create account" : "Welcome back"}
            </h1>
            <p className="text-text-secondary text-sm">
              {isSignUp
                ? "Start catching arbitrage opportunities"
                : "Sign in to your account"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-bg-elevated border border-bg-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full bg-bg-elevated border border-bg-border rounded-lg px-4 py-3 pr-11 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-cyan text-bg-primary font-semibold py-3 rounded-lg hover:bg-accent-cyan/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-bg-primary/30 border-t-bg-primary rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  {isSignUp ? "Create Account" : "Sign In"}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-bg-border text-center">
            <p className="text-text-secondary text-sm">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-accent-cyan hover:text-accent-cyan/80 font-medium transition-colors"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>

        {/* Features teaser */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
            { label: "Live Prices", value: "2 CEXs" },
            { label: "Pairs", value: "BTC/ETH" },
            { label: "Min Spread", value: "0.3%" },
          ].map((item) => (
            <div key={item.label} className="bg-bg-card/50 border border-bg-border rounded-xl p-3">
              <div className="text-accent-cyan font-mono font-semibold text-sm">
                {item.value}
              </div>
              <div className="text-text-muted text-xs mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  // Auto-create user profile if missing
  if (!profile) {
    await supabase.from("users").insert({
      id: user.id,
      email: user.email,
      role: "free",
      telegram_chat_id: null,
    });
  }

  const userProfile = profile || {
    id: user.id,
    email: user.email,
    role: "free",
    telegram_chat_id: null,
  };

  return (
    <div className="min-h-screen bg-bg-primary flex">
      <Sidebar user={userProfile} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar user={userProfile} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

"use client";

import SystemLogs from "@/components/SystemLogs";
import QuickActions from "@/components/QuickActions";
import BottomNav from "@/components/BottomNav";
import ThemeToggle from "@/components/ThemeToggle";

const postAction = async (endpoint: string, apiBase: string) => {
  try {
    await fetch(`${apiBase}${endpoint}`, { method: "POST" });
  } catch {
    // ignore action errors for now
  }
};

export default function SettingsPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? "";

  return (
    <main className="min-h-screen bg-slate-50 p-8 pb-20 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">⚙️ Settings</h1>
          <p className="text-slate-700 dark:text-slate-300">
            Manage your DryGuard system, manual controls, and logs.
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="p-6 rounded-xl shadow-md bg-white mb-8 dark:bg-slate-900">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Manual Controls</h2>
        <QuickActions
          onDeploy={() => postAction("/api/deploy-cover", apiBase)}
          onRetract={() => postAction("/api/retract-cover", apiBase)}
          showReset={false}
          variant="inline"
          confirmActions
        />
      </div>

      <SystemLogs />

      <BottomNav />
    </main>
  );
}

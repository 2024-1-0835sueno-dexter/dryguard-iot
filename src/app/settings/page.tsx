"use client";

import SystemLogs from "@/components/SystemLogs";
import QuickActions from "@/components/QuickActions";
import BottomNav from "@/components/BottomNav";

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
    <main className="min-h-screen bg-gray-50 p-8 pb-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">⚙️ Settings</h1>
      <p className="text-gray-700 mb-8">
        Manage your DryGuard system, manual controls, and logs.
      </p>

      <div className="p-6 rounded-xl shadow-md bg-white mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Manual Controls</h2>
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

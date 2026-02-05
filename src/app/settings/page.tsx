"use client";

import { useState } from "react";
import SystemLogs from "@/components/SystemLogs";
import QuickActions from "@/components/QuickActions";
import BottomNav from "@/components/BottomNav";
import ThemeToggle from "@/components/ThemeToggle";
import Toast from "@/components/Toast";

const postAction = async (endpoint: string, apiBase: string) => {
  try {
    const response = await fetch(`${apiBase}${endpoint}`, { method: "POST" });
    if (!response.ok) {
      return null;
    }
    const payload = (await response.json()) as { message?: string };
    return payload.message ?? null;
  } catch {
    return null;
  }
};

export default function SettingsPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? "";
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(
    null,
  );

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
          onDeploy={async () => {
            const message = await postAction("/api/deploy-cover", apiBase);
            setToast({
              message: message ?? "Action failed. Please try again.",
              type: message ? "success" : "error",
            });
          }}
          onRetract={async () => {
            const message = await postAction("/api/retract-cover", apiBase);
            setToast({
              message: message ?? "Action failed. Please try again.",
              type: message ? "success" : "error",
            });
          }}
          showReset={false}
          variant="inline"
          confirmActions
        />
      </div>

      <SystemLogs />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <BottomNav />
    </main>
  );
}

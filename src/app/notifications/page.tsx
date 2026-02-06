"use client";

import { useEffect, useMemo, useState } from "react";
import NotificationsPanel from "@/components/NotificationsPanel";
import BottomNav from "@/components/BottomNav";
import ThemeToggle from "@/components/ThemeToggle";
import { resolveApiBase } from "@/lib/apiBase";

type NotificationItem = {
  icon: string;
  text: string;
};

export default function NotificationsPage() {
  const [logs, setLogs] = useState<NotificationItem[]>([]);
  const apiBase = useMemo(() => resolveApiBase(), []);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${apiBase}/api/notifications`, { cache: "no-store" });
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as NotificationItem[];
        setLogs(data);
      } catch {
        // ignore fetch errors for now
      }
    };

    fetchLogs();
  }, [apiBase]);

  return (
    <main className="min-h-screen bg-slate-50 p-8 pb-20 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold">⚠️ Notifications</h1>
        <ThemeToggle />
      </div>
      <NotificationsPanel logs={logs.length ? logs : undefined} />

      <BottomNav />
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import NotificationsPanel from "@/components/NotificationsPanel";
import BottomNav from "@/components/BottomNav";

type NotificationItem = {
  icon: string;
  text: string;
};

export default function NotificationsPage() {
  const [logs, setLogs] = useState<NotificationItem[]>([]);
  const apiBase = useMemo(() => process.env.NEXT_PUBLIC_API_BASE ?? "", []);

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
    <main className="min-h-screen bg-gray-50 p-8 pb-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">⚠️ Notifications</h1>
      <NotificationsPanel logs={logs.length ? logs : undefined} />

      <BottomNav />
    </main>
  );
}

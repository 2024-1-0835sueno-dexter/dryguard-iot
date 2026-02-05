"use client";

import NotificationsPanel from "@/components/NotificationsPanel";
import BottomNav from "@/components/BottomNav";

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 pb-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">⚠️ Notifications</h1>
      <NotificationsPanel />

      <BottomNav />
    </main>
  );
}

"use client";

import NotificationsPanel from "@/components/NotificationsPanel";

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 pb-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">⚠️ Notifications</h1>
      <NotificationsPanel />

      <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md flex justify-around py-3">
        <a href="/" className="flex flex-col items-center text-gray-700">
          🏠 <span className="text-xs">Dashboard</span>
        </a>
        <a
          href="/notifications"
          className="flex flex-col items-center text-gray-700"
        >
          ⚠️ <span className="text-xs">Notifications</span>
        </a>
        <a href="/settings" className="flex flex-col items-center text-gray-700">
          ⚙️ <span className="text-xs">Settings</span>
        </a>
      </nav>
    </main>
  );
}

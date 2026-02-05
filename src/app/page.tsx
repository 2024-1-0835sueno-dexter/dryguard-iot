"use client";

import HumidityTrends from "@/components/HumidityTrends";
import RainEvents from "@/components/RainEvents";
import SystemHealth from "@/components/SystemHealth";
import DeviceStatus from "@/components/DeviceStatus";
import Alerts from "@/components/Alerts";
import QuickActions from "@/components/QuickActions";
import RecentActivity from "@/components/RecentActivity";

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🛡️ DryGuard Admin</h1>
      <p className="text-gray-600 mb-8">
        Device Configuration and Monitoring Dashboard
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HumidityTrends />
        <RainEvents />
        <SystemHealth />
        <DeviceStatus />
        <Alerts />
        <QuickActions />
        <RecentActivity />
      </div>
    </main>
  );
}

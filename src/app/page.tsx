"use client";

import { useState } from "react";
import HumidityCard from "@/components/HumidityCard";
import TemperatureCard from "@/components/TemperatureCard";
import QuickActions from "@/components/QuickActions";
import StatusIndicator from "@/components/StatusIndicator";
import NotificationsPanel from "@/components/NotificationsPanel";
import SystemLogs from "@/components/SystemLogs";
import BottomNav from "@/components/BottomNav";

export default function Dashboard() {
  const [coverDeployed, setCoverDeployed] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50 p-8 pb-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        🌧️ DryGuard IoT Dashboard
      </h1>
      <p className="text-gray-600 mb-8">
        Real-time monitoring and control system for your drying protection
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HumidityCard humidity={45} />
        <TemperatureCard temperature={25} />
      </div>

      <QuickActions
        onDeploy={() => setCoverDeployed(true)}
        onRetract={() => setCoverDeployed(false)}
      />
      <StatusIndicator deployed={coverDeployed} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <NotificationsPanel />
        <SystemLogs />
      </div>

      <BottomNav />
    </main>
  );
}

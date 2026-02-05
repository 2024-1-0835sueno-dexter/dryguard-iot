"use client";

import { useEffect, useRef, useState } from "react";
import HumidityTrends from "@/components/HumidityTrends";
import RainEvents from "@/components/RainEvents";
import SystemHealth from "@/components/SystemHealth";
import DeviceStatus from "@/components/DeviceStatus";
import Alerts from "@/components/Alerts";
import QuickActions from "@/components/QuickActions";
import RecentActivity from "@/components/RecentActivity";

type SystemState = {
  humidity: number;
  rainDetected: boolean;
  coverDeployed: boolean;
  online: boolean;
  lastChecked: string;
};

const formatTimestamp = (value?: string) => {
  if (!value) {
    return undefined;
  }

  return new Date(value).toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export default function AdminDashboard() {
  const [system, setSystem] = useState<SystemState | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const fetchSystem = async () => {
    try {
      const response = await fetch("/api/system", { cache: "no-store" });
      if (!response.ok) {
        return;
      }
      const data = (await response.json()) as SystemState;
      setSystem(data);
    } catch {
      // ignore fetch errors for now
    }
  };

  const sendWsAction = (action: "deploy" | "retract" | "reset") => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action }));
    }
  };

  const handleAction = async (
    endpoint: "/api/deploy-cover" | "/api/retract-cover" | "/api/reset-device",
    wsAction: "deploy" | "retract" | "reset",
  ) => {
    try {
      await fetch(endpoint, { method: "POST" });
      await fetchSystem();
    } catch {
      // ignore action errors for now
    }
    sendWsAction(wsAction);
  };

  useEffect(() => {
    fetchSystem();
    const interval = setInterval(fetchSystem, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4001");
    wsRef.current = ws;

    ws.onopen = () => setWsConnected(true);
    ws.onclose = () => setWsConnected(false);
    ws.onerror = () => setWsConnected(false);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as SystemState;
        setSystem(data);
      } catch {
        // ignore malformed messages
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🛡️ DryGuard Admin</h1>
      <p className="text-gray-600 mb-8">
        Device Configuration and Monitoring Dashboard
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Live updates: {wsConnected ? "WebSocket connected" : "Polling API"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HumidityTrends
          humidity={system?.humidity}
          lastUpdated={formatTimestamp(system?.lastChecked)}
        />
        <RainEvents
          rainDetected={system?.rainDetected}
          lastUpdated={formatTimestamp(system?.lastChecked)}
        />
        <SystemHealth
          online={system?.online ?? true}
          lastChecked={formatTimestamp(system?.lastChecked)}
        />
        <DeviceStatus
          laundryOnline={system?.online ?? true}
          outdoorOnline={system ? !system.rainDetected : false}
        />
        <Alerts />
        <QuickActions
          onDeploy={() => handleAction("/api/deploy-cover", "deploy")}
          onRetract={() => handleAction("/api/retract-cover", "retract")}
          onReset={() => handleAction("/api/reset-device", "reset")}
          confirmActions
        />
        <RecentActivity />
      </div>
    </main>
  );
}

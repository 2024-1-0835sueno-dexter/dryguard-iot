"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import HumidityTrends from "@/components/HumidityTrends";
import RainEvents from "@/components/RainEvents";
import SystemHealth from "@/components/SystemHealth";
import DeviceStatus from "@/components/DeviceStatus";
import Alerts from "@/components/Alerts";
import QuickActions from "@/components/QuickActions";
import RecentActivity from "@/components/RecentActivity";
import ThemeToggle from "@/components/ThemeToggle";
import Toast from "@/components/Toast";

type SystemState = {
  humidity: number;
  rainDetected: boolean;
  coverDeployed: boolean;
  online: boolean;
  lastChecked: string;
};

type NotificationItem = {
  icon: string;
  text: string;
};

type ToastState = {
  message: string;
  type?: "success" | "error" | "info";
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
  const [alerts, setAlerts] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activity, setActivity] = useState<string[]>([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const apiBase = useMemo(() => {
    return process.env.NEXT_PUBLIC_API_BASE ?? "";
  }, []);

  const wsUrl = useMemo(() => {
    if (process.env.NEXT_PUBLIC_WS_URL) {
      return process.env.NEXT_PUBLIC_WS_URL;
    }

    if (apiBase.startsWith("http")) {
      return apiBase.replace("https://", "wss://").replace("http://", "ws://");
    }

    return "ws://localhost:4001";
  }, [apiBase]);

  const fetchSystem = async () => {
    try {
      const response = await fetch(`${apiBase}/api/system`, { cache: "no-store" });
      if (!response.ok) {
        return;
      }
      const data = (await response.json()) as SystemState;
      setSystem(data);
    } catch {
      // ignore fetch errors for now
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${apiBase}/api/notifications`, { cache: "no-store" });
      if (!response.ok) {
        return;
      }
      const data = (await response.json()) as NotificationItem[];
      setNotifications(data);
      setAlerts(data.map((item) => item.text));
    } catch {
      // ignore fetch errors for now
    }
  };

  const fetchActivity = async () => {
    try {
      const response = await fetch(`${apiBase}/api/activity`, { cache: "no-store" });
      if (!response.ok) {
        return;
      }
      const data = (await response.json()) as string[];
      setActivity(data);
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
      const response = await fetch(`${apiBase}${endpoint}`, { method: "POST" });
      if (response.ok) {
        const payload = (await response.json()) as { state?: SystemState; message?: string };
        if (payload.state) {
          setSystem(payload.state);
        }
        setToast({
          message: payload.message ?? "Action completed successfully.",
          type: "success",
        });
      } else {
        setToast({ message: "Action failed. Please try again.", type: "error" });
      }
      await fetchSystem();
      await fetchNotifications();
      await fetchActivity();
    } catch {
      setToast({ message: "Action failed. Please try again.", type: "error" });
    }
    sendWsAction(wsAction);
  };

  useEffect(() => {
    fetchSystem();
    fetchNotifications();
    fetchActivity();
    const interval = setInterval(() => {
      fetchSystem();
      fetchNotifications();
      fetchActivity();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
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
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">🛡️ DryGuard Admin</h1>
          <p className="text-slate-700 dark:text-slate-300">
        Device Configuration and Monitoring Dashboard
          </p>
        </div>
        <ThemeToggle />
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
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
        <Alerts alerts={alerts.length ? alerts : undefined} />
        <QuickActions
          onDeploy={() => handleAction("/api/deploy-cover", "deploy")}
          onRetract={() => handleAction("/api/retract-cover", "retract")}
          onReset={() => handleAction("/api/reset-device", "reset")}
          confirmActions
        />
        <RecentActivity activity={activity.length ? activity : undefined} />
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
}

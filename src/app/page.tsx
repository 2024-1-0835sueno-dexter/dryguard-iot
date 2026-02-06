"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import HumidityTrends from "@/components/HumidityTrends";
import RainEvents from "@/components/RainEvents";
import SystemHealth from "@/components/SystemHealth";
import DeviceStatus from "@/components/DeviceStatus";
import Alerts from "@/components/Alerts";
import QuickActions from "@/components/QuickActions";
import RecentActivity from "@/components/RecentActivity";
import Toast from "@/components/Toast";
import { resolveApiBase, resolveWsUrl } from "@/lib/apiBase";
import NavBar from "@/components/NavBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import NotificationsCard from "@/components/NotificationsCard";

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

export default function AdminDashboard() {
  const [system, setSystem] = useState<SystemState | null>(null);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activity, setActivity] = useState<string[]>([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "alerts" | "notifications" | "activity"
  >("all");
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [lastNotificationCount, setLastNotificationCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);

  const apiBase = useMemo(() => resolveApiBase(), []);
  const wsUrl = useMemo(() => resolveWsUrl(apiBase), [apiBase]);

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
      setLastNotificationCount((prev) => {
        if (data.length > prev) {
          setNotificationsRead(false);
        }
        return data.length;
      });
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

  const refreshAll = async () => {
    await fetchSystem();
    await fetchNotifications();
    await fetchActivity();
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
    refreshAll();
    const interval = setInterval(() => {
      refreshAll();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const matchesQuery = (value: string) =>
    !normalizedQuery || value.toLowerCase().includes(normalizedQuery);

  const filteredNotifications = notifications.filter((item) =>
    matchesQuery(`${item.icon} ${item.text}`),
  );
  const filteredAlerts = alerts.filter((item) => matchesQuery(item));
  const filteredActivity = activity.filter((item) => matchesQuery(item));

  const showNotifications = activeFilter === "all" || activeFilter === "notifications";
  const showAlerts = activeFilter === "all" || activeFilter === "alerts";
  const showActivity = activeFilter === "all" || activeFilter === "activity";

  const deviceAlerts = filteredAlerts
    .map((item) => {
      const [label, time] = item.split("—").map((part) => part.trim());
      return { label: label || item, time: time || "" };
    })
    .slice(0, 3);

  useEffect(() => {
    if (!wsUrl) {
      setWsConnected(false);
      return undefined;
    }

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
  }, [wsUrl]);

  return (
    <main className="min-h-screen bg-[#f2f2f2] p-6 text-slate-900">
      <NavBar active="settings" />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Breadcrumbs items={["Dashboard", "Settings", "Device Configuration"]} />
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="rounded-full border border-slate-300 bg-white px-4 py-1 text-sm"
            type="button"
          >
            👤 Admin
          </button>
          <button
            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm text-red-600"
            type="button"
            onClick={() => setToast({ message: "Logged out (demo)", type: "info" })}
          >
            Logout
          </button>
          <Link href="/notifications" className="relative">
            <span className="text-xl">🔔</span>
            {!notificationsRead && notifications.length > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {Math.min(notifications.length, 9)}
              </span>
            )}
          </Link>
          <div className="flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-sm">
            <span className="mr-2">🔍</span>
            <input
              className="w-40 bg-transparent text-sm outline-none"
              placeholder="Search logs, alerts..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <div className="relative">
            <button
              className="rounded-full border border-slate-300 bg-white px-4 py-1 text-sm"
              type="button"
              onClick={() => setFilterOpen((prev) => !prev)}
            >
              Filters ▾
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-10 z-10 w-44 rounded-xl border border-slate-200 bg-white p-2 text-sm shadow-lg">
                {(["all", "alerts", "notifications", "activity"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`w-full rounded-lg px-3 py-2 text-left capitalize ${
                      activeFilter === item ? "bg-slate-100 font-semibold" : ""
                    }`}
                    onClick={() => {
                      setActiveFilter(item);
                      setFilterOpen(false);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs dg-muted">
        Live updates: {wsConnected ? "WebSocket connected" : "Polling API"} | Filter: {activeFilter}
      </p>

      <div className="mt-4 rounded-xl border-2 border-slate-900 bg-white">
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <div className="space-y-6 lg:pr-6 lg:border-r-2 lg:border-slate-900">
            <HumidityTrends
              humidity={system?.humidity}
              lastUpdated={system?.lastChecked}
            />
            <RainEvents
              rainDetected={system?.rainDetected}
              lastUpdated={system?.lastChecked}
            />
            <SystemHealth
              online={system?.online ?? true}
              lastChecked={system?.lastChecked}
            />
            {showNotifications && (
              <NotificationsCard
                logs={
                  notifications.length
                    ? notificationsRead
                      ? []
                      : filteredNotifications
                    : undefined
                }
                onMarkAllRead={() => {
                  setNotificationsRead(true);
                  setToast({ message: "All notifications marked as read.", type: "success" });
                }}
              />
            )}
          </div>
          <div className="space-y-6">
            <DeviceStatus
              laundryOnline={system?.online ?? true}
              outdoorOnline={system ? !system.rainDetected : false}
              alerts={deviceAlerts.length ? deviceAlerts : undefined}
              onRefresh={refreshAll}
            />
            {showAlerts && (
              <Alerts alerts={alerts.length ? filteredAlerts : undefined} />
            )}
            <QuickActions
              onDeploy={() => handleAction("/api/deploy-cover", "deploy")}
              onRetract={() => handleAction("/api/retract-cover", "retract")}
              onReset={() => handleAction("/api/reset-device", "reset")}
              confirmActions
            />
            {showActivity && (
              <RecentActivity activity={activity.length ? filteredActivity : undefined} />
            )}
          </div>
        </div>
      </div>

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <span>© 2026 DryGuard Systems | Version 1.2.3</span>
        <span>Privacy Policy | Help | Contact Support</span>
      </footer>

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

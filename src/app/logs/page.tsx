"use client";
import NavBar from "@/components/NavBar";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function LogsPage() {
  return (
    <main className="min-h-screen bg-[#f2f2f2] p-6 text-slate-900">
      <NavBar active="logs" />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Breadcrumbs items={["Dashboard", "Logs"]} />
      </div>
      <div className="mt-4 rounded-xl border-2 border-slate-900 bg-white p-6">
        <h1 className="text-xl font-semibold">System Logs</h1>
        <p className="mt-2 text-sm dg-muted">
          Logs are available on the Settings page and the realtime dashboard.
        </p>
      </div>
    </main>
  );
}

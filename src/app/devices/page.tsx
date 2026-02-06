"use client";
import NavBar from "@/components/NavBar";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function DevicesPage() {
  return (
    <main className="min-h-screen bg-[#f2f2f2] p-6 text-slate-900">
      <NavBar active="devices" />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Breadcrumbs items={["Dashboard", "Devices"]} />
      </div>
      <div className="mt-4 rounded-xl border-2 border-slate-900 bg-white p-6">
        <h1 className="text-xl font-semibold">Devices</h1>
        <p className="mt-2 text-sm dg-muted">
          Device management will appear here once you add ESP32 nodes.
        </p>
      </div>
    </main>
  );
}

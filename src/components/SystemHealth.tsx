interface SystemHealthProps {
  online?: boolean;
  lastChecked?: string;
}

export default function SystemHealth({ online = true, lastChecked }: SystemHealthProps) {
  const systemClass = online ? "bg-emerald-600" : "bg-red-500";
  return (
    <div className="dg-card">
      <h2 className="dg-card-title">System Health</h2>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-full bg-emerald-600 px-4 py-2 text-white">
          📶 Wi-Fi: Connected
        </span>
        <span className={`rounded-full px-4 py-2 text-white ${systemClass}`}>
          💻 System: {online ? "Online" : "Offline"}
        </span>
        <span className="rounded-full bg-slate-200 px-4 py-2 text-slate-700">
          Last checked: {lastChecked ?? "08:38 AM"}
        </span>
      </div>
    </div>
  );
}

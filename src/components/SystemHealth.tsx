interface SystemHealthProps {
  online?: boolean;
  lastChecked?: string;
}

export default function SystemHealth({ online = true, lastChecked }: SystemHealthProps) {
  return (
    <div className="p-6 rounded-xl shadow-md bg-white dark:bg-slate-900">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">System Health</h2>
      <p className="text-slate-700 dark:text-slate-200">✅ Wi-Fi: Connected</p>
      <p className="text-slate-700 dark:text-slate-200">💻 System: {online ? "Online" : "Offline"}</p>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Last checked: {lastChecked ?? "08:38 AM"}
      </p>
    </div>
  );
}

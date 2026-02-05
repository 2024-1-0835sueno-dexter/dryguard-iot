export default function SystemLogs() {
  const logs = [
    { icon: "🌧️", text: "Jan 27 – Rain detected" },
    { icon: "🛡️", text: "Jan 27 – Cover deployed" },
    { icon: "🌤️", text: "Jan 28 – Sunny, cover retracted" },
  ];

  return (
    <div className="p-6 rounded-xl shadow-md bg-white dark:bg-slate-900">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">System Logs</h2>
      <ul className="space-y-2">
        {logs.map((log, idx) => (
          <li key={idx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <span>{log.icon}</span>
            <span>{log.text}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-sm text-slate-600 dark:text-slate-400">
        ✅ Wi-Fi: Connected <br />
        💻 System: Online
      </div>
    </div>
  );
}

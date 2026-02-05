export default function SystemLogs() {
  const logs = [
    { icon: "🌧️", text: "Jan 27 – Rain detected" },
    { icon: "🛡️", text: "Jan 27 – Cover deployed" },
    { icon: "🌤️", text: "Jan 28 – Sunny, cover retracted" },
  ];

  return (
    <div className="dg-card">
      <h2 className="dg-card-title">System Logs</h2>
      <ul className="space-y-2">
        {logs.map((log, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm">
            <span>{log.icon}</span>
            <span>{log.text}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-sm dg-muted">
        ✅ Wi-Fi: Connected <br />
        💻 System: Online
      </div>
    </div>
  );
}

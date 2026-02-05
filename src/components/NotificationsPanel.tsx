export default function NotificationsPanel() {
  const logs = [
    { icon: "⚠️", text: "Rain detected at 2:15 PM" },
    { icon: "✅", text: "Cover deployed successfully" },
    { icon: "🟩", text: "Clothesline uncovered at 4:30 PM" },
  ];

  return (
    <div className="p-6 rounded-xl shadow-md bg-white">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Notifications</h2>
      <ul className="space-y-2">
        {logs.map((log, idx) => (
          <li key={idx} className="flex items-center gap-2 text-gray-700">
            <span>{log.icon}</span>
            <span>{log.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface NotificationItem {
  icon: string;
  text: string;
}

interface NotificationsPanelProps {
  logs?: NotificationItem[];
}

export default function NotificationsPanel({
  logs = [
    { icon: "⚠️", text: "Rain detected at 2:15 PM" },
    { icon: "✅", text: "Cover deployed successfully" },
    { icon: "🟩", text: "Clothesline uncovered at 4:30 PM" },
  ],
}: NotificationsPanelProps) {

  return (
    <div className="p-6 rounded-xl shadow-md bg-white dark:bg-slate-900">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Notifications</h2>
      <ul className="space-y-2">
        {logs.map((log, idx) => (
          <li key={idx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <span>{log.icon}</span>
            <span>{log.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

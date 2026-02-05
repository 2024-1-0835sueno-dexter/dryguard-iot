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
    <div className="dg-card">
      <h2 className="dg-card-title">Notifications</h2>
      <ul className="space-y-2">
        {logs.map((log, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm">
            <span>{log.icon}</span>
            <span>{log.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

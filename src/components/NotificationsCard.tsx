import Link from "next/link";

interface NotificationItem {
  icon: string;
  text: string;
}

interface NotificationsCardProps {
  logs?: NotificationItem[];
}

export default function NotificationsCard({
  logs = [
    { icon: "⚠️", text: "Rain detected — 2:15 PM" },
    { icon: "⚠️", text: "At risk — 2:30 PM" },
    { icon: "⚠️", text: "Drying — 4:30 PM" },
  ],
}: NotificationsCardProps) {
  return (
    <div className="dg-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="dg-card-title mb-0">Notifications</h2>
        <button className="dg-pill border border-slate-300 bg-white text-slate-700">
          Mark all as read
        </button>
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        {logs.map((log, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span>{log.icon}</span>
            <span>{log.text}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/notifications"
        className="mt-5 inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
      >
        View All Notifications
      </Link>
    </div>
  );
}

import Link from "next/link";

interface AlertsProps {
  alerts?: string[];
}

export default function Alerts({
  alerts = [
    "Rain detected — 2:15 PM",
    "At risk — 2:30 PM",
    "Drying — 4:30 PM",
  ],
}: AlertsProps) {
  return (
    <div className="dg-card">
      <h2 className="dg-card-title">Alerts</h2>
      <ul className="space-y-2 text-sm">
        {alerts.map((a, i) => (
          <li key={i} className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
              {a.split("—")[0]?.trim() ?? a}
            </span>
            <span className="dg-muted">{a.split("—")[1]?.trim() ?? ""}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/notifications"
        className="mt-4 inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-1 text-sm"
      >
        View All
      </Link>
    </div>
  );
}

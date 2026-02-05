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
      <ul className="space-y-2">
        {alerts.map((a, i) => (
          <li key={i} className="text-sm">⚠️ {a}</li>
        ))}
      </ul>
      <Link
        href="/notifications"
        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        View All
      </Link>
    </div>
  );
}

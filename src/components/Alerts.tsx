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
    <div className="p-6 rounded-xl shadow-md bg-white">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Alerts</h2>
      <ul className="space-y-2">
        {alerts.map((a, i) => (
          <li key={i} className="text-gray-700">⚠️ {a}</li>
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

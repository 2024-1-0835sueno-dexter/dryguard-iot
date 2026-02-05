interface HumidityTrendsProps {
  humidity?: number;
  lastUpdated?: string;
}

export default function HumidityTrends({ humidity, lastUpdated }: HumidityTrendsProps) {
  return (
    <div className="p-6 rounded-xl shadow-md bg-white dark:bg-slate-900">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Humidity Trends</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">{lastUpdated ?? "08:38 AM | Wed, Jan 28, 2026"}</p>
      {humidity !== undefined && (
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Current humidity: {humidity}%</p>
      )}
      <ul className="mt-4 space-y-2">
        <li className="text-blue-700">0–59%: Safe – good drying</li>
        <li className="text-yellow-700">60–80%: Caution – drying slows</li>
        <li className="text-red-700">81–100%: Risk – dampness/mildew</li>
      </ul>
    </div>
  );
}

interface HumidityTrendsProps {
  humidity?: number;
  lastUpdated?: string;
}

export default function HumidityTrends({ humidity, lastUpdated }: HumidityTrendsProps) {
  return (
    <div className="dg-card">
      <h2 className="dg-card-title">Humidity Trends</h2>
      <p className="text-sm dg-muted">{lastUpdated ?? "08:38 AM | Wed, Jan 28, 2026"}</p>
      {humidity !== undefined && (
        <p className="mt-2 text-sm">Current humidity: {humidity}%</p>
      )}
      <ul className="mt-4 space-y-2">
        <li className="text-blue-700">0–59%: Safe – good drying</li>
        <li className="text-yellow-700">60–80%: Caution – drying slows</li>
        <li className="text-red-700">81–100%: Risk – dampness/mildew</li>
      </ul>
    </div>
  );
}

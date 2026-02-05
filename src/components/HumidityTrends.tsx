interface HumidityTrendsProps {
  humidity?: number;
  lastUpdated?: string;
}

const getHumidityStatus = (value?: number) => {
  if (value === undefined) {
    return null;
  }
  if (value > 80) {
    return { label: "Risk", className: "bg-rose-500/15 text-rose-400" };
  }
  if (value >= 60) {
    return { label: "Caution", className: "bg-amber-500/15 text-amber-400" };
  }
  return { label: "Safe", className: "bg-sky-500/15 text-sky-400" };
};

export default function HumidityTrends({ humidity, lastUpdated }: HumidityTrendsProps) {
  const status = getHumidityStatus(humidity);
  return (
    <div className="dg-card">
      <h2 className="dg-card-title">Humidity Trends</h2>
      <p className="text-sm dg-muted">{lastUpdated ?? "08:38 AM | Wed, Jan 28, 2026"}</p>
      {humidity !== undefined && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p className="text-sm">Current humidity: {humidity}%</p>
          {status && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors ${status.className}`}
            >
              {status.label}
            </span>
          )}
        </div>
      )}
      <ul className="mt-4 space-y-2">
        <li className="text-blue-700">0–59%: Safe – good drying</li>
        <li className="text-yellow-700">60–80%: Caution – drying slows</li>
        <li className="text-red-700">81–100%: Risk – dampness/mildew</li>
      </ul>
    </div>
  );
}

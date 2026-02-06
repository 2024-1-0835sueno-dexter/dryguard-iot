interface HumidityTrendsProps {
  humidity?: number;
  lastUpdated?: string;
}

export default function HumidityTrends({ humidity, lastUpdated }: HumidityTrendsProps) {
  return (
    <div className="dg-card">
      <h2 className="dg-card-title">Humidity Trends</h2>
      <p className="text-sm dg-muted">🕒 {lastUpdated ?? "08:38 AM"} | 📅 Wed, Jan 28, 2026</p>
      {humidity !== undefined && (
        <p className="mt-2 text-sm dg-muted">Current humidity: {humidity}%</p>
      )}
      <div className="mt-4 space-y-3 text-sm font-semibold text-slate-900">
        <div className="rounded-full bg-blue-600 px-4 py-2 text-white">
          0-59% - Safe - low moisture, good drying conditions
        </div>
        <div className="rounded-full bg-amber-400 px-4 py-2 text-slate-900">
          60-80% - Caution - moderate humidity, drying slows down
        </div>
        <div className="rounded-full bg-red-500 px-4 py-2 text-white">
          81-100% - Risk - high moisture, laundry at risk of dampness or mildew
        </div>
      </div>
    </div>
  );
}

interface RainEventsProps {
  rainDetected?: boolean;
  lastUpdated?: string;
}

export default function RainEvents({ rainDetected, lastUpdated }: RainEventsProps) {
  return (
    <div className="p-6 rounded-xl shadow-md bg-white dark:bg-slate-900">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Rain Events</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">{lastUpdated ?? "08:38 AM | Wed, Jan 28, 2026"}</p>
      {rainDetected !== undefined && (
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          Status: {rainDetected ? "Rain detected" : "No rain detected"}
        </p>
      )}
      <div className="flex gap-4 mt-4">
        <span>☁️ Cloudy</span>
        <span>🌩️ Thunderstorm</span>
        <span>🌧️ Rain</span>
      </div>
    </div>
  );
}

interface RainEventsProps {
  rainDetected?: boolean;
  lastUpdated?: string;
}

export default function RainEvents({ rainDetected, lastUpdated }: RainEventsProps) {
  return (
    <div className="dg-card">
      <h2 className="dg-card-title">Rain Events</h2>
      <p className="text-sm dg-muted">🕒 {lastUpdated ?? "08:38 AM"} | 📅 Wed, Jan 28, 2026</p>
      {rainDetected !== undefined && (
        <p className="mt-2 text-sm dg-muted">
          Status: {rainDetected ? "Rain detected" : "No rain detected"}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-2xl">
        <span>🌧️</span>
        <span>🌧️</span>
        <span>⛈️</span>
        <span>🌧️</span>
        <span>🌧️</span>
        <span>🌧️</span>
      </div>
    </div>
  );
}

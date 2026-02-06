interface RainEventsProps {
  rainDetected?: boolean;
  lastUpdated?: string;
}

const formatTime = (value?: string) => {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (value?: string) => {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function RainEvents({ rainDetected, lastUpdated }: RainEventsProps) {
  return (
    <div className="dg-card">
      <h2 className="dg-card-title">Rain Events</h2>
      <p className="text-sm dg-muted">
        🕒 {formatTime(lastUpdated)} | 📅 {formatDate(lastUpdated)}
      </p>
      {rainDetected !== undefined && (
        <p className="mt-2 text-sm dg-muted">
          Status: {rainDetected ? "Rain detected" : "Cloudy"}
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

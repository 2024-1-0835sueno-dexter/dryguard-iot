interface DeviceStatusProps {
  laundryOnline?: boolean;
  outdoorOnline?: boolean;
  alerts?: { label: string; time: string }[];
}

const defaultAlerts = [
  { label: "Rain detected", time: "2:15 PM" },
  { label: "At risk", time: "2:30 PM" },
  { label: "Drying", time: "4:30 PM" },
];

export default function DeviceStatus({
  laundryOnline = true,
  outdoorOnline = false,
  alerts = defaultAlerts,
}: DeviceStatusProps) {
  return (
    <div className="dg-card">
      <div className="flex items-center justify-between">
        <h2 className="dg-card-title mb-0">Device Status</h2>
        <button
          type="button"
          className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm"
          aria-label="Refresh status"
        >
          🔄
        </button>
      </div>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          <span>Online</span>
        </div>
        <div className={`flex items-center gap-2 ${laundryOnline ? "" : "text-slate-600"}`}>
          <span className={`h-3 w-3 rounded-full ${laundryOnline ? "bg-emerald-500" : "bg-red-500"}`} />
          <span>Laundry Sensor</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span>Offline</span>
        </div>
        <div className={`flex items-center gap-2 ${outdoorOnline ? "" : "text-slate-600"}`}>
          <span className={`h-3 w-3 rounded-full ${outdoorOnline ? "bg-emerald-500" : "bg-red-500"}`} />
          <span>Outdoor Sensor</span>
        </div>
      </div>
      <div className="mt-5">
        <h3 className="text-sm font-semibold">Alerts</h3>
        <div className="mt-3 space-y-2 text-sm">
          {alerts.map((alert) => (
            <div key={`${alert.label}-${alert.time}`} className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
                {alert.label}
              </span>
              <span className="dg-muted">{alert.time}</span>
            </div>
          ))}
        </div>
        <button className="mt-4 rounded-full border border-slate-300 bg-white px-4 py-1 text-sm">
          View All
        </button>
      </div>
    </div>
  );
}

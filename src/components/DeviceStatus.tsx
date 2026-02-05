interface DeviceStatusProps {
  laundryOnline?: boolean;
  outdoorOnline?: boolean;
}

export default function DeviceStatus({ laundryOnline = true, outdoorOnline = false }: DeviceStatusProps) {
  return (
    <div className="p-6 rounded-xl shadow-md bg-white dark:bg-slate-900">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Device Status</h2>
      <p className="text-green-600">🟢 Online</p>
      <p className="text-red-600">🔴 Offline</p>
      <p className={laundryOnline ? "text-green-600" : "text-red-600"}>
        {laundryOnline ? "🟢" : "🔴"} Laundry Sensor
      </p>
      <p className={outdoorOnline ? "text-green-600" : "text-red-600"}>
        {outdoorOnline ? "🟢" : "🔴"} Outdoor Sensor
      </p>
    </div>
  );
}

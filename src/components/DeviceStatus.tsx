export default function DeviceStatus() {
  return (
    <div className="p-6 rounded-xl shadow-md bg-white">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Device Status</h2>
      <p className="text-green-600">🟢 Online</p>
      <p className="text-red-600">🔴 Offline</p>
      <p className="text-green-600">🟢 Laundry Sensor</p>
      <p className="text-red-600">🔴 Outdoor Sensor</p>
    </div>
  );
}

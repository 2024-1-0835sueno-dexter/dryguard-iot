export default function RainEvents() {
  return (
    <div className="p-6 rounded-xl shadow-md bg-white">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Rain Events</h2>
      <p className="text-sm text-gray-500">08:38 AM | Wed, Jan 28, 2026</p>
      <div className="flex gap-4 mt-4">
        <span>☁️ Cloudy</span>
        <span>🌩️ Thunderstorm</span>
        <span>🌧️ Rain</span>
      </div>
    </div>
  );
}

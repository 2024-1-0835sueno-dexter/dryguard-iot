export default function RecentActivity() {
  const activity = [
    "Jan 27 – Rain detected",
    "Jan 27 – Cover deployed",
    "Jan 28 – Sunny, cover retracted",
  ];

  return (
    <div className="p-6 rounded-xl shadow-md bg-white">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
      <ul className="space-y-2">
        {activity.map((a, i) => (
          <li key={i} className="text-gray-700">📅 {a}</li>
        ))}
      </ul>
    </div>
  );
}

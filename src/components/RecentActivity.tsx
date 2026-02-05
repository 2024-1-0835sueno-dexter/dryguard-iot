interface RecentActivityProps {
  activity?: string[];
}

export default function RecentActivity({
  activity = [
    "Jan 27 – Rain detected",
    "Jan 27 – Cover deployed",
    "Jan 28 – Sunny, cover retracted",
  ],
}: RecentActivityProps) {

  return (
    <div className="p-6 rounded-xl shadow-md bg-white dark:bg-slate-900">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Recent Activity</h2>
      <ul className="space-y-2">
        {activity.map((a, i) => (
          <li key={i} className="text-slate-700 dark:text-slate-300">📅 {a}</li>
        ))}
      </ul>
    </div>
  );
}

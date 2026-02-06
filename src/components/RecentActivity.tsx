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
    <div className="dg-card">
      <h2 className="dg-card-title">Recent Activity</h2>
      <ul className="space-y-2 text-sm">
        {activity.map((a, i) => (
          <li key={i} className="flex items-center gap-2">
            <span>📅</span>
            <span>{a}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

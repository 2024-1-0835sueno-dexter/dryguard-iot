interface HumidityCardProps {
  humidity: number;
}

export default function HumidityCard({ humidity }: HumidityCardProps) {
  let status = "Safe";
  let statusColor = "text-green-600";
  
  if (humidity >= 60 && humidity <= 80) {
    status = "Caution";
    statusColor = "text-yellow-600";
  }
  if (humidity > 80) {
    status = "Risk";
    statusColor = "text-red-600";
  }

  return (
    <div className="p-6 border border-gray-300 rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-2">Humidity: {humidity}%</h2>
      <p className={`text-lg font-semibold ${statusColor}`}>Status: {status}</p>
    </div>
  );
}

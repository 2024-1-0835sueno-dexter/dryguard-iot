interface HumidityCardProps {
  humidity: number;
}

export default function HumidityCard({ humidity }: HumidityCardProps) {
  let status = "Safe";
  let color = "bg-blue-100 text-blue-700";

  if (humidity >= 60 && humidity <= 80) {
    status = "Caution";
    color = "bg-yellow-100 text-yellow-700";
  }
  if (humidity > 80) {
    status = "Risk";
    color = "bg-red-100 text-red-700";
  }

  return (
    <div className={`p-6 rounded-xl shadow-md ${color}`}>
      <h2 className="text-xl font-bold">Humidity: {humidity}%</h2>
      <p className="mt-2 font-medium">Status: {status}</p>
    </div>
  );
}

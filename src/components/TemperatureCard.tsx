interface TemperatureCardProps {
  temperature: number;
}

export default function TemperatureCard({ temperature }: TemperatureCardProps) {
  let status = "Normal";
  let statusColor = "text-green-600";
  
  if (temperature > 30) {
    status = "High";
    statusColor = "text-red-600";
  } else if (temperature < 15) {
    status = "Low";
    statusColor = "text-blue-600";
  }

  return (
    <div className="p-6 border border-gray-300 rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-2">Temperature: {temperature}°C</h2>
      <p className={`text-lg font-semibold ${statusColor}`}>Status: {status}</p>
    </div>
  );
}

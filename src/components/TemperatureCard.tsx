interface TemperatureCardProps {
  temperature: number;
}

export default function TemperatureCard({ temperature }: TemperatureCardProps) {
  let status = "Normal";
  let color = "bg-green-100 text-green-700";

  if (temperature > 30) {
    status = "Hot";
    color = "bg-orange-100 text-orange-700";
  }
  if (temperature < 15) {
    status = "Cold";
    color = "bg-blue-100 text-blue-700";
  }

  return (
    <div className={`p-6 rounded-xl shadow-md ${color}`}>
      <h2 className="text-xl font-bold">Temperature: {temperature}°C</h2>
      <p className="mt-2 font-medium">Status: {status}</p>
    </div>
  );
}

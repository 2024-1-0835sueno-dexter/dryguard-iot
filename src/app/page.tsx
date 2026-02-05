"use client";

import { useState } from "react";
import HumidityCard from "@/components/HumidityCard";
import TemperatureCard from "@/components/TemperatureCard";
import QuickActions from "@/components/QuickActions";
import StatusIndicator from "@/components/StatusIndicator";

export default function Home() {
  const [humidity, setHumidity] = useState(45);
  const [temperature, setTemperature] = useState(25);
  const [coverDeployed, setCoverDeployed] = useState(false);

  const handleDeploy = () => {
    setCoverDeployed(true);
    // Here you would send command to IoT device
    console.log("Deploying cover...");
  };

  const handleRetract = () => {
    setCoverDeployed(false);
    // Here you would send command to IoT device
    console.log("Retracting cover...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <main className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🌧️ DryGuard IoT Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time monitoring and control system for your drying protection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <HumidityCard humidity={humidity} />
          <TemperatureCard temperature={temperature} />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <QuickActions
            onDeploy={handleDeploy}
            onRetract={handleRetract}
            coverDeployed={coverDeployed}
          />
          <StatusIndicator coverDeployed={coverDeployed} />
        </div>
      </main>
    </div>
  );
}

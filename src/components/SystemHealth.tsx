interface SystemHealthProps {
  online?: boolean;
  lastChecked?: string;
}

export default function SystemHealth({ online = true, lastChecked }: SystemHealthProps) {
  return (
    <div className="p-6 rounded-xl shadow-md bg-white">
      <h2 className="text-xl font-bold text-gray-800 mb-4">System Health</h2>
      <p>✅ Wi-Fi: Connected</p>
      <p>💻 System: {online ? "Online" : "Offline"}</p>
      <p className="text-sm text-gray-500">
        Last checked: {lastChecked ?? "08:38 AM"}
      </p>
    </div>
  );
}

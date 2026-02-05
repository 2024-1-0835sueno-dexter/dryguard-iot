interface SystemHealthProps {
  online?: boolean;
  lastChecked?: string;
}

export default function SystemHealth({ online = true, lastChecked }: SystemHealthProps) {
  return (
    <div className="dg-card">
      <h2 className="dg-card-title">System Health</h2>
      <p>✅ Wi-Fi: Connected</p>
      <p>💻 System: {online ? "Online" : "Offline"}</p>
      <p className="text-sm dg-muted">
        Last checked: {lastChecked ?? "08:38 AM"}
      </p>
    </div>
  );
}

interface QuickActionsProps {
  onDeploy?: () => void;
  onRetract?: () => void;
  onReset?: () => void;
  showReset?: boolean;
  variant?: "card" | "inline";
}

export default function QuickActions({
  onDeploy,
  onRetract,
  onReset,
  showReset = true,
  variant = "card",
}: QuickActionsProps) {
  const content = (
    <div className="flex gap-4">
      <button
        onClick={onDeploy}
        className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
      >
        Deploy Cover
      </button>
      <button
        onClick={onRetract}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Retract Cover
      </button>
      {showReset && (
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700"
        >
          Reset Device
        </button>
      )}
    </div>
  );

  if (variant === "inline") {
    return <div className="mt-4">{content}</div>;
  }

  return (
    <div className="p-6 rounded-xl shadow-md bg-white">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
      {content}
    </div>
  );
}

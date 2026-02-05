interface QuickActionsProps {
  onDeploy: () => void;
  onRetract: () => void;
  coverDeployed: boolean;
}

export default function QuickActions({ onDeploy, onRetract, coverDeployed }: QuickActionsProps) {
  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-xl font-semibold mb-3">Quick Actions</h3>
      <div className="flex gap-4">
        <button
          onClick={onDeploy}
          disabled={coverDeployed}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            coverDeployed
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          Deploy Cover
        </button>
        <button
          onClick={onRetract}
          disabled={!coverDeployed}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            !coverDeployed
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Retract Cover
        </button>
      </div>
    </div>
  );
}

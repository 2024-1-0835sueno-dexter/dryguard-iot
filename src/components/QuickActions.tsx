interface QuickActionsProps {
  onDeploy: () => void;
  onRetract: () => void;
}

export default function QuickActions({ onDeploy, onRetract }: QuickActionsProps) {
  return (
    <div className="flex gap-4 mt-6">
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
    </div>
  );
}

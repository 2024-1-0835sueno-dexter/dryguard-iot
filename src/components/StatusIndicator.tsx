interface StatusIndicatorProps {
  coverDeployed: boolean;
}

export default function StatusIndicator({ coverDeployed }: StatusIndicatorProps) {
  return (
    <div className="mt-6 p-4 border-2 border-gray-300 rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Cover Status</h3>
      <div className="flex items-center gap-3">
        <div
          className={`w-4 h-4 rounded-full ${
            coverDeployed ? "bg-green-500" : "bg-gray-400"
          }`}
        />
        <span className="text-xl font-bold">
          {coverDeployed ? "Deployed" : "Retracted"}
        </span>
      </div>
    </div>
  );
}

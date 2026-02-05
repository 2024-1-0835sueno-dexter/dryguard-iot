interface StatusIndicatorProps {
  deployed: boolean;
}

export default function StatusIndicator({ deployed }: StatusIndicatorProps) {
  return (
    <div className="mt-4 p-4 rounded-lg shadow bg-gray-100">
      <p className="font-semibold">
        Cover Status: {deployed ? "🟩 Deployed" : "⬜ Retracted"}
      </p>
    </div>
  );
}

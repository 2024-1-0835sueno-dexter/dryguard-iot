"use client";

import { useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";

interface QuickActionsProps {
  onDeploy?: () => void;
  onRetract?: () => void;
  onReset?: () => void;
  showReset?: boolean;
  variant?: "card" | "inline";
  confirmActions?: boolean;
}

type ActionType = "deploy" | "retract" | "reset" | null;

export default function QuickActions({
  onDeploy,
  onRetract,
  onReset,
  showReset = true,
  variant = "card",
  confirmActions = false,
}: QuickActionsProps) {
  const [pendingAction, setPendingAction] = useState<ActionType>(null);

  const triggerAction = (action: ActionType) => {
    if (!action) {
      return;
    }

    if (action === "deploy") {
      onDeploy?.();
    }
    if (action === "retract") {
      onRetract?.();
    }
    if (action === "reset") {
      onReset?.();
    }

    setPendingAction(null);
  };
  const content = (
    <div className="flex gap-4">
      <button
        onClick={() => (confirmActions ? setPendingAction("deploy") : onDeploy?.())}
        className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
      >
        Deploy Cover
      </button>
      <button
        onClick={() => (confirmActions ? setPendingAction("retract") : onRetract?.())}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Retract Cover
      </button>
      {showReset && (
        <button
          onClick={() => (confirmActions ? setPendingAction("reset") : onReset?.())}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700"
        >
          Reset Device
        </button>
      )}
    </div>
  );

  const modalTitle =
    pendingAction === "deploy"
      ? "Deploy cover?"
      : pendingAction === "retract"
        ? "Retract cover?"
        : "Reset device?";

  const modalMessage =
    pendingAction === "deploy"
      ? "This will deploy the protective cover immediately."
      : pendingAction === "retract"
        ? "This will retract the protective cover immediately."
        : "This will reset the device and clear temporary state.";

  if (variant === "inline") {
    return (
      <div className="mt-4">
        {content}
        <ConfirmModal
          open={confirmActions && pendingAction !== null}
          title={modalTitle}
          message={modalMessage}
          confirmLabel="Confirm"
          cancelLabel="Cancel"
          onConfirm={() => triggerAction(pendingAction)}
          onCancel={() => setPendingAction(null)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl shadow-md bg-white dark:bg-slate-900">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Quick Actions</h2>
      {content}
      <ConfirmModal
        open={confirmActions && pendingAction !== null}
        title={modalTitle}
        message={modalMessage}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={() => triggerAction(pendingAction)}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
}

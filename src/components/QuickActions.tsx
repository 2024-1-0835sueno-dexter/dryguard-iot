"use client";

import { useState } from "react";

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
    <div className="flex flex-wrap items-center gap-4">
      <button
        onClick={() => (confirmActions ? setPendingAction("deploy") : onDeploy?.())}
        className="dg-pill bg-emerald-600 text-white"
      >
        Deploy Cover
      </button>
      <button
        onClick={() => (confirmActions ? setPendingAction("retract") : onRetract?.())}
        className="dg-pill bg-blue-600 text-white"
      >
        Retract Cover
      </button>
      {showReset && (
        <button
          onClick={() => (confirmActions ? setPendingAction("reset") : onReset?.())}
          className="dg-pill bg-slate-600 text-white"
        >
          Reset Device
        </button>
      )}
    </div>
  );

  const inlineConfirm = confirmActions && pendingAction !== null;
  const actionLabel =
    pendingAction === "deploy"
      ? "Deploy cover?"
      : pendingAction === "retract"
        ? "Retract cover?"
        : "Reset device?";

  const confirmRow = inlineConfirm ? (
    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
      <span className="rounded-full bg-slate-200 px-4 py-1">Are you sure?</span>
      <button
        onClick={() => triggerAction(pendingAction)}
        className="dg-pill bg-emerald-600 text-white"
      >
        Confirm
      </button>
      <button
        onClick={() => setPendingAction(null)}
        className="dg-pill bg-red-500 text-white"
      >
        Cancel
      </button>
      <span className="dg-muted">{actionLabel}</span>
    </div>
  ) : null;

  if (variant === "inline") {
    return (
      <div className="mt-4">
        {content}
        {confirmRow}
      </div>
    );
  }

  return (
    <div className="dg-card">
      <h2 className="dg-card-title">Quick Actions</h2>
      {content}
      {confirmRow}
    </div>
  );
}

import { cn } from "@/lib/utils";

type StatusType = "initializing" | "ready" | "detecting" | "recognized" | "error" | "denied" | "idle";

const STATUS_CONFIG: Record<StatusType, { label: string; colorClass: string }> = {
  initializing: { label: "Initializing...", colorClass: "bg-status-warning animate-pulse-dot" },
  ready: { label: "Ready", colorClass: "bg-status-success" },
  detecting: { label: "Detecting hand...", colorClass: "bg-status-warning animate-pulse-dot" },
  recognized: { label: "Gesture recognized", colorClass: "bg-status-success" },
  idle: { label: "Waiting for gesture", colorClass: "bg-muted-foreground" },
  error: { label: "Camera error", colorClass: "bg-status-error" },
  denied: { label: "Camera access denied", colorClass: "bg-status-error" },
};

interface StatusIndicatorProps {
  cameraStatus: "initializing" | "ready" | "error" | "denied";
  detectionStatus: "idle" | "detecting" | "recognized";
}

export function StatusIndicator({ cameraStatus, detectionStatus }: StatusIndicatorProps) {
  const status: StatusType =
    cameraStatus !== "ready" ? cameraStatus : detectionStatus;
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-2 w-2 rounded-full", config.colorClass)} />
      <span className="text-sm text-muted-foreground">{config.label}</span>
    </div>
  );
}

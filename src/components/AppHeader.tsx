import { Hand } from "lucide-react";
import { StatusIndicator } from "./StatusIndicator";

interface AppHeaderProps {
  cameraStatus: "initializing" | "ready" | "error" | "denied";
  detectionStatus: "idle" | "detecting" | "recognized";
}

export function AppHeader({ cameraStatus, detectionStatus }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Hand className="h-5 w-5 text-primary" />
        <h1 className="text-base font-semibold text-foreground tracking-tight">
          Sign Translator
        </h1>
        <span className="text-xs text-muted-foreground">MVP</span>
      </div>
      <StatusIndicator cameraStatus={cameraStatus} detectionStatus={detectionStatus} />
    </header>
  );
}

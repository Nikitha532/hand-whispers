import { forwardRef } from "react";
import { Pause, Play, Camera } from "lucide-react";
import { TranslationOverlay } from "./TranslationOverlay";

interface CameraFeedProps {
  gesture: string | null;
  confidence: number;
  isPaused: boolean;
  onTogglePause: () => void;
  cameraStatus: string;
}

export const CameraFeed = forwardRef<HTMLVideoElement, CameraFeedProps>(
  ({ gesture, confidence, isPaused, onTogglePause, cameraStatus }, ref) => {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-lg outline outline-1 outline-border">
        {cameraStatus === "initializing" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-surface">
            <Camera className="h-8 w-8 text-muted-foreground animate-pulse" />
            <p className="text-sm text-muted-foreground">Initializing camera...</p>
          </div>
        )}

        {cameraStatus === "denied" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-surface">
            <Camera className="h-8 w-8 text-status-error" />
            <p className="text-sm text-muted-foreground">Camera access was denied.</p>
            <p className="text-xs text-muted-foreground">Please allow camera access and refresh.</p>
          </div>
        )}

        {cameraStatus === "error" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-surface">
            <Camera className="h-8 w-8 text-status-error" />
            <p className="text-sm text-muted-foreground">Could not access camera.</p>
          </div>
        )}

        <video
          ref={ref}
          className="h-full w-full object-cover"
          style={{ transform: "scaleX(-1) scale(1.01)" }}
          playsInline
          muted
          autoPlay
        />

        <TranslationOverlay gesture={gesture} confidence={confidence} />

        {cameraStatus === "ready" && (
          <button
            onClick={onTogglePause}
            className="absolute right-4 top-4 z-10 rounded-lg p-2 text-foreground/70 transition-all duration-200 hover:bg-foreground/10 active:scale-95"
            aria-label={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </button>
        )}
      </div>
    );
  }
);

CameraFeed.displayName = "CameraFeed";

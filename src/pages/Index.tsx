import { useCamera } from "@/hooks/useCamera";
import { useGestureRecognition } from "@/hooks/useGestureRecognition";
import { AppHeader } from "@/components/AppHeader";
import { CameraFeed } from "@/components/CameraFeed";
import { HistorySidebar } from "@/components/HistorySidebar";

const Index = () => {
  const { videoRef, status: cameraStatus, isPaused, togglePause } = useCamera();
  const { currentGesture, confidence, history, detectionStatus } =
    useGestureRecognition(videoRef, cameraStatus === "ready" && !isPaused);

  return (
    <div className="grid h-[100svh] grid-cols-1 grid-rows-[60px_1fr] gap-4 p-4 lg:grid-cols-[1fr_320px]">
      <AppHeader cameraStatus={cameraStatus} detectionStatus={detectionStatus} />
      
      <div className="hidden lg:block" /> {/* Header spacer for sidebar column */}

      <main className="min-h-0 overflow-hidden">
        <CameraFeed
          ref={videoRef}
          gesture={currentGesture}
          confidence={confidence}
          isPaused={isPaused}
          onTogglePause={togglePause}
          cameraStatus={cameraStatus}
        />
      </main>

      <aside className="hidden min-h-0 lg:flex">
        <HistorySidebar history={history} />
      </aside>
    </div>
  );
};

export default Index;

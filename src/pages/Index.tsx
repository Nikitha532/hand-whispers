import { useCamera } from "@/hooks/useCamera";
import { useGestureRecognition } from "@/hooks/useGestureRecognition";
import { AppHeader } from "@/components/AppHeader";
import { CameraFeed } from "@/components/CameraFeed";
import { GestureGuide } from "@/components/GestureGuide";

const Index = () => {
  const { videoRef, status: cameraStatus, isPaused, togglePause } = useCamera();
  const { currentGesture, confidence, detectionStatus } =
    useGestureRecognition(videoRef, cameraStatus === "ready" && !isPaused);

  return (
    <div className="flex h-[100svh] flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <AppHeader cameraStatus={cameraStatus} detectionStatus={detectionStatus} />
        <GestureGuide />
      </div>

      <main className="min-h-0 flex-1 overflow-hidden">
        <CameraFeed
          ref={videoRef}
          gesture={currentGesture}
          confidence={confidence}
          isPaused={isPaused}
          onTogglePause={togglePause}
          cameraStatus={cameraStatus}
        />
      </main>
    </div>
  );
};

export default Index;

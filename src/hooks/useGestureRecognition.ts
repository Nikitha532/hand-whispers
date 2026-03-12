import { useEffect, useRef, useState, useCallback } from "react";

// Predefined gestures mapped to finger states
// Each gesture: [thumb, index, middle, ring, pinky] — true = extended
const GESTURES: Record<string, boolean[]> = {
  Hello: [true, true, true, true, true],           // Open hand
  Yes: [false, false, false, false, false],         // Fist / thumbs up approx
  No: [true, true, false, false, false],            // Thumb + index
  "Thank You": [true, true, true, false, false],    // Thumb + index + middle
  "I Love You": [true, true, false, false, true],   // Thumb + index + pinky
  OK: [true, false, true, true, true],              // OK ring sign
  Peace: [false, true, true, false, false],          // V sign
  "Rock On": [false, true, false, false, true],     // Index + pinky (horns)
  "Thumbs Up": [true, false, false, false, false],  // Only thumb extended
  "Call Me": [true, false, false, false, true],      // Thumb + pinky (phone)
  Point: [false, true, false, false, false],         // Index finger only
  Three: [false, true, true, true, false],           // Index + middle + ring
  Four: [false, true, true, true, true],             // All except thumb
  Wait: [true, true, true, true, false],             // All except pinky
  "Good Luck": [false, false, true, false, false],   // Middle finger only (crossed fingers approx)
};

export interface GestureResult {
  gesture: string | null;
  confidence: number;
  history: Array<{ gesture: string; timestamp: Date }>;
  sentence: string[];
  speakSentence: () => void;
  clearSentence: () => void;
}

export function useGestureRecognition(
  videoRef: React.RefObject<HTMLVideoElement>,
  isReady: boolean
) {
  const [currentGesture, setCurrentGesture] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [history, setHistory] = useState<Array<{ gesture: string; timestamp: Date }>>([]);
  const [sentence, setSentence] = useState<string[]>([]);
  const [detectionStatus, setDetectionStatus] = useState<"idle" | "detecting" | "recognized">("idle");
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const lastGestureRef = useRef<string | null>(null);
  const gestureTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const speakSentence = useCallback(() => {
    if (!window.speechSynthesis || sentence.length === 0) return;
    window.speechSynthesis.cancel();
    const text = sentence.join(" ");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }, [sentence]);

  const clearSentence = useCallback(() => {
    setSentence([]);
  }, []);

  const classifyGesture = useCallback((landmarks: any[]): { name: string; confidence: number } | null => {
    if (!landmarks || landmarks.length < 21) return null;

    // Simple finger extension detection based on landmark positions
    const fingerTips = [4, 8, 12, 16, 20]; // thumb, index, middle, ring, pinky tips
    const fingerPips = [3, 6, 10, 14, 18]; // corresponding PIP joints

    const extended: boolean[] = fingerTips.map((tip, i) => {
      if (i === 0) {
        // Thumb: compare x position (for right hand)
        return landmarks[tip].x < landmarks[fingerPips[i]].x;
      }
      // Other fingers: tip is higher (lower y) than PIP
      return landmarks[tip].y < landmarks[fingerPips[i]].y;
    });

    let bestMatch: string | null = null;
    let bestScore = 0;

    for (const [name, pattern] of Object.entries(GESTURES)) {
      const matches = pattern.reduce((acc, val, idx) => acc + (val === extended[idx] ? 1 : 0), 0);
      const score = matches / pattern.length;
      if (score > bestScore && score >= 0.6) {
        bestScore = score;
        bestMatch = name;
      }
    }

    return bestMatch ? { name: bestMatch, confidence: bestScore } : null;
  }, []);

  useEffect(() => {
    if (!isReady || !videoRef.current) return;

    let cancelled = false;

    const loadMediaPipe = async () => {
      try {
        // Dynamically import MediaPipe
        const { Hands } = await import("@mediapipe/hands");
        const { Camera } = await import("@mediapipe/camera_utils");

        if (cancelled) return;

        const hands = new Hands({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 0,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results: any) => {
          if (cancelled) return;

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            setDetectionStatus("detecting");
            const landmarks = results.multiHandLandmarks[0];
            const result = classifyGesture(landmarks);

            if (result) {
              setDetectionStatus("recognized");
              setConfidence(Math.round(result.confidence * 100));

              if (result.name !== lastGestureRef.current) {
                lastGestureRef.current = result.name;
                setCurrentGesture(result.name);
                setSentence((prev) => [...prev, result.name]);
                setHistory((prev) => [
                  { gesture: result.name, timestamp: new Date() },
                  ...prev.slice(0, 19),
                ]);
              }

              // Clear timeout for gesture disappearing
              if (gestureTimeoutRef.current) {
                clearTimeout(gestureTimeoutRef.current);
              }
              gestureTimeoutRef.current = setTimeout(() => {
                setCurrentGesture(null);
                setDetectionStatus("idle");
                lastGestureRef.current = null;
              }, 3000);
            }
          } else {
            // No hand detected — fade out after timeout
            if (gestureTimeoutRef.current) {
              clearTimeout(gestureTimeoutRef.current);
            }
             gestureTimeoutRef.current = setTimeout(() => {
               setCurrentGesture(null);
               setDetectionStatus("idle");
               lastGestureRef.current = null;
             }, 1500);
           }
         });

        handsRef.current = hands;

        const camera = new Camera(videoRef.current!, {
          onFrame: async () => {
            if (!cancelled && videoRef.current) {
              await hands.send({ image: videoRef.current });
            }
          },
          width: 1280,
          height: 720,
        });

        cameraRef.current = camera;
        camera.start();
      } catch (err) {
        console.error("Failed to load MediaPipe:", err);
      }
    };

    loadMediaPipe();

    return () => {
      cancelled = true;
      if (gestureTimeoutRef.current) clearTimeout(gestureTimeoutRef.current);
      try { cameraRef.current?.stop(); } catch (_) {}
      try { handsRef.current?.close(); } catch (_) {}
      cameraRef.current = null;
      handsRef.current = null;
    };
  }, [isReady, videoRef, classifyGesture]);

  return { currentGesture, confidence, history, detectionStatus, sentence, speakSentence, clearSentence };
}

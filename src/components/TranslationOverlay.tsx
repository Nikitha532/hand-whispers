import { AnimatePresence, motion } from "framer-motion";

interface TranslationOverlayProps {
  gesture: string | null;
  confidence: number;
}

export function TranslationOverlay({ gesture, confidence }: TranslationOverlayProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-end p-8"
      style={{
        background: "linear-gradient(to top, hsl(220 18% 8% / 0.85), transparent)",
      }}
    >
      <AnimatePresence mode="wait">
        {gesture && (
          <motion.div
            key={gesture}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ ease: [0.3, 0, 0.5, 1], duration: 0.25 }}
            className="text-center"
          >
            <h1 className="text-display text-foreground">{gesture}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {confidence}% confidence
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

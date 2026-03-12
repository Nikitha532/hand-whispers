import { Volume2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SentenceBarProps {
  words: string[];
  onSpeak: () => void;
  onClear: () => void;
}

export function SentenceBar({ words, onSpeak, onClear }: SentenceBarProps) {
  const sentence = words.join(" ");

  return (
    <div className="flex items-center gap-3 rounded-lg bg-card px-4 py-3 outline outline-1 outline-border">
      <div className="min-h-[2rem] flex-1 flex flex-wrap items-center gap-1.5">
        <AnimatePresence mode="popLayout">
          {words.length === 0 && (
            <motion.span
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-muted-foreground"
            >
              Sign gestures to build a sentence…
            </motion.span>
          )}
          {words.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              initial={{ opacity: 0, scale: 0.8, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-block rounded-md bg-primary/15 px-2 py-0.5 text-sm font-medium text-primary"
            >
              {word}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <button
        onClick={onClear}
        disabled={words.length === 0}
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
        aria-label="Clear sentence"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <button
        onClick={onSpeak}
        disabled={words.length === 0}
        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
        aria-label="Speak sentence"
      >
        <Volume2 className="h-4 w-4" />
        Speak
      </button>
    </div>
  );
}

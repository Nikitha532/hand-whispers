import { useState } from "react";
import { BookOpen, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GESTURE_DATA: { name: string; fingers: string; emoji: string }[] = [
  { name: "Hello", fingers: "All fingers open", emoji: "🖐️" },
  { name: "Yes", fingers: "Closed fist", emoji: "✊" },
  { name: "No", fingers: "Thumb + index", emoji: "🤏" },
  { name: "Thank You", fingers: "Thumb + index + middle", emoji: "🤟" },
  { name: "I Love You", fingers: "Thumb + index + pinky", emoji: "🤘" },
  { name: "OK", fingers: "Thumb touches index, rest open", emoji: "👌" },
  { name: "Peace", fingers: "Index + middle (V)", emoji: "✌️" },
  { name: "Rock On", fingers: "Index + pinky", emoji: "🤘" },
  { name: "Thumbs Up", fingers: "Only thumb extended", emoji: "👍" },
  { name: "Call Me", fingers: "Thumb + pinky", emoji: "🤙" },
  { name: "Point", fingers: "Only index extended", emoji: "☝️" },
  { name: "Three", fingers: "Index + middle + ring", emoji: "3️⃣" },
  { name: "Four", fingers: "All except thumb", emoji: "4️⃣" },
  { name: "Wait", fingers: "All except pinky", emoji: "🖖" },
  { name: "Good Luck", fingers: "Only middle extended", emoji: "🤞" },
];

export function GestureGuide() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Gesture guide"
      >
        <BookOpen className="h-4 w-4" />
        <span className="hidden sm:inline">Gesture Guide</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ ease: [0.3, 0, 0.5, 1], duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-surface p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Gesture Guide</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {GESTURE_DATA.map((g) => (
                  <div
                    key={g.name}
                    className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                  >
                    <span className="text-2xl">{g.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{g.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{g.fingers}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

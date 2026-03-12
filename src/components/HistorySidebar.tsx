import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface HistoryItem {
  gesture: string;
  timestamp: Date;
}

interface HistorySidebarProps {
  history: HistoryItem[];
}

export function HistorySidebar({ history }: HistorySidebarProps) {
  return (
    <div className="flex h-full flex-col gap-4">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        History
      </h2>

      <div className="flex-1 overflow-y-auto rounded-lg bg-surface p-4">
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No gestures recognized yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {history.map((item, i) => (
              <li
                key={`${item.gesture}-${item.timestamp.getTime()}`}
                className={cn(
                  "flex items-baseline justify-between text-sm transition-opacity duration-300",
                  i === 0 ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <span className="font-medium">{item.gesture}</span>
                <span className="text-xs tabular-nums">
                  {format(item.timestamp, "HH:mm:ss")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

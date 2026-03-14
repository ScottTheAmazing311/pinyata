"use client";

import { useTimer } from "@/hooks/useTimer";
import { formatTime } from "@/lib/utils";
import { useRef, useCallback } from "react";

interface TimerProps {
  defaultSeconds: number;
}

export default function Timer({ defaultSeconds }: TimerProps) {
  const { seconds, isRunning, hasCompleted, toggle, reset } = useTimer({
    defaultSeconds,
  });

  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const handlePressStart = useCallback(() => {
    pressTimer.current = setTimeout(() => {
      reset();
      pressTimer.current = null;
    }, 500);
  }, [reset]);

  const handlePressEnd = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
      toggle();
    }
  }, [toggle]);

  return (
    <button
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-colors min-w-[80px] ${
        hasCompleted
          ? "bg-red-500/20 border border-red-500/30 animate-pulse"
          : isRunning
            ? "bg-coral-500/15 border border-coral-500/20"
            : "glass-card"
      }`}
    >
      <span
        className={`text-lg font-mono font-bold tracking-wider ${
          hasCompleted ? "text-red-400" : isRunning ? "text-coral-400" : "text-plum-200"
        }`}
      >
        {formatTime(seconds)}
      </span>
      <span className="text-[10px] text-plum-500 mt-0.5">
        {hasCompleted ? "TIME UP" : isRunning ? "tap pause" : "tap start"}
      </span>
    </button>
  );
}

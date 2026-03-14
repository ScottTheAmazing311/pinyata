"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseTimerOptions {
  defaultSeconds: number;
  onComplete?: () => void;
}

export function useTimer({ defaultSeconds, onComplete }: UseTimerOptions) {
  const startValue = defaultSeconds > 0 ? defaultSeconds : 60;
  const [seconds, setSeconds] = useState(startValue);
  const [isRunning, setIsRunning] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const start = useCallback(() => {
    if (seconds <= 0) return;
    setIsRunning(true);
    setHasCompleted(false);
  }, [seconds]);

  const toggle = useCallback(() => {
    if (isRunning) {
      stop();
    } else {
      start();
    }
  }, [isRunning, start, stop]);

  const reset = useCallback(() => {
    stop();
    setSeconds(startValue);
    setHasCompleted(false);
  }, [stop, startValue]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          stop();
          setHasCompleted(true);
          onComplete?.();
          // Vibrate if available
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 200]);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, stop, onComplete]);

  return { seconds, isRunning, hasCompleted, toggle, reset };
}

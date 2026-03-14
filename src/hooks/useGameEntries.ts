"use client";

import { useState, useCallback, useMemo } from "react";
import { GameEntry } from "@/types/game";
import { shuffleArray } from "@/lib/utils";

export function useGameEntries(entries: GameEntry[]) {
  const [shuffled, setShuffled] = useState(() => shuffleArray(entries));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentEntry = useMemo(
    () => shuffled[currentIndex] ?? null,
    [shuffled, currentIndex]
  );

  const next = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => {
      const nextIdx = prev + 1;
      if (nextIdx >= shuffled.length) {
        setShuffled(shuffleArray(entries));
        return 0;
      }
      return nextIdx;
    });
  }, [shuffled.length, entries]);

  const flip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const progress = useMemo(
    () => ({
      current: currentIndex + 1,
      total: shuffled.length,
    }),
    [currentIndex, shuffled.length]
  );

  return { currentEntry, isFlipped, next, flip, progress };
}

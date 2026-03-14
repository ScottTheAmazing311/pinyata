"use client";

import { useState, useCallback } from "react";
import { Player } from "@/types/game";
import { PLAYER_COLORS } from "@/lib/utils";

export function useScoreTracker(initialPlayerCount: number = 2) {
  const [players, setPlayers] = useState<Player[]>(() =>
    Array.from({ length: Math.max(2, initialPlayerCount) }, (_, i) => ({
      id: `p-${i}`,
      name: `Player ${i + 1}`,
      color: PLAYER_COLORS[i % PLAYER_COLORS.length],
      score: 0,
    }))
  );

  const updateScore = useCallback((playerId: string, delta: number) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId ? { ...p, score: p.score + delta } : p
      )
    );
  }, []);

  const setScore = useCallback((playerId: string, score: number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, score } : p))
    );
  }, []);

  const setPlayerName = useCallback((playerId: string, name: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, name } : p))
    );
  }, []);

  const addPlayer = useCallback(() => {
    setPlayers((prev) => {
      if (prev.length >= 8) return prev;
      const idx = prev.length;
      return [
        ...prev,
        {
          id: `p-${Date.now()}`,
          name: `Player ${idx + 1}`,
          color: PLAYER_COLORS[idx % PLAYER_COLORS.length],
          score: 0,
        },
      ];
    });
  }, []);

  const removePlayer = useCallback((playerId: string) => {
    setPlayers((prev) => {
      if (prev.length <= 2) return prev;
      return prev.filter((p) => p.id !== playerId);
    });
  }, []);

  const clearScores = useCallback(() => {
    setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));
  }, []);

  return {
    players,
    updateScore,
    setScore,
    setPlayerName,
    addPlayer,
    removePlayer,
    clearScores,
  };
}

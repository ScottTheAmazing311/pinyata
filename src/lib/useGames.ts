"use client";

import { useState, useEffect } from "react";
import { GameFile } from "@/types/game";
import { fetchAllGames, fetchGameBySlug } from "./supabase/queries";
import { seedGames } from "./seedGames";

export function useAllGames() {
  const [games, setGames] = useState<GameFile[]>(seedGames);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllGames().then((data) => {
      if (data.length > 0) setGames(data);
      setLoading(false);
    });
  }, []);

  return { games, loading };
}

export function useGame(slug: string) {
  const [game, setGame] = useState<GameFile | null>(
    () => seedGames.find((g) => g.slug === slug) ?? null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGameBySlug(slug).then((data) => {
      if (data) setGame(data);
      setLoading(false);
    });
  }, [slug]);

  return { game, loading };
}

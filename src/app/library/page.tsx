"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import GameCard from "@/components/GameCard";
import SearchBar from "@/components/SearchBar";
import { useAllGames } from "@/lib/useGames";
import { getOwnedGameIds, initializeDefaultGames } from "@/lib/localStorage";
import { GameFile } from "@/types/game";
import { ChevronRightIcon, BagIcon } from "@/components/Icons";
import Link from "next/link";
import { motion } from "framer-motion";

type SortOption = "alpha" | "players" | "duration";

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("alpha");
  const { games: allGames } = useAllGames();
  const [ownedGames, setOwnedGames] = useState<GameFile[]>([]);

  useEffect(() => {
    const defaultIds = allGames.map((g) => g.id);
    initializeDefaultGames(defaultIds);

    const ownedIds = getOwnedGameIds();
    const games = allGames.filter((g) => ownedIds.includes(g.id));
    setOwnedGames(games);
  }, [allGames]);

  const filteredGames = useMemo(() => {
    let games = ownedGames;

    if (search) {
      const q = search.toLowerCase();
      games = games.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    switch (sort) {
      case "alpha":
        return [...games].sort((a, b) => a.title.localeCompare(b.title));
      case "players":
        return [...games].sort((a, b) => a.min_players - b.min_players);
      case "duration":
        return [...games].sort(
          (a, b) => a.duration_minutes - b.duration_minutes
        );
    }
  }, [ownedGames, search, sort]);

  return (
    <div className="min-h-dvh bg-plum-950 flex flex-col mesh-bg">
      <Header backHref="/" backLabel="Back to home" />

      <div className="px-4 py-4 space-y-4 flex-1 relative">
        {/* Search + Sort */}
        <div className="flex gap-2">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="glass-card rounded-xl px-3 text-xs text-plum-300 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="alpha">A-Z</option>
            <option value="players">Players</option>
            <option value="duration">Duration</option>
          </select>
        </div>

        {/* Game list */}
        {filteredGames.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BagIcon size={28} className="text-plum-500" />
            </div>
            <p className="text-plum-400 text-base mb-1">No games yet</p>
            <p className="text-plum-600 text-sm mb-6">
              Browse the shop to build your collection
            </p>
            <Link
              href="/shop"
              className="inline-block bg-gradient-to-r from-coral-500 to-coral-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Browse the Game Shop
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {filteredGames.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GameCard
                  game={game}
                  href={`/play/${game.slug}`}
                />
              </motion.div>
            ))}

            {/* Get More Games link */}
            <Link
              href="/shop"
              className="group flex items-center justify-center gap-2 py-4 text-coral-400/70 text-sm font-medium hover:text-coral-400 transition-colors"
            >
              Get More Games
              <ChevronRightIcon
                size={14}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

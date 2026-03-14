"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import GameCard from "@/components/GameCard";
import SearchBar from "@/components/SearchBar";
import { seedGames } from "@/lib/seedGames";
import { isGameOwned, addOwnedGame } from "@/lib/localStorage";
import { formatPrice } from "@/lib/utils";
import { GameFile } from "@/types/game";
import { FlameShape, BrushShape, MaskShape, GamepadShape, CloseIcon } from "@/components/Icons";
import { motion, AnimatePresence } from "framer-motion";

type SortOption = "alpha" | "price" | "players" | "duration";

const GAME_ICONS: Record<string, React.FC<{ className?: string }>> = {
  "hot-takes": FlameShape,
  "speed-sketch": BrushShape,
  "two-truths": MaskShape,
};

function getGameIcon(slug: string) {
  return GAME_ICONS[slug] ?? GamepadShape;
}

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("alpha");
  const [selectedGame, setSelectedGame] = useState<GameFile | null>(null);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const featured = seedGames.filter((g) => g.is_featured);
  const allGames = seedGames;

  const filteredGames = useMemo(() => {
    let games = allGames;

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
      case "price":
        return [...games].sort((a, b) => a.price - b.price);
      case "players":
        return [...games].sort((a, b) => a.min_players - b.min_players);
      case "duration":
        return [...games].sort(
          (a, b) => a.duration_minutes - b.duration_minutes
        );
    }
  }, [allGames, search, sort]);

  const handleAddToLibrary = (game: GameFile) => {
    addOwnedGame(game.id);
    setJustAdded(game.id);
    setTimeout(() => setJustAdded(null), 2000);
    setSelectedGame(null);
  };

  return (
    <div className="min-h-dvh bg-plum-950 flex flex-col mesh-bg">
      <Header backHref="/" backLabel="Back to home" />

      <div className="px-4 py-4 space-y-5 flex-1 relative">
        {/* Search + Sort */}
        <div className="flex gap-2">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search the shop..."
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="glass-card rounded-xl px-3 text-xs text-plum-300 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="alpha">A-Z</option>
            <option value="price">Price</option>
            <option value="players">Players</option>
            <option value="duration">Duration</option>
          </select>
        </div>

        {/* Featured section */}
        {!search && featured.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-plum-500 uppercase tracking-wider mb-3">
              Featured
            </h2>
            <div className="space-y-3">
              {featured.map((game) => {
                const Icon = getGameIcon(game.slug);
                return (
                  <button
                    key={game.id}
                    onClick={() => setSelectedGame(game)}
                    className="w-full text-left relative overflow-hidden rounded-2xl glass-card gradient-border p-4 group"
                  >
                    <span className="absolute top-3 right-3 text-[10px] bg-coral-500/90 text-white px-2 py-0.5 rounded-full font-semibold tracking-wide">
                      FEATURED
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-plum-800/80 flex items-center justify-center shrink-0 p-2 group-hover:scale-105 transition-transform">
                        <Icon className="w-full h-full" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{game.title}</h3>
                        <p className="text-xs text-plum-300 mt-0.5 line-clamp-1">
                          {game.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-plum-400">
                          <span>
                            {game.min_players}-{game.max_players} players
                          </span>
                          <span className="text-plum-600">|</span>
                          <span>{game.duration_minutes} min</span>
                          <span className="text-plum-600">|</span>
                          <span
                            className={
                              game.price === 0
                                ? "text-emerald-400"
                                : "text-coral-400"
                            }
                          >
                            {formatPrice(game.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* All Games */}
        <div>
          <h2 className="text-xs font-semibold text-plum-500 uppercase tracking-wider mb-3">
            All Games
          </h2>
          <div className="space-y-3">
            {filteredGames.map((game) => (
              <div key={game.id} className="relative">
                <div onClick={() => setSelectedGame(game)} className="cursor-pointer">
                  <GameCard game={game} href="#" showPrice />
                </div>
                {justAdded === game.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-emerald-500/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-emerald-500/20"
                  >
                    <span className="text-emerald-400 font-semibold text-sm">
                      Added to Library
                    </span>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Detail Modal */}
      <AnimatePresence>
        {selectedGame && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setSelectedGame(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-plum-900 rounded-t-3xl p-6 border-t border-plum-700/30"
            >
              {/* Drag handle */}
              <div className="flex justify-center -mt-2 mb-4">
                <div className="w-8 h-1 rounded-full bg-plum-700" />
              </div>

              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-plum-800/80 flex items-center justify-center shrink-0 p-3">
                  {(() => {
                    const Icon = getGameIcon(selectedGame.slug);
                    return <Icon className="w-full h-full" />;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-white">
                    {selectedGame.title}
                  </h2>
                  <p className="text-sm text-plum-300 mt-1">
                    {selectedGame.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="text-plum-500 hover:text-white transition-colors shrink-0"
                >
                  <CloseIcon size={20} />
                </button>
              </div>

              <div className="flex gap-3 text-sm text-plum-400 mb-5">
                <span>
                  {selectedGame.min_players}-{selectedGame.max_players} players
                </span>
                <span className="text-plum-700">|</span>
                <span>{selectedGame.duration_minutes} min</span>
                <span className="text-plum-700">|</span>
                <span>{selectedGame.entries.length} cards</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedGame.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs glass-card text-plum-300 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {isGameOwned(selectedGame.id) ? (
                <div className="flex gap-3">
                  <span className="flex-1 text-center py-3 rounded-xl bg-plum-800/60 text-plum-400 font-medium border border-plum-700/30">
                    Already in Library
                  </span>
                  <a
                    href={`/play/${selectedGame.slug}`}
                    className="flex-1 text-center py-3 rounded-xl bg-coral-500 text-white font-medium hover:bg-coral-600 transition-colors"
                  >
                    Play Now
                  </a>
                </div>
              ) : selectedGame.price === 0 ? (
                <button
                  onClick={() => handleAddToLibrary(selectedGame)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Add to Library - Free
                </button>
              ) : (
                <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-coral-500 to-coral-600 text-white font-semibold hover:opacity-90 transition-opacity">
                  Buy for {formatPrice(selectedGame.price)}
                </button>
              )}

              <div className="h-6" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { seedGames } from "@/lib/seedGames";
import Link from "next/link";
import { motion } from "framer-motion";
import RulesOverlay from "@/components/RulesOverlay";
import { FlameShape, BrushShape, MaskShape, GamepadShape, ArrowLeftIcon, PlayIcon } from "@/components/Icons";

const GAME_ICONS: Record<string, React.FC<{ className?: string }>> = {
  "hot-takes": FlameShape,
  "speed-sketch": BrushShape,
  "two-truths": MaskShape,
};

export default function StartScreen() {
  const params = useParams();
  const slug = params.slug as string;
  const game = seedGames.find((g) => g.slug === slug);
  const [showRules, setShowRules] = useState(false);

  if (!game) {
    return (
      <div className="min-h-dvh bg-plum-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-plum-400 text-lg mb-4">Game not found</p>
          <Link
            href="/library"
            className="text-coral-400 underline text-sm"
          >
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  const Icon = GAME_ICONS[game.slug] ?? GamepadShape;

  return (
    <div className="min-h-dvh bg-plum-950 relative flex flex-col items-center justify-center px-6 overflow-hidden mesh-bg">
      {/* Background gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-plum-800/20 via-plum-950 to-plum-950" />

      {/* Floating accent orbs */}
      <motion.div
        animate={{ y: [-15, 15, -15], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] right-[15%] w-32 h-32 opacity-[0.04]"
      >
        <Icon className="w-full h-full" />
      </motion.div>
      <motion.div
        animate={{ y: [10, -20, 10], rotate: [360, 180, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[25%] left-[10%] w-24 h-24 opacity-[0.03]"
      >
        <Icon className="w-full h-full" />
      </motion.div>

      {/* Back button */}
      <Link
        href="/library"
        className="absolute top-6 left-4 text-plum-400 hover:text-white z-10 p-1 transition-colors"
      >
        <ArrowLeftIcon size={22} />
      </Link>

      {/* Game info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-28 h-28 rounded-3xl glass-card flex items-center justify-center mx-auto mb-8 p-5"
        >
          <Icon className="w-full h-full" />
        </motion.div>

        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
          {game.title}
        </h1>
        <p className="text-plum-300 text-sm mb-3 max-w-xs mx-auto">{game.description}</p>

        <div className="flex items-center justify-center gap-4 text-xs text-plum-400 mb-12">
          <div className="flex flex-col items-center glass-card rounded-xl px-3 py-2">
            <span className="text-white font-semibold text-sm">{game.min_players}-{game.max_players}</span>
            <span className="text-[10px] text-plum-500">players</span>
          </div>
          <div className="flex flex-col items-center glass-card rounded-xl px-3 py-2">
            <span className="text-white font-semibold text-sm">{game.duration_minutes}</span>
            <span className="text-[10px] text-plum-500">minutes</span>
          </div>
          <div className="flex flex-col items-center glass-card rounded-xl px-3 py-2">
            <span className="text-white font-semibold text-sm">{game.entries.length}</span>
            <span className="text-[10px] text-plum-500">cards</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
          <Link
            href={`/play/${game.slug}/console`}
            className="relative bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-600 active:scale-[0.97] text-white text-lg font-bold py-4 rounded-2xl text-center transition-all shadow-lg shadow-coral-500/20 pulse-ring flex items-center justify-center gap-3"
          >
            <PlayIcon size={20} />
            Play
          </Link>
          <button
            onClick={() => setShowRules(true)}
            className="glass-card hover:bg-plum-800/60 text-plum-200 py-3 rounded-2xl font-medium transition-colors"
          >
            How to Play
          </button>
        </div>
      </motion.div>

      <RulesOverlay
        isOpen={showRules}
        onClose={() => setShowRules(false)}
        rules={game.rules}
        title={game.title}
      />
    </div>
  );
}

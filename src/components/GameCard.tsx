"use client";

import { GameFile } from "@/types/game";
import { formatPrice } from "@/lib/utils";
import { FlameShape, BrushShape, MaskShape, GamepadShape, ChevronRightIcon } from "./Icons";
import Link from "next/link";

const GAME_VISUALS: Record<string, { Icon: React.FC<{ className?: string }>; gradient: string }> = {
  "hot-takes": { Icon: FlameShape, gradient: "from-coral-500/20 via-transparent to-transparent" },
  "speed-sketch": { Icon: BrushShape, gradient: "from-blue-500/15 via-transparent to-transparent" },
  "two-truths": { Icon: MaskShape, gradient: "from-plum-500/20 via-transparent to-transparent" },
};

function getVisual(slug: string) {
  return GAME_VISUALS[slug] ?? { Icon: GamepadShape, gradient: "from-plum-500/15 via-transparent to-transparent" };
}

interface GameCardProps {
  game: GameFile;
  href: string;
  showPrice?: boolean;
}

export default function GameCard({ game, href, showPrice }: GameCardProps) {
  const { Icon, gradient } = getVisual(game.slug);

  return (
    <Link
      href={href}
      className={`group flex items-center gap-4 p-3 rounded-2xl glass-card hover:bg-plum-800/60 active:scale-[0.98] transition-all bg-gradient-to-r ${gradient}`}
    >
      <div className="w-14 h-14 rounded-xl bg-plum-800/80 flex items-center justify-center shrink-0 overflow-hidden p-2 group-hover:scale-105 transition-transform">
        <Icon className="w-full h-full" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white text-sm truncate">
          {game.title}
        </h3>
        <p className="text-xs text-plum-300 line-clamp-1 mt-0.5">
          {game.description}
        </p>
        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-plum-400">
          <span>{game.min_players}-{game.max_players} players</span>
          <span className="text-plum-600">|</span>
          <span>{game.duration_minutes} min</span>
        </div>
      </div>
      {showPrice ? (
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
            game.price === 0
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
              : "bg-coral-500/15 text-coral-400 border border-coral-500/20"
          }`}
        >
          {formatPrice(game.price)}
        </span>
      ) : (
        <ChevronRightIcon size={16} className="text-plum-600 group-hover:text-plum-400 transition-colors shrink-0" />
      )}
    </Link>
  );
}

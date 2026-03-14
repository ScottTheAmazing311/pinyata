"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GameEntry } from "@/types/game";
import { useSwipe } from "@/hooks/useSwipe";
import { FlipIcon, ChevronRightIcon } from "../Icons";

interface ContentAreaProps {
  entry: GameEntry | null;
  isFlipped: boolean;
  onNext: () => void;
  onFlip: () => void;
  progress: { current: number; total: number };
}

export default function ContentArea({
  entry,
  isFlipped,
  onNext,
  onFlip,
  progress,
}: ContentAreaProps) {
  const swipeHandlers = useSwipe({ onSwipeLeft: onNext });

  if (!entry) return null;

  const progressPercent = (progress.current / progress.total) * 100;

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center px-6 py-4 relative"
      {...swipeHandlers}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-plum-800/30">
        <motion.div
          className="h-full bg-gradient-to-r from-coral-500/50 to-coral-400/30"
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Progress text */}
      <div className="absolute top-3 right-4 text-[11px] text-plum-600 font-mono">
        {progress.current}/{progress.total}
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={entry.id + (isFlipped ? "-back" : "-front")}
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -60, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full max-w-sm aspect-[3/4] rounded-3xl glass-card flex flex-col items-center justify-center p-8 relative shadow-2xl shadow-black/20"
        >
          {/* Corner decoration */}
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-plum-700/30 rounded-tr-xl" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-plum-700/30 rounded-bl-xl" />

          {!isFlipped ? (
            <>
              {entry.category && (
                <span className="absolute top-4 left-4 text-[10px] uppercase tracking-wider bg-coral-500/15 text-coral-400 px-2.5 py-0.5 rounded-full border border-coral-500/20 font-medium">
                  {entry.category}
                </span>
              )}
              <p className="text-xl font-bold text-white text-center leading-relaxed">
                {entry.primary}
              </p>
            </>
          ) : (
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-plum-500 mb-3">
                Revealed
              </p>
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-coral-500/50 to-transparent mx-auto mb-4" />
              <p className="text-lg font-semibold text-coral-400 leading-relaxed">
                {entry.secondary || "No hidden content"}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex items-center gap-4 mt-6">
        {entry.secondary && (
          <button
            onClick={onFlip}
            className="glass-card hover:bg-plum-700/60 text-plum-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <FlipIcon size={14} />
            {isFlipped ? "Prompt" : "Reveal"}
          </button>
        )}
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5"
        >
          Next
          <ChevronRightIcon size={14} />
        </button>
      </div>

      <p className="text-[10px] text-plum-700 mt-3 tracking-wider">
        SWIPE LEFT FOR NEXT
      </p>
    </div>
  );
}

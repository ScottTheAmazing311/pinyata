"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@/types/game";
import { CloseIcon } from "../Icons";

interface ScoreTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  onUpdateScore: (playerId: string, delta: number) => void;
  onSetScore: (playerId: string, score: number) => void;
  onSetPlayerName: (playerId: string, name: string) => void;
  onAddPlayer: () => void;
  onRemovePlayer: (playerId: string) => void;
  onClearScores: () => void;
}

export default function ScoreTracker({
  isOpen,
  onClose,
  players,
  onUpdateScore,
  onSetScore,
  onSetPlayerName,
  onAddPlayer,
  onRemovePlayer,
  onClearScores,
}: ScoreTrackerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-plum-900 rounded-t-3xl max-h-[80vh] overflow-y-auto border-t border-plum-700/30"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-8 h-1 rounded-full bg-plum-700" />
            </div>

            {/* Header */}
            <div className="sticky top-0 bg-plum-900 px-6 pt-2 pb-3 flex items-center justify-between border-b border-plum-800/50">
              <h2 className="text-base font-bold text-white">Score Tracker</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs bg-plum-800/80 text-plum-300 px-3 py-1.5 rounded-lg hover:bg-plum-700 transition-colors"
                >
                  {isEditing ? "Done" : "Edit"}
                </button>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="text-xs bg-plum-800/80 text-plum-300 px-3 py-1.5 rounded-lg hover:bg-plum-700 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={onClose}
                  className="text-plum-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-plum-800 transition-colors"
                >
                  <CloseIcon size={18} />
                </button>
              </div>
            </div>

            {/* Player list */}
            <div className="px-6 py-4 space-y-3">
              {players.map((player, idx) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3 glass-card rounded-xl px-4 py-3"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0 ring-2 ring-offset-1 ring-offset-plum-900"
                    style={{ backgroundColor: player.color }}
                  />
                  {isEditing ? (
                    <input
                      value={player.name}
                      onChange={(e) =>
                        onSetPlayerName(player.id, e.target.value)
                      }
                      className="flex-1 bg-plum-800 text-white text-sm px-2 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-coral-500"
                    />
                  ) : (
                    <span className="flex-1 text-sm text-plum-200 font-medium">
                      {player.name}
                    </span>
                  )}

                  {isEditing ? (
                    players.length > 2 && (
                      <button
                        onClick={() => onRemovePlayer(player.id)}
                        className="text-red-400 text-xs px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors"
                      >
                        Remove
                      </button>
                    )
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateScore(player.id, -1)}
                        className="w-8 h-8 bg-plum-800 hover:bg-plum-700 text-plum-300 rounded-lg flex items-center justify-center text-lg font-bold transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={player.score}
                        onChange={(e) =>
                          onSetScore(
                            player.id,
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-12 text-center bg-transparent text-white text-lg font-bold focus:outline-none"
                      />
                      <button
                        onClick={() => onUpdateScore(player.id, 1)}
                        className="w-8 h-8 bg-coral-500/15 hover:bg-coral-500/25 text-coral-400 rounded-lg flex items-center justify-center text-lg font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}

              {isEditing && players.length < 8 && (
                <button
                  onClick={onAddPlayer}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-plum-700 text-plum-400 text-sm hover:border-coral-500/50 hover:text-coral-400 transition-colors"
                >
                  + Add Player
                </button>
              )}
            </div>

            {/* Clear confirmation */}
            {showClearConfirm && (
              <div className="px-6 pb-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-sm text-red-300">
                    Reset all scores to 0?
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="text-xs bg-plum-800 text-plum-300 px-3 py-1.5 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        onClearScores();
                        setShowClearConfirm(false);
                      }}
                      className="text-xs bg-red-500/15 text-red-400 px-3 py-1.5 rounded-lg"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="h-8" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

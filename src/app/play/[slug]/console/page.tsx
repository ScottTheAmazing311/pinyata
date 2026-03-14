"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGame } from "@/lib/useGames";
import { useGameEntries } from "@/hooks/useGameEntries";
import { useScoreTracker } from "@/hooks/useScoreTracker";
import ContentArea from "@/components/Console/ContentArea";
import Timer from "@/components/Console/Timer";
import Randomizer from "@/components/Console/Randomizer";
import ScoreTracker from "@/components/Console/ScoreTracker";
import RulesOverlay from "@/components/RulesOverlay";
import { ArrowLeftIcon, HelpIcon, ScoreIcon } from "@/components/Icons";

export default function ConsolePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { game } = useGame(slug);

  const { currentEntry, isFlipped, next, flip, progress } = useGameEntries(
    game?.entries ?? []
  );

  const {
    players,
    updateScore,
    setScore,
    setPlayerName,
    addPlayer,
    removePlayer,
    clearScores,
  } = useScoreTracker(game?.min_players ?? 2);

  const [showScores, setShowScores] = useState(false);
  const [showRules, setShowRules] = useState(false);

  if (!game) {
    return (
      <div className="min-h-dvh bg-plum-950 flex items-center justify-center">
        <p className="text-plum-400">Game not found</p>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-plum-950 flex flex-col overflow-hidden mesh-bg">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-plum-800/30 bg-plum-950/80 backdrop-blur-sm">
        <button
          onClick={() => router.push(`/play/${slug}`)}
          className="text-plum-400 hover:text-white p-1 transition-colors"
        >
          <ArrowLeftIcon size={20} />
        </button>
        <span className="glass-card text-plum-200 text-xs font-medium px-3.5 py-1.5 rounded-full">
          {game.title}
        </span>
        <button
          onClick={() => setShowRules(true)}
          className="text-plum-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-plum-800/60 transition-colors"
        >
          <HelpIcon size={18} />
        </button>
      </div>

      {/* Content Area */}
      <ContentArea
        entry={currentEntry}
        isFlipped={isFlipped}
        onNext={next}
        onFlip={flip}
        progress={progress}
      />

      {/* Bottom Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-plum-800/30 bg-plum-950/80 backdrop-blur-sm gap-3">
        {/* Score Tracker Button */}
        <button
          onClick={() => setShowScores(true)}
          className="flex flex-col items-center justify-center px-4 py-2 rounded-xl glass-card hover:bg-plum-700/60 transition-colors min-w-[80px]"
        >
          <div className="flex gap-1.5 items-end">
            {players.slice(0, 4).map((p) => (
              <div key={p.id} className="flex flex-col items-center">
                <span className="text-[9px] text-plum-400 font-mono">
                  {p.score}
                </span>
                <div
                  className="w-1.5 rounded-full mt-0.5"
                  style={{
                    backgroundColor: p.color,
                    height: `${Math.max(4, Math.min(16, 4 + p.score * 2))}px`,
                  }}
                />
              </div>
            ))}
          </div>
          <span className="text-[10px] text-plum-500 mt-1">scores</span>
        </button>

        {/* Timer */}
        <Timer defaultSeconds={game.timer_default_seconds} />

        {/* Randomizer */}
        {game.randomizer_type && (
          <Randomizer
            type={game.randomizer_type}
            config={game.randomizer_config}
          />
        )}

        {!game.randomizer_type && <div className="min-w-[80px]" />}
      </div>

      {/* Score Tracker Overlay */}
      <ScoreTracker
        isOpen={showScores}
        onClose={() => setShowScores(false)}
        players={players}
        onUpdateScore={updateScore}
        onSetScore={setScore}
        onSetPlayerName={setPlayerName}
        onAddPlayer={addPlayer}
        onRemovePlayer={removePlayer}
        onClearScores={clearScores}
      />

      {/* Rules Overlay */}
      <RulesOverlay
        isOpen={showRules}
        onClose={() => setShowRules(false)}
        rules={game.rules}
        title={game.title}
      />
    </div>
  );
}

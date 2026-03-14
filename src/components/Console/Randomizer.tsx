"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DiceIcon, LetterIcon, PaletteIcon, HashIcon, SpinnerIcon } from "../Icons";

interface RandomizerProps {
  type: "dice" | "letter" | "color" | "number" | "spinner";
  config?: Record<string, number>;
}

const COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#3b82f6", "#a855f7", "#ec4899", "#14b8a6",
];

const TYPE_ICONS = {
  dice: DiceIcon,
  letter: LetterIcon,
  color: PaletteIcon,
  number: HashIcon,
  spinner: SpinnerIcon,
};

export default function Randomizer({ type, config }: RandomizerProps) {
  const [result, setResult] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [resultColor, setResultColor] = useState<string | undefined>();

  const generate = useCallback((): { value: string; color?: string } => {
    switch (type) {
      case "dice": {
        const sides = config?.sides ?? 6;
        return { value: String(Math.floor(Math.random() * sides) + 1) };
      }
      case "letter": {
        const code = 65 + Math.floor(Math.random() * 26);
        return { value: String.fromCharCode(code) };
      }
      case "color": {
        const c = COLORS[Math.floor(Math.random() * COLORS.length)];
        return { value: "\u25CF", color: c };
      }
      case "number": {
        const min = config?.min ?? 1;
        const max = config?.max ?? 100;
        return { value: String(Math.floor(Math.random() * (max - min + 1)) + min) };
      }
      case "spinner": {
        const angle = Math.floor(Math.random() * 360);
        return { value: `${angle}` };
      }
    }
  }, [type, config]);

  const roll = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    let count = 0;
    const maxCycles = 10;
    const interval = setInterval(() => {
      count++;
      const preview = generate();
      setResult(preview.value);
      setResultColor(preview.color);
      if (count >= maxCycles) {
        clearInterval(interval);
        const final = generate();
        setResult(final.value);
        setResultColor(final.color);
        setIsAnimating(false);
      }
    }, 80);
  }, [isAnimating, generate]);

  const Icon = TYPE_ICONS[type];

  return (
    <button
      onClick={roll}
      className="flex flex-col items-center justify-center px-4 py-2 rounded-xl glass-card hover:bg-plum-700/60 transition-colors min-w-[80px]"
    >
      <AnimatePresence mode="wait">
        {result ? (
          <motion.span
            key={result + Math.random()}
            initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className={`text-lg font-bold ${isAnimating ? "text-plum-400" : "text-coral-400"}`}
            style={resultColor ? { color: resultColor } : undefined}
          >
            {result}
          </motion.span>
        ) : (
          <Icon size={20} className="text-plum-300" />
        )}
      </AnimatePresence>
      <span className="text-[10px] text-plum-500 mt-0.5">
        {type === "dice" ? "roll" : type}
      </span>
    </button>
  );
}

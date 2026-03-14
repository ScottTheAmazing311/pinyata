"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DiceIcon, BagIcon, InfoIcon, ChevronRightIcon } from "@/components/Icons";

const navButtons = [
  {
    href: "/library",
    icon: DiceIcon,
    label: "My Games",
    desc: "Play your collection",
    gradient: "from-coral-500/20 to-coral-600/5",
    iconColor: "text-coral-400",
  },
  {
    href: "/shop",
    icon: BagIcon,
    label: "Game Shop",
    desc: "Discover new games",
    gradient: "from-plum-500/20 to-plum-600/5",
    iconColor: "text-plum-300",
  },
  {
    href: "/about",
    icon: InfoIcon,
    label: "About",
    desc: "Learn more",
    gradient: "from-gold-400/10 to-gold-500/5",
    iconColor: "text-gold-400",
  },
];

export default function TitleScreen() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-plum-950 relative overflow-hidden mesh-bg noise-overlay">
      {/* Floating orbs */}
      <motion.div
        animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] right-[10%] w-2 h-2 rounded-full bg-coral-500/40 blur-[1px]"
      />
      <motion.div
        animate={{ y: [8, -12, 8], x: [5, -5, 5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[35%] left-[15%] w-1.5 h-1.5 rounded-full bg-gold-400/30 blur-[1px]"
      />
      <motion.div
        animate={{ y: [-6, 14, -6] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[30%] right-[20%] w-1 h-1 rounded-full bg-plum-400/50"
      />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-16 relative"
      >
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <h1 className="text-7xl font-extrabold tracking-tighter bg-gradient-to-br from-coral-400 via-coral-500 to-gold-400 bg-clip-text text-transparent drop-shadow-sm">
            Pinyata
          </h1>
        </motion.div>
        <div className="flex items-center justify-center gap-3 mt-3">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-plum-600" />
          <p className="text-plum-400 text-xs font-semibold tracking-[0.3em] uppercase">
            game library
          </p>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-plum-600" />
        </div>
      </motion.div>

      {/* Navigation buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="flex flex-col gap-3 w-full max-w-xs"
      >
        {navButtons.map((btn, i) => (
          <motion.div
            key={btn.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
          >
            <Link
              href={btn.href}
              className={`group flex items-center gap-4 bg-gradient-to-r ${btn.gradient} glass-card hover:bg-plum-800/60 active:scale-[0.97] rounded-2xl px-5 py-4 transition-all`}
            >
              <div className={`w-10 h-10 rounded-xl bg-plum-800/80 flex items-center justify-center ${btn.iconColor} group-hover:scale-110 transition-transform`}>
                <btn.icon size={20} />
              </div>
              <div className="flex-1">
                <span className="text-base font-semibold text-white block">
                  {btn.label}
                </span>
                <span className="text-xs text-plum-400">{btn.desc}</span>
              </div>
              <ChevronRightIcon
                size={16}
                className="text-plum-600 group-hover:text-plum-400 group-hover:translate-x-0.5 transition-all"
              />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom decoration */}
      <div className="absolute bottom-6 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
            className="w-1 h-1 rounded-full bg-plum-600"
          />
        ))}
      </div>
    </div>
  );
}

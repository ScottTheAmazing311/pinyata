"use client";

import Header from "@/components/Header";

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-plum-950">
      <Header backHref="/" backLabel="Back to home" />

      <div className="px-6 py-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">About Pinyata</h1>

        <div className="space-y-4 text-sm text-plum-300 leading-relaxed">
          <p>
            <span className="text-white font-semibold">Pinyata</span> is a
            digital library of party games. Browse, collect, and play
            tabletop-style card games right on your phone — no boards, no
            pieces, no setup.
          </p>

          <p>
            Each game is a deck of prompts, questions, or challenges that you
            play with friends. Just pick a game, gather your group, and start
            swiping through cards.
          </p>

          <p>
            Perfect for game nights, road trips, waiting rooms, or anywhere
            you need instant fun.
          </p>
        </div>

        <div className="mt-10 pt-6 border-t border-plum-800/50 space-y-3 text-sm text-plum-500">
          <p>Version 1.0.0</p>
          <p>By Closet Nerd Digital</p>
        </div>

        <div className="mt-6 space-y-2">
          <a
            href="#"
            className="block text-sm text-plum-400 hover:text-coral-400 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="block text-sm text-plum-400 hover:text-coral-400 transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="block text-sm text-plum-400 hover:text-coral-400 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}

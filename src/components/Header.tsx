"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "./Icons";

interface HeaderProps {
  backHref?: string;
  backLabel?: string;
}

export default function Header({ backHref, backLabel }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-plum-950/80 backdrop-blur-xl border-b border-plum-800/40 px-4 py-3 flex items-center gap-3">
      {backHref && (
        <button
          onClick={() => router.push(backHref)}
          className="text-plum-400 hover:text-white p-1 -ml-1 transition-colors"
          aria-label={backLabel ?? "Go back"}
        >
          <ArrowLeftIcon size={20} />
        </button>
      )}
      <Link href="/" className="flex items-baseline gap-2">
        <span className="text-lg font-bold bg-gradient-to-r from-coral-400 to-coral-500 bg-clip-text text-transparent">
          Pinyata
        </span>
        <span className="text-[10px] text-plum-500 font-medium tracking-wider uppercase">
          game library
        </span>
      </Link>
    </header>
  );
}

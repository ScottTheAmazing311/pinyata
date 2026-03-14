"use client";

import { SearchIcon } from "./Icons";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search games...",
}: SearchBarProps) {
  return (
    <div className="relative">
      <SearchIcon
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-plum-500"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full glass-card rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-plum-500 focus:outline-none focus:ring-2 focus:ring-coral-500/30 focus:border-coral-500/30 transition-colors"
      />
    </div>
  );
}

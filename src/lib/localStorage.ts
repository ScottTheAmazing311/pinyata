const OWNED_GAMES_KEY = "pinyata_owned_games";

export function getOwnedGameIds(): string[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(OWNED_GAMES_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function addOwnedGame(gameId: string): void {
  const ids = getOwnedGameIds();
  if (!ids.includes(gameId)) {
    ids.push(gameId);
    localStorage.setItem(OWNED_GAMES_KEY, JSON.stringify(ids));
  }
}

export function isGameOwned(gameId: string): boolean {
  return getOwnedGameIds().includes(gameId);
}

export function initializeDefaultGames(defaultGameIds: string[]): void {
  const ids = getOwnedGameIds();
  if (ids.length === 0) {
    localStorage.setItem(OWNED_GAMES_KEY, JSON.stringify(defaultGameIds));
  }
}

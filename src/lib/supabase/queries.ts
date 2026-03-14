import { supabase } from "./client";
import { GameFile, GameEntry } from "@/types/game";

export async function fetchAllGames(): Promise<GameFile[]> {
  const { data: games, error } = await supabase
    .from("games")
    .select("*")
    .eq("is_published", true)
    .order("title");

  if (error || !games) return [];

  const gameIds = games.map((g) => g.id);
  const { data: entries } = await supabase
    .from("game_entries")
    .select("*")
    .in("game_id", gameIds)
    .order("sort_order");

  return games.map((g) => ({
    id: g.id,
    slug: g.slug,
    title: g.title,
    description: g.description,
    thumbnail_url: g.thumbnail_url ?? "",
    min_players: g.min_players,
    max_players: g.max_players,
    duration_minutes: g.duration_minutes,
    tags: g.tags ?? [],
    price: g.price,
    is_featured: g.is_featured,
    timer_default_seconds: g.timer_default_seconds ?? 0,
    randomizer_type: g.randomizer_type,
    randomizer_config: g.randomizer_config,
    rules: g.rules ?? "",
    entries: (entries ?? [])
      .filter((e) => e.game_id === g.id)
      .map((e) => ({
        id: e.id,
        primary: e.primary_content,
        secondary: e.secondary_content ?? undefined,
        category: e.category ?? undefined,
        image_url: e.image_url ?? undefined,
      })),
    created_at: g.created_at,
    updated_at: g.updated_at,
  }));
}

export async function fetchGameBySlug(slug: string): Promise<GameFile | null> {
  const { data: game, error } = await supabase
    .from("games")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !game) return null;

  const { data: entries } = await supabase
    .from("game_entries")
    .select("*")
    .eq("game_id", game.id)
    .order("sort_order");

  return {
    id: game.id,
    slug: game.slug,
    title: game.title,
    description: game.description,
    thumbnail_url: game.thumbnail_url ?? "",
    min_players: game.min_players,
    max_players: game.max_players,
    duration_minutes: game.duration_minutes,
    tags: game.tags ?? [],
    price: game.price,
    is_featured: game.is_featured,
    timer_default_seconds: game.timer_default_seconds ?? 0,
    randomizer_type: game.randomizer_type,
    randomizer_config: game.randomizer_config,
    rules: game.rules ?? "",
    entries: (entries ?? []).map((e) => ({
      id: e.id,
      primary: e.primary_content,
      secondary: e.secondary_content ?? undefined,
      category: e.category ?? undefined,
      image_url: e.image_url ?? undefined,
    })),
    created_at: game.created_at,
    updated_at: game.updated_at,
  };
}

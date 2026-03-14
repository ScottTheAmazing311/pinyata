import { supabase } from "./client";
import { GameFile } from "@/types/game";

function mapGame(g: Record<string, unknown>, entries: Record<string, unknown>[]): GameFile {
  return {
    id: g.id as string,
    slug: g.slug as string,
    title: g.title as string,
    description: g.description as string,
    thumbnail_url: (g.thumbnail_url as string) ?? "",
    min_players: g.min_players as number,
    max_players: g.max_players as number,
    duration_minutes: g.duration_minutes as number,
    tags: (g.tags as string[]) ?? [],
    price: g.price as number,
    is_featured: g.is_featured as boolean,
    timer_default_seconds: (g.timer_default_seconds as number) ?? 0,
    randomizer_type: g.randomizer_type as GameFile["randomizer_type"],
    randomizer_config: g.randomizer_config as Record<string, number> | undefined,
    rules: (g.rules as string) ?? "",
    entries: entries.map((e) => ({
      id: e.id as string,
      primary: e.primary_content as string,
      secondary: (e.secondary_content as string) ?? undefined,
      category: (e.category as string) ?? undefined,
      image_url: (e.image_url as string) ?? undefined,
    })),
    created_at: g.created_at as string,
    updated_at: g.updated_at as string,
  };
}

export async function fetchAllGames(): Promise<GameFile[]> {
  if (!supabase) return [];

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

  return games.map((g) =>
    mapGame(g, (entries ?? []).filter((e) => e.game_id === g.id))
  );
}

export async function fetchGameBySlug(slug: string): Promise<GameFile | null> {
  if (!supabase) return null;

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

  return mapGame(game, entries ?? []);
}

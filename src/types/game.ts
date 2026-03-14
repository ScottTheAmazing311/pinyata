export interface GameEntry {
  id: string;
  primary: string;
  secondary?: string;
  category?: string;
  image_url?: string;
}

export interface GameFile {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail_url: string;

  min_players: number;
  max_players: number;
  duration_minutes: number;
  tags: string[];

  price: number;
  is_featured: boolean;

  timer_default_seconds: number;
  randomizer_type: "dice" | "letter" | "color" | "number" | "spinner" | null;
  randomizer_config?: Record<string, number>;

  entries: GameEntry[];

  rules: string;

  created_at: string;
  updated_at: string;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  score: number;
}

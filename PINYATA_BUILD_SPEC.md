# Pinyata Game Library — Comprehensive Build Spec

## Overview

Pinyata is a **mobile-first party game platform** — a digital library where users browse, purchase, and play tabletop/party games on their phone. Think of it as an "App Store for party games" where each game is a lightweight card/prompt-based experience (trivia, word games, charades-style, etc.) powered by simple data files rather than complex game engines.

The app was originally spec'd as a native iOS app (circa iPhone 4/5 era). We are rebuilding it as a **modern progressive web app (PWA)** using Next.js, keeping the original UX concept but modernizing the design and tech stack.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (Postgres + Auth + Storage + Realtime) |
| Payments | Stripe (for paid games) |
| Hosting | Vercel |
| PWA | next-pwa (installable, offline-capable) |

---

## Core Concept: GameFiles

**The entire platform revolves around "GameFiles."** A GameFile is a structured data object (stored in Supabase) that contains everything needed to define a single game. Games are NOT code — they are data. The Console (game player) is a single universal component that interprets any GameFile.

### GameFile Schema

```typescript
interface GameFile {
  id: string;                    // UUID
  slug: string;                  // URL-friendly name
  title: string;                 // Display name
  description: string;           // Brief description shown in library/shop
  thumbnail_url: string;         // Game cover image (Supabase Storage)
  
  // Metadata
  min_players: number;           // e.g., 2
  max_players: number;           // e.g., 8
  duration_minutes: number;      // e.g., 30
  tags: string[];                // e.g., ["trivia", "family", "quick"]
  
  // Shop data
  price: number;                 // 0 = free, otherwise cents (99 = $0.99)
  is_featured: boolean;          // Appears in featured section of shop
  
  // Game defaults
  timer_default_seconds: number; // Default timer duration (0 = no timer)
  randomizer_type: string | null; // "dice" | "letter" | "color" | "number" | "spinner" | null
  randomizer_config?: object;    // e.g., { sides: 6 } for dice, { min: 1, max: 100 } for number
  
  // Content — the actual game data
  entries: GameEntry[];
  
  // Rules / How to Play (markdown string)
  rules: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

interface GameEntry {
  id: string;
  primary: string;              // Main content shown (word, question, prompt, category name)
  secondary?: string;           // Hidden content revealed on flip (answer, hint, taboo words)
  category?: string;            // Optional grouping
  image_url?: string;           // Optional image content
}
```

### Example GameFiles to Seed

Include at least 3 demo games to ship with:

1. **"Hot Takes"** — Debate prompts. Primary = controversial statement, secondary = counterpoint. No timer. 3-8 players, 20 min.
2. **"Speed Sketch"** — Drawing prompts. Primary = thing to draw, secondary = category. 60-second timer. Dice randomizer. 3-10 players, 30 min.
3. **"Two Truths"** — Ice breaker. Primary = category/theme for your truths and lie. No secondary. No timer. 2-20 players, 15 min.

Each should have **at least 50 entries** so the game feels real.

---

## Application Screens & Navigation

The app has a clear screen hierarchy. Navigation uses a stack-based pattern (push/pop) with animated transitions.

```
Title Screen
├── My Library (list of owned games)
│   └── Start Screen (game detail + play button)
│       └── Console (the game player)
│           └── Score Tracker (overlay/modal)
├── Game Shop (browse & purchase)
│   └── Game Detail → Purchase flow
└── About
```

### Global Header

Every screen except Title and Console shows a persistent header:
- "Pinyata" logo/wordmark + "game library" subtitle
- Styled as a branded top bar

---

## Screen-by-Screen Specifications

### 1. Title Screen (`/`)

**Purpose:** Branded entry point. Brief animated intro on first load, then main menu.

**Layout:**
- Full-screen gradient/textured background (modern — not the old iOS blue gradient)
- "Pinyata" large logo/wordmark centered upper-third
- "game library" subtitle beneath
- Three navigation buttons centered below:
  - **My Games** — icon: dice → navigates to `/library`
  - **Game Shop** — icon: shopping bag → navigates to `/shop`
  - **About** — icon: `?` circle → navigates to `/about`
- Buttons are large, tappable (minimum 48px touch target), with icon + label
- Subtle entrance animation (fade-in, slight scale) on page load

**Behavior:**
- If user is not authenticated, "My Games" still works (games stored in localStorage until they create an account)
- Sound effect on button tap (optional, respect device mute)

---

### 2. My Library (`/library`)

**Purpose:** Shows all games the user owns. Tapping a game launches it.

**Layout:**
- Global header with back button (← arrow) to Title Screen
- **View toggle:** List view (shelf) vs. Carousel view (horizontal swipe)
  - List view: rows with thumbnail (left), title + description + player count/duration (right)
  - Carousel view: large centered thumbnail with title below, swipe left/right to browse
- **Search bar** at top — filters by title and tags in real-time
- **Sort controls** (hidden behind a filter icon or inline): alphabetical, recently played, player count
- Scrollable list, lazy-loaded
- **Last item in the list** is always a "Get More Games →" link to the Game Shop

**Data source:** 
- Supabase: `user_games` join table (user_id → game_id)
- For unauthenticated users: localStorage array of owned game IDs
- All users start with the 3 free seed games

**Empty state:** Friendly message + CTA to Game Shop if no games owned.

---

### 3. Game Shop (`/shop`)

**Purpose:** Browse and acquire new games (free or paid).

**Layout:**
- Global header with back button to Title Screen
- **Sort dropdown:** A-Z, Price, Popularity, Duration, Player Count
- **Search bar** — searches title and tags
- **Featured section** at top: games where `is_featured = true` get a larger card treatment with "FEATURED" badge
- **Game list** below featured: same row layout as library (thumbnail + title + description + price badge + player count/duration)
- Price badge shows "FREE" (green) or "$0.99" (styled) per game
- Tapping a game card opens a detail/purchase view

**Purchase flow:**
- Free games: Tap → "Add to Library" confirmation → game added to user's library immediately
- Paid games: Tap → game detail → "Buy for $X.XX" → Stripe Checkout → on success, add to library
- After purchase, show confirmation and option to "Play Now" or return to shop

---

### 4. Start Screen (`/play/[slug]`)

**Purpose:** Pre-game screen shown when a user selects a game from their library. Shows game info and entry points.

**Layout:**
- **Background:** Full-bleed version of the game's thumbnail (blurred/darkened as backdrop)
- **Game title** large and centered
- **"Play" button** — large, prominent → launches the Console
- **"How to Play" button** — opens an overlay/modal with the `rules` markdown rendered as formatted text
- Back button returns to Library

---

### 5. Console (`/play/[slug]/console`)

**Purpose:** The universal game player. This is the core experience — a single component that renders ANY game based on its GameFile.

**Layout — 3 zones:**

#### Top Bar
- Back arrow (←) returns to Start Screen
- Game title displayed in a pill/badge
- Help button (?) — reopens the rules overlay

#### Content Area (main zone — occupies ~70% of screen)
- Displays the current `GameEntry.primary` content (large, centered text or image)
- **Swipe left** to advance to the next entry (randomized order from the GameFile's entries array)
- **Flip/Reveal button** (corner icon, like flipping a card): 
  - If entry has `secondary` content → flip animation reveals it
  - If no secondary content → shows a decorative card-back pattern
- Content transitions with a smooth swipe/fade animation
- Entries are pre-shuffled on Console mount. Reshuffle when all entries exhausted.

#### Bottom Toolbar (3 buttons in a row)
- **Score Tracker** (left) — opens Score Tracker overlay
- **Timer** (center) — displays `MM:SS` countdown
  - Tap to start/pause
  - Long-press (or double-tap) to reset to default
  - When timer hits 00:00: vibration + audio alarm + visual flash
  - Default duration from `GameFile.timer_default_seconds`
  - If timer_default is 0, still show timer but start at 01:00 as fallback
- **Randomizer** (right) — dice icon
  - Tap to generate random result based on `GameFile.randomizer_type`
  - Dice: animated dice roll → shows result (1-6 or custom sides)
  - Letter: random A-Z
  - Color: random color swatch
  - Number: random within configured range
  - Spinner: animated spinning wheel
  - If `randomizer_type` is null, hide this button

---

### 6. Score Tracker (Modal/Overlay on Console)

**Purpose:** Track scores during gameplay. Opens as a slide-up modal over the Console.

**Layout:**
- Title: "Score Tracker"
- Player list with color-coded labels (P1, P2, P3, P4...)
  - Each player has a unique color: red, blue, green, yellow, orange, purple, pink, teal
  - Default names: "Player 1", "Player 2", etc.
  - Score displayed next to name
  - Tap +/- buttons to increment/decrement score (or tap score to type directly)
- **"Edit" button** — switches to edit mode:
  - Player names become editable text inputs
  - Can add players (up to 8) or remove players (minimum 2)
  - Keyboard opens for name input
- **"Clear" button** — resets all scores to 0 (with confirmation)
- Dismiss by tapping outside, swiping down, or X button
- Score state persists for the duration of the Console session (resets when leaving the game)

**Console integration:** The Score Tracker button on the Console toolbar shows a mini-preview of the top 4 scores with their colored P1/P2/P3/P4 labels.

---

### 7. About (`/about`)

Simple info page:
- App name, version
- "By Closet Nerd Digital" (or whatever branding)
- Brief description of Pinyata
- Links to privacy policy, terms, contact

---

## Database Schema (Supabase)

### Tables

```sql
-- Games table (the GameFile storage)
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT,
  min_players INT NOT NULL DEFAULT 2,
  max_players INT NOT NULL DEFAULT 8,
  duration_minutes INT NOT NULL DEFAULT 30,
  tags TEXT[] DEFAULT '{}',
  price INT NOT NULL DEFAULT 0,          -- cents
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  timer_default_seconds INT DEFAULT 0,
  randomizer_type TEXT,                   -- 'dice' | 'letter' | 'color' | 'number' | 'spinner' | null
  randomizer_config JSONB DEFAULT '{}',
  rules TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Game entries (the content cards for each game)
CREATE TABLE game_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  primary_content TEXT NOT NULL,
  secondary_content TEXT,
  category TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0
);

-- User profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User's owned games (join table)
CREATE TABLE user_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  purchased_at TIMESTAMPTZ DEFAULT now(),
  stripe_payment_id TEXT,
  UNIQUE(user_id, game_id)
);

-- Indexes
CREATE INDEX idx_games_slug ON games(slug);
CREATE INDEX idx_games_featured ON games(is_featured) WHERE is_featured = true;
CREATE INDEX idx_games_published ON games(is_published) WHERE is_published = true;
CREATE INDEX idx_game_entries_game ON game_entries(game_id);
CREATE INDEX idx_user_games_user ON user_games(user_id);
```

### Row Level Security

```sql
-- Games: anyone can read published games
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published games" ON games
  FOR SELECT USING (is_published = true);

-- Game entries: anyone can read entries for published games
ALTER TABLE game_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read game entries" ON game_entries
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM games WHERE games.id = game_entries.game_id AND games.is_published = true)
  );

-- User games: users can only see their own
ALTER TABLE user_games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own games" ON user_games
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own games" ON user_games
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## Admin: Adding New Games

The original spec emphasizes that adding games must be dead simple — "drop a GameFile into a folder." For our implementation:

### Option A: Admin Dashboard (recommended — build in Phase 2)
A protected `/admin` route where the game creator can:
- Create/edit games via form UI
- Bulk import entries from CSV/spreadsheet upload
- Toggle featured/published status
- Upload thumbnail images

### Option B: CSV Import Script (ship in Phase 1)
A Node script or Supabase Edge Function that reads a CSV and upserts a game:

```
Column 1: Game metadata (title, description, price, min/max players, duration)
Column 2: Game defaults (timer_default, randomizer_type)  
Column 3: Primary content entries
Column 4: Secondary content (answers/hidden)
Column 5: Tags and metadata
Column 6: Rules text
```

Provide a `/scripts/import-game.ts` CLI tool:
```bash
npx tsx scripts/import-game.ts path/to/game.csv
```

---

## Design Direction

### Modernization Notes

The original mockups used iOS 4-era blue gradients and rounded rect buttons. Modernize to:

- **Color palette:** Warm and playful. Consider a primary of deep plum or rich teal, with a bright accent (coral, gold, or lime). Avoid generic blue.
- **Typography:** Use a bold, playful display font for "Pinyata" brand (e.g., a rounded sans-serif). Clean sans-serif for body (Inter, Plus Jakarta Sans).
- **Cards:** Game cards in library/shop should use subtle shadows, rounded corners (12-16px), and generous padding.
- **Animations:** Smooth page transitions (slide-in from right for navigation, fade for modals). Use Framer Motion.
- **Dark mode:** Support both light and dark themes (Tailwind's `dark:` classes).
- **Mobile-first:** Design for 375px width as the primary target. Scale gracefully to tablet/desktop but this is fundamentally a phone experience.
- **PWA feel:** No browser chrome visible when installed. Proper splash screen, status bar theming, home screen icon.

### Aesthetic References

Think: the polish of a well-designed board game app like Jackbox's menus, crossed with the clean utility of a modern app store listing. Fun but not childish. Premium but not corporate.

---

## Build Phases

### Phase 1: Core MVP
1. Project scaffolding (Next.js 14, Tailwind, Supabase client)
2. Supabase schema + seed data (3 demo games with 50+ entries each)
3. Title Screen with navigation
4. My Library screen (list view only, no auth required — use localStorage)
5. Start Screen (game detail + rules overlay)
6. Console with all 3 zones:
   - Content display with swipe navigation
   - Timer (start/pause/reset/alarm)
   - Score Tracker overlay
   - Randomizer (dice at minimum)
7. Basic Game Shop (browse + "add free game" flow)
8. PWA manifest + service worker

### Phase 2: Polish & Monetization
1. Supabase Auth (email/magic link)
2. Stripe integration for paid games
3. Carousel view in Library
4. Admin dashboard for game management
5. CSV game import tool
6. Sound effects + haptic feedback
7. Animations (Framer Motion page transitions, card flip, dice roll)
8. Dark mode

### Phase 3: Scale
1. Game analytics (popularity tracking, play counts)
2. User favorites / recently played
3. Social sharing (share a game link)
4. Push notifications for new games
5. Offline support (cache owned games for offline play)

---

## File Structure

```
pinyata/
├── public/
│   ├── icons/                   # PWA icons
│   ├── sounds/                  # Timer alarm, button clicks
│   └── manifest.json
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── page.tsx             # Title Screen
│   │   ├── library/
│   │   │   └── page.tsx         # My Library
│   │   ├── shop/
│   │   │   └── page.tsx         # Game Shop
│   │   ├── play/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx     # Start Screen
│   │   │       └── console/
│   │   │           └── page.tsx # Console (game player)
│   │   ├── about/
│   │   │   └── page.tsx
│   │   └── admin/               # Phase 2
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/                  # Button, Card, Modal, Input, Badge, etc.
│   │   ├── Header.tsx           # Global branded header
│   │   ├── GameCard.tsx         # Reusable game list item (library + shop)
│   │   ├── Console/
│   │   │   ├── ContentArea.tsx  # Swipeable content display
│   │   │   ├── Timer.tsx        # Countdown timer
│   │   │   ├── ScoreTracker.tsx # Score modal
│   │   │   ├── Randomizer.tsx   # Dice/letter/color generator
│   │   │   └── FlipCard.tsx     # Card flip animation
│   │   ├── RulesOverlay.tsx     # How to Play modal
│   │   └── SearchBar.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts        # Browser client
│   │   │   ├── server.ts        # Server client
│   │   │   └── types.ts         # Generated DB types
│   │   ├── stripe.ts            # Phase 2
│   │   ├── localStorage.ts      # Owned games for unauth users
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useTimer.ts
│   │   ├── useGameEntries.ts    # Shuffle + iterate entries
│   │   ├── useScoreTracker.ts
│   │   └── useSwipe.ts          # Touch swipe detection
│   ├── types/
│   │   └── game.ts              # GameFile, GameEntry interfaces
│   └── styles/
│       └── globals.css
├── supabase/
│   ├── migrations/              # SQL migration files
│   └── seed.sql                 # Demo game data
├── scripts/
│   └── import-game.ts           # CSV import tool
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Key Implementation Notes

### Content Swipe (Console)
- Use touch events or a library like `react-swipeable` for left-swipe detection
- Pre-shuffle the entries array using Fisher-Yates on Console mount
- Track current index; when reaching the end, reshuffle and restart
- Swipe animation: current card slides left, new card slides in from right

### Timer Hook
```typescript
// useTimer.ts — key behaviors
// - Counts DOWN from a configurable start value
// - Tap: toggle start/pause
// - Long press (>500ms): reset to default
// - On reaching 0: trigger vibration (navigator.vibrate) + play alarm sound + flash screen
// - Auto-reset after alarm
```

### Score Tracker State
- Use React state (useState/useReducer) — NOT localStorage
- Lives only as long as the Console is mounted
- Shape: `{ players: Array<{ id: string; name: string; color: string; score: number }> }`
- Initialize with the game's `min_players` count, all at score 0

### Randomizer Animations
- Dice: CSS animation (tumble/rotate) for ~1 second, then land on result
- Letter: Slot-machine style rapid cycling, then settle
- Color: Spinning color wheel or rapid flashing, then settle
- Keep it snappy — 0.5-1 second animation max

### PWA Configuration
```json
// manifest.json essentials
{
  "name": "Pinyata Game Library",
  "short_name": "Pinyata",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a2e",
  "theme_color": "#1a1a2e",
  "orientation": "portrait"
}
```

### localStorage Strategy (Pre-Auth)
Before Supabase Auth is wired up, store owned game IDs in localStorage:
```typescript
// lib/localStorage.ts
const OWNED_GAMES_KEY = 'pinyata_owned_games';

export function getOwnedGameIds(): string[] { ... }
export function addOwnedGame(gameId: string): void { ... }
export function isGameOwned(gameId: string): boolean { ... }
```

When auth is added in Phase 2, migrate localStorage games to `user_games` table on first login.

---

## IMPORTANT: Instructions for Claude Code

1. **Start with Phase 1 only.** Do not build auth, Stripe, or admin until the core flow works end to end.

2. **Seed data is critical.** The app is meaningless without actual game content. Write 3 complete seed games with 50+ entries each. Make them genuinely fun/playable.

3. **Mobile-first viewport.** Every component should be designed for a ~375px wide screen. Use a phone-frame wrapper during development if helpful, but the actual app should be responsive.

4. **The Console is the heart of the app.** Spend the most time here. The swipe interaction, flip animation, timer, and score tracker must feel smooth and polished.

5. **GameFiles are pure data.** Never hardcode game logic. The Console should be able to play ANY game just by reading its GameFile. If you find yourself writing game-specific code, you're doing it wrong.

6. **Use `--dangerously-skip-permissions` for Claude Code.**

7. **Test with real content.** Don't use "Lorem ipsum" or placeholder text in game entries. Write real prompts, questions, and content.

8. **Animations matter.** This is a party game app — it should feel alive. Use Framer Motion for page transitions and micro-interactions. CSS transitions for the card flip and dice roll.

9. **Touch interactions are first-class.** Swipe, long-press, and tap must all work reliably on mobile. Test touch events carefully.

10. **The app should work offline** after initial load (at least for owned games). Service worker should cache game data.

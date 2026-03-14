import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ryxrgbvymudmqqpefmmf.supabase.co";
const serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5eHJnYnZ5bXVkbXFxcGVmbW1mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTIwMzkxMSwiZXhwIjoyMDg2Nzc5OTExfQ.s6HwjZzz10-O68m-7CPkkyYV43kjuojpUp167nIGNzI";

const supabase = createClient(supabaseUrl, serviceKey);

const GAMES = [
  {
    slug: "hot-takes",
    title: "Hot Takes",
    description: "Spicy debate prompts that will divide the room. Pick a side and defend it!",
    thumbnail_url: "/icons/hot-takes.svg",
    min_players: 3, max_players: 8, duration_minutes: 20,
    tags: ["debate", "party", "adults", "opinions"],
    price: 0, is_featured: true, is_published: true,
    timer_default_seconds: 0, randomizer_type: null, randomizer_config: {},
    rules: "## How to Play Hot Takes\n\n1. **Read the prompt** out loud to the group.\n2. Everyone picks a side — **agree or disagree**.\n3. Each side has **30 seconds** to make their case.\n4. The group **votes** on who made the better argument.\n5. The winning side gets **1 point** each.\n6. Swipe for the next prompt!\n\n**House Rules:** No fence-sitting allowed — you must pick a side!",
    entries: [
      { primary_content: "Pineapple belongs on pizza", secondary_content: "It adds a sweet contrast that complements salty ham perfectly" },
      { primary_content: "It's acceptable to recline your seat on an airplane", secondary_content: "You paid for the seat, the recline feature exists for a reason" },
      { primary_content: "Breakfast for dinner is superior to dinner for breakfast", secondary_content: "Pancakes at 8pm hit different than steak at 7am" },
      { primary_content: "The toilet paper roll should go over, not under", secondary_content: "The original patent actually shows it going over" },
      { primary_content: "Hot dogs are sandwiches", secondary_content: "By structural definition: filling between bread = sandwich" },
      { primary_content: "It's okay to text 'K' as a full response", secondary_content: "Sometimes brevity is the soul of communication" },
      { primary_content: "Cereal is soup", secondary_content: "Liquid + solid ingredients in a bowl = soup by definition" },
      { primary_content: "The book is always better than the movie", secondary_content: "Books allow for deeper character development and imagination" },
      { primary_content: "You should shower in the morning, not at night", secondary_content: "Starting the day fresh vs. keeping your sheets clean" },
      { primary_content: "Cats are better pets than dogs", secondary_content: "Independent, clean, and don't need walks in the rain" },
      { primary_content: "It's fine to wear socks with sandals", secondary_content: "Comfort should always beat fashion rules" },
      { primary_content: "Social media has done more harm than good", secondary_content: "Connected billions but also increased anxiety and misinformation" },
      { primary_content: "GIF should be pronounced with a hard G", secondary_content: "It stands for Graphics — not Jraphics" },
      { primary_content: "Working from home is better than office work", secondary_content: "No commute, flexible schedule, pants optional" },
      { primary_content: "Tipping culture should be abolished", secondary_content: "Employers should pay fair wages instead" },
      { primary_content: "Die Hard is a Christmas movie", secondary_content: "It takes place at a Christmas party and has a redemption arc" },
      { primary_content: "You should eat the pizza crust", secondary_content: "It's basically free breadsticks" },
      { primary_content: "Monday is the worst day of the week", secondary_content: "Sunday evening dread is arguably worse" },
      { primary_content: "It's rude to show up exactly on time to a house party", secondary_content: "Fashionably late gives the host time to prepare" },
      { primary_content: "Sparkling water is just angry water", secondary_content: "The carbonation adds texture and sophistication" },
      { primary_content: "People who back into parking spots are showing off", secondary_content: "It's actually safer when leaving the spot" },
      { primary_content: "You should always split the bill equally", secondary_content: "Even if someone ordered way more — it's simpler" },
      { primary_content: "Summer is the most overrated season", secondary_content: "Too hot, too crowded, too many bugs" },
      { primary_content: "Alien life definitely exists somewhere", secondary_content: "The universe is too vast for us to be alone" },
      { primary_content: "It's weird to clap when the plane lands", secondary_content: "The pilot did their literal job" },
      { primary_content: "Chocolate ice cream is overrated", secondary_content: "Vanilla is the true king — more versatile, pairs with everything" },
      { primary_content: "You should never double-text someone", secondary_content: "Eagerness shouldn't be punished" },
      { primary_content: "Reality TV is a guilty pleasure everyone should admit to", secondary_content: "It's entertainment, not a character flaw" },
      { primary_content: "Cold pizza is better than reheated pizza", secondary_content: "The flavors meld overnight and the texture is perfect" },
      { primary_content: "Adulthood is just pretending you know what you're doing", secondary_content: "Nobody actually has it figured out" },
      { primary_content: "It's okay to ghost someone after one date", secondary_content: "You don't owe a stranger an explanation" },
      { primary_content: "Brunch is the greatest meal ever invented", secondary_content: "Day drinking + breakfast food = perfection" },
      { primary_content: "You should put your phone away at concerts", secondary_content: "Live in the moment instead of filming for Instagram" },
      { primary_content: "Board games are more fun than video games", secondary_content: "Face-to-face interaction can't be replicated digitally" },
      { primary_content: "People who use speakerphone in public should be fined", secondary_content: "Some people have hearing difficulties though" },
      { primary_content: "It's fine to talk to strangers in elevators", secondary_content: "A little human connection never hurt anyone" },
      { primary_content: "Breakfast is the most important meal of the day", secondary_content: "This was actually invented by a cereal company" },
      { primary_content: "You should always say yes to karaoke", secondary_content: "Nobody cares if you can sing — it's about the energy" },
      { primary_content: "Astrology is just personality fan fiction", secondary_content: "But it's fun and mostly harmless" },
      { primary_content: "The middle seat on a plane gets both armrests", secondary_content: "It's the unwritten rule of air travel" },
      { primary_content: "Ranch dressing goes with everything", secondary_content: "Pizza, wings, vegetables, fries — name something it doesn't work on" },
      { primary_content: "It's wrong to eat food at the grocery store before paying", secondary_content: "You're going to pay for it anyway" },
      { primary_content: "Naps are a sign of weakness", secondary_content: "Actually, many top performers swear by power naps" },
      { primary_content: "The Oxford comma is essential", secondary_content: "Without it: 'I love my parents, Batman and Wonder Woman'" },
      { primary_content: "Camping is just voluntarily being homeless", secondary_content: "Nature, stars, campfires — it's about the experience" },
      { primary_content: "You should never lend money to friends", secondary_content: "It always changes the dynamic of the relationship" },
      { primary_content: "Crocs are genuinely great shoes", secondary_content: "Comfortable, waterproof, and now fashion-forward" },
      { primary_content: "The best superpower would be time travel", secondary_content: "Flying, invisibility, and super strength are all better" },
      { primary_content: "It's okay to re-gift something you received", secondary_content: "Reduce waste, and the gift finds someone who appreciates it" },
      { primary_content: "New Year's Eve is the most overrated holiday", secondary_content: "Overpriced, overhyped, and always a letdown" },
      { primary_content: "You should always tell someone if they have food in their teeth", secondary_content: "A moment of embarrassment beats hours of oblivion" },
      { primary_content: "Robots will eventually take all our jobs", secondary_content: "They'll create new jobs we can't even imagine yet" },
    ],
  },
  {
    slug: "speed-sketch",
    title: "Speed Sketch",
    description: "Draw fast, guess faster! Race against the clock to sketch prompts for your team.",
    thumbnail_url: "/icons/speed-sketch.svg",
    min_players: 3, max_players: 10, duration_minutes: 30,
    tags: ["drawing", "team", "fast-paced", "creative"],
    price: 0, is_featured: true, is_published: true,
    timer_default_seconds: 60, randomizer_type: "dice", randomizer_config: { sides: 6 },
    rules: "## How to Play Speed Sketch\n\n1. Split into **two teams**.\n2. One player from the active team is the **Sketcher**.\n3. The Sketcher sees the prompt — **no talking, no letters, no numbers!**\n4. Start the **60-second timer** and sketch!\n5. Your team shouts guesses. If they get it, score a point!\n6. If time runs out, the other team gets **one guess** to steal.\n7. Alternate teams. First to **10 points** wins!\n\n**Pro tip:** Use the dice randomizer to decide who sketches first!",
    entries: [
      { primary_content: "Astronaut", secondary_content: "Space", category: "People" },
      { primary_content: "Spaghetti", secondary_content: "Food", category: "Food & Drink" },
      { primary_content: "Treehouse", secondary_content: "Buildings", category: "Places" },
      { primary_content: "Surfing", secondary_content: "Sports", category: "Activities" },
      { primary_content: "Volcano", secondary_content: "Nature", category: "Nature" },
      { primary_content: "DJ", secondary_content: "Music", category: "People" },
      { primary_content: "Roller coaster", secondary_content: "Amusement park", category: "Places" },
      { primary_content: "Snowman", secondary_content: "Winter", category: "Seasonal" },
      { primary_content: "Mermaid", secondary_content: "Fantasy", category: "Mythology" },
      { primary_content: "Hamburger", secondary_content: "Fast food", category: "Food & Drink" },
      { primary_content: "Parachute", secondary_content: "Skydiving", category: "Activities" },
      { primary_content: "Lighthouse", secondary_content: "Coastal", category: "Places" },
      { primary_content: "Unicorn", secondary_content: "Fantasy", category: "Mythology" },
      { primary_content: "Popcorn", secondary_content: "Snacks", category: "Food & Drink" },
      { primary_content: "Firefighter", secondary_content: "Emergency", category: "People" },
      { primary_content: "Igloo", secondary_content: "Arctic", category: "Places" },
      { primary_content: "Skateboard", secondary_content: "Sports", category: "Activities" },
      { primary_content: "Cactus", secondary_content: "Desert", category: "Nature" },
      { primary_content: "Pirate ship", secondary_content: "Adventure", category: "Vehicles" },
      { primary_content: "Wedding cake", secondary_content: "Celebration", category: "Food & Drink" },
      { primary_content: "Tornado", secondary_content: "Weather", category: "Nature" },
      { primary_content: "Robot", secondary_content: "Technology", category: "Sci-Fi" },
      { primary_content: "Penguin", secondary_content: "Animals", category: "Animals" },
      { primary_content: "Guitar", secondary_content: "Instruments", category: "Music" },
      { primary_content: "Waterfall", secondary_content: "Nature", category: "Nature" },
      { primary_content: "Ninja", secondary_content: "Martial arts", category: "People" },
      { primary_content: "Hot air balloon", secondary_content: "Flying", category: "Vehicles" },
      { primary_content: "Dragon", secondary_content: "Fantasy", category: "Mythology" },
      { primary_content: "Ice cream sundae", secondary_content: "Desserts", category: "Food & Drink" },
      { primary_content: "Scuba diving", secondary_content: "Ocean", category: "Activities" },
      { primary_content: "Haunted house", secondary_content: "Spooky", category: "Places" },
      { primary_content: "Elephant", secondary_content: "Animals", category: "Animals" },
      { primary_content: "Helicopter", secondary_content: "Aircraft", category: "Vehicles" },
      { primary_content: "Birthday party", secondary_content: "Celebration", category: "Events" },
      { primary_content: "Cowboy", secondary_content: "Western", category: "People" },
      { primary_content: "Palm tree", secondary_content: "Tropical", category: "Nature" },
      { primary_content: "Treasure chest", secondary_content: "Pirates", category: "Objects" },
      { primary_content: "Breakfast in bed", secondary_content: "Morning", category: "Activities" },
      { primary_content: "Butterfly", secondary_content: "Insects", category: "Animals" },
      { primary_content: "Castle", secondary_content: "Medieval", category: "Places" },
      { primary_content: "Sushi", secondary_content: "Japanese food", category: "Food & Drink" },
      { primary_content: "Mountain climbing", secondary_content: "Adventure", category: "Activities" },
      { primary_content: "Submarine", secondary_content: "Underwater", category: "Vehicles" },
      { primary_content: "Giraffe", secondary_content: "Animals", category: "Animals" },
      { primary_content: "Camping tent", secondary_content: "Outdoors", category: "Objects" },
      { primary_content: "Ballerina", secondary_content: "Dance", category: "People" },
      { primary_content: "Thunderstorm", secondary_content: "Weather", category: "Nature" },
      { primary_content: "Tacos", secondary_content: "Mexican food", category: "Food & Drink" },
      { primary_content: "Wizard", secondary_content: "Magic", category: "Mythology" },
      { primary_content: "Skiing", secondary_content: "Winter sports", category: "Activities" },
      { primary_content: "Octopus", secondary_content: "Sea creature", category: "Animals" },
      { primary_content: "Spaceship", secondary_content: "Sci-fi", category: "Vehicles" },
      { primary_content: "Ferris wheel", secondary_content: "Carnival", category: "Places" },
    ],
  },
  {
    slug: "two-truths",
    title: "Two Truths & a Lie",
    description: "Share two truths and one lie about yourself. Can your friends spot the fib?",
    thumbnail_url: "/icons/two-truths.svg",
    min_players: 2, max_players: 20, duration_minutes: 15,
    tags: ["icebreaker", "social", "getting-to-know-you", "party"],
    price: 0, is_featured: false, is_published: true,
    timer_default_seconds: 0, randomizer_type: null, randomizer_config: {},
    rules: "## How to Play Two Truths & a Lie\n\n1. Each card shows a **theme or category**.\n2. The active player thinks of **two true things** and **one lie** about themselves related to that theme.\n3. Share all three statements with the group.\n4. Everyone else **guesses which one is the lie**!\n5. Score **1 point** for each person you fool.\n6. Guessers score **1 point** for spotting the lie.\n7. Swipe for the next theme!\n\n**Tips:** The best lies are specific and believable. Mix mundane truths with an outrageous one!",
    entries: [
      { primary_content: "Travel Adventures" }, { primary_content: "Childhood Memories" },
      { primary_content: "Food & Eating Habits" }, { primary_content: "Hidden Talents" },
      { primary_content: "Embarrassing Moments" }, { primary_content: "Celebrity Encounters" },
      { primary_content: "School Days" }, { primary_content: "Fears & Phobias" },
      { primary_content: "Jobs You've Had" }, { primary_content: "Sports & Athletics" },
      { primary_content: "Music & Concerts" }, { primary_content: "Family Stories" },
      { primary_content: "Late Night Adventures" }, { primary_content: "Things You've Broken" },
      { primary_content: "Pets & Animals" }, { primary_content: "Your Biggest Accomplishment" },
      { primary_content: "Movies & TV Shows" }, { primary_content: "Cooking Disasters" },
      { primary_content: "Things You Collect" }, { primary_content: "First Date Stories" },
      { primary_content: "Your Worst Habit" }, { primary_content: "Dream Vacations" },
      { primary_content: "Things You've Won" }, { primary_content: "Unusual Skills" },
      { primary_content: "Books That Changed You" }, { primary_content: "Your Morning Routine" },
      { primary_content: "Technology Fails" }, { primary_content: "Fashion Choices" },
      { primary_content: "Superstitions You Have" }, { primary_content: "Things You've Built" },
      { primary_content: "Languages & Communication" }, { primary_content: "Your Bucket List" },
      { primary_content: "Holidays & Traditions" }, { primary_content: "Hobbies Past & Present" },
      { primary_content: "Your Hometown" }, { primary_content: "Roommate Stories" },
      { primary_content: "Things That Scare You" }, { primary_content: "Favorite Childhood Toy" },
      { primary_content: "Road Trip Tales" }, { primary_content: "Your Secret Obsession" },
      { primary_content: "Dance Moves" }, { primary_content: "Things You've Lost" },
      { primary_content: "Your Weirdest Purchase" }, { primary_content: "Outdoor Adventures" },
      { primary_content: "Things You Do When Nobody's Watching" }, { primary_content: "Your Guilty Pleasure" },
      { primary_content: "Nicknames You've Had" }, { primary_content: "Life-Changing Moments" },
      { primary_content: "Your Biggest Fear" }, { primary_content: "Something You've Never Told Anyone" },
      { primary_content: "Your Proudest Moment" }, { primary_content: "The Strangest Thing You've Eaten" },
    ],
  },
];

async function main() {
  console.log("Seeding Pinyata database...\n");

  for (const game of GAMES) {
    const { entries, ...gameData } = game;

    const { data, error } = await supabase
      .from("games")
      .upsert(gameData, { onConflict: "slug" })
      .select("id")
      .single();

    if (error) { console.error(`FAIL ${game.title}:`, error.message); continue; }
    console.log(`Game: ${game.title} (${data.id})`);

    await supabase.from("game_entries").delete().eq("game_id", data.id);

    const rows = entries.map((e, i) => ({ ...e, game_id: data.id, sort_order: i }));
    const { error: eErr } = await supabase.from("game_entries").insert(rows);
    if (eErr) console.error(`  entries failed:`, eErr.message);
    else console.log(`  ${entries.length} entries inserted`);
  }
  console.log("\nDone!");
}

main();

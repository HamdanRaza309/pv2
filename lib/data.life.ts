/* ──────────────────────────────────────────────────────────────
   ⚠️  ALL CONTENT IN THIS FILE IS DUMMY / PLACEHOLDER DATA  ⚠️
   It exists solely so the Life page renders with realistic
   text volume for layout evaluation. Replace every entry with
   your real content before deploying.
   ────────────────────────────────────────────────────────────── */

import { personal } from "./data";

/** Re-export shared identity so Life page can reference name/email/socials */
export { personal };

/* ── Informal Bio ─────────────────────────────────────────── */
export const informalBio = {
  headline: "Off the Clock",
  greeting:
    "[DUMMY] When I'm not shipping code or reading papers about neural decoding, you'll usually find me hiking through the mountains of northern Pakistan, experimenting with street photography, or debating whether chapli kebab is the greatest food invention of all time.",
  bio: "[DUMMY] I grew up in Peshawar — a city with more history than most countries and more kebab shops than traffic lights. I'm endlessly curious, slightly obsessed with how the brain works, and I believe the best ideas come when you're far away from a screen. On weekends I'm either exploring trails in Swat Valley, tinkering with film cameras, or losing hours in a bookstore. I care about good design, honest conversations, and chai that's been brewed properly.",
};

/* ── Hobbies & Interests ──────────────────────────────────── */
export const hobbies: {
  title: string;
  emoji?: string;
  description: string;
  image?: string;
}[] = [
  {
    title: "Photography",
    emoji: "📸",
    description:
      "[DUMMY] Street and landscape photography — I always carry a camera when traveling. Currently shooting on a Fujifilm X-T4 and learning to develop black-and-white film at home. There's something meditative about composing a frame and waiting for the right light.",
  },
  {
    title: "Hiking & Trekking",
    emoji: "🥾",
    description:
      "[DUMMY] Weekend hikes in the mountains around Peshawar and multi-day treks through the Swat Valley, Chitral, and Gilgit-Baltistan. My favorite trail so far is the Fairy Meadows trek — waking up to a direct view of Nanga Parbat is hard to beat.",
  },
];

/* ── Photo Gallery ────────────────────────────────────────── */
/** NOTE: `src` is left empty for dummy entries. The Life page
 *  component handles empty src by rendering a colored placeholder
 *  box instead of a broken <Image>. Replace with real paths. */
export const photoGallery: {
  src: string;
  alt: string;
  caption?: string;
}[] = [
  {
    src: "",
    alt: "[DUMMY] Sunset over Swat Valley",
    caption: "[DUMMY] Golden hour somewhere near Kalam, Swat Valley — Summer 2024",
  },
  {
    src: "",
    alt: "[DUMMY] Street scene in Peshawar's old city",
    caption: "[DUMMY] Qissa Khwani Bazaar, Peshawar — the storytellers' market",
  },
];

/* ── Personal Projects (non-work) ─────────────────────────── */
export const personalProjects: {
  title: string;
  description: string;
  link?: string;
}[] = [
  {
    title: "[DUMMY] Northern Pakistan Photo Journal",
    description:
      "A photo-and-essay blog documenting trips through Swat, Chitral, Hunza, and Gilgit-Baltistan. Each post pairs landscape photography with short reflections on the history, culture, and people of the region.",
    link: "#",
  },
  {
    title: "[DUMMY] Chai & Conversations Podcast",
    description:
      "An informal podcast where I sit down with friends, classmates, and strangers over chai to talk about life, ambitions, and everything in between. Five episodes recorded so far — planning to release them once I figure out audio editing.",
  },
];

/* ── Favorite Things ──────────────────────────────────────── */
export const favorites: {
  category: string;
  items: string[];
}[] = [
  {
    category: "Books",
    items: [
      "[DUMMY] Thinking, Fast and Slow — Daniel Kahneman",
      "[DUMMY] The Man Who Mistook His Wife for a Hat — Oliver Sacks",
    ],
  },
  {
    category: "Music",
    items: [
      "[DUMMY] Coke Studio Pakistan — Seasons 10–14",
      "[DUMMY] Lo-fi beats for late-night coding",
    ],
  },
];

/* ── Section nav for Life page ────────────────────────────── */
export const lifeNav = [
  { label: "About", href: "#about-me" },
  { label: "Hobbies", href: "#hobbies" },
  { label: "Gallery", href: "#gallery" },
  { label: "Projects", href: "#personal-projects" },
  { label: "Favorites", href: "#favorites" },
];

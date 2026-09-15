/* ──────────────────────────────────────────────────────────────
   Off the Clock Persona — Data  (lib/data.life.ts)
   All placeholder content is clearly marked.
   Replace bracketed text with your real content.
   ────────────────────────────────────────────────────────────── */

import { personal } from "./data";

/** Re-export shared identity so Life page can reference name/email/socials */
export { personal };

/* ── Informal Bio ─────────────────────────────────────────── */
export const informalBio = {
  headline: "Off the Clock",
  greeting: "[PLACEHOLDER — A casual, friendly greeting. Example: 'When I'm not shipping code or reading papers, here's what I'm usually up to.']",
  bio: "[PLACEHOLDER — A warm, informal paragraph about who you are outside of work. Hobbies, personality, what makes you tick. Write it like you're talking to a friend.]",
};

/* ── Hobbies & Interests ──────────────────────────────────── */
export const hobbies: {
  title: string;
  emoji?: string;
  description: string;
  image?: string;
}[] = [
  /* PLACEHOLDER — Add your hobbies here. Example:
  {
    title: "Photography",
    emoji: "📸",
    description: "Street and landscape photography. I always have a camera in my bag.",
    image: "/assets/life/photography.jpg",
  },
  {
    title: "Hiking",
    emoji: "🥾",
    description: "Weekend hikes in the mountains around Peshawar and northern Pakistan.",
    image: "/assets/life/hiking.jpg",
  },
  */
];

/* ── Photo Gallery ────────────────────────────────────────── */
export const photoGallery: {
  src: string;
  alt: string;
  caption?: string;
}[] = [
  /* PLACEHOLDER — Add your personal photos here. Example:
  {
    src: "/assets/life/sunset.jpg",
    alt: "Sunset over the mountains",
    caption: "Somewhere in Swat Valley, 2024",
  },
  */
];

/* ── Personal Projects (non-work) ─────────────────────────── */
export const personalProjects: {
  title: string;
  description: string;
  link?: string;
}[] = [
  /* PLACEHOLDER — Add personal / side projects unrelated to engineering. Example:
  {
    title: "Travel Blog",
    description: "A photo journal of trips around northern Pakistan.",
    link: "https://...",
  },
  */
];

/* ── Favorite Things ──────────────────────────────────────── */
export const favorites: {
  category: string;
  items: string[];
}[] = [
  /* PLACEHOLDER — Add your favorite things. Example:
  {
    category: "Books",
    items: ["Thinking, Fast and Slow", "The Design of Everyday Things"],
  },
  {
    category: "Music",
    items: ["Lo-fi beats", "Coke Studio Pakistan"],
  },
  {
    category: "Food",
    items: ["Chapli Kebab", "Namak Mandi BBQ"],
  },
  */
];

/* ── Section nav for Life page ────────────────────────────── */
export const lifeNav = [
  { label: "About", href: "#about-me" },
  { label: "Hobbies", href: "#hobbies" },
  { label: "Gallery", href: "#gallery" },
  { label: "Projects", href: "#personal-projects" },
  { label: "Favorites", href: "#favorites" },
];

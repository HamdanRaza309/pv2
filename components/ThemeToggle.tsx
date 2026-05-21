"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-fg/15 hover:bg-fg/5 transition"
    >
      <Sun className={`h-4 w-4 ${isDark ? "hidden" : "block"}`} />
      <Moon className={`h-4 w-4 ${isDark ? "block" : "hidden"}`} />
    </button>
  );
}

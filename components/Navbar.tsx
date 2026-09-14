"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { nav, personal } from "@/lib/data";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-bg/85 border-b border-fg/10"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between">
        {/* Logo/name on the left, styled in italic serif with a trailing period */}
        <a
          href="#top"
          className="group flex items-center transition-opacity hover:opacity-80"
        >
          <span className="font-serif italic text-2xl sm:text-3xl font-normal text-fg tracking-tight">
            {personal.name.split(" ")[0]}.
          </span>
        </a>

        {/* Centered horizontal nav links in simple sans-serif */}
        <nav className="hidden md:flex items-center gap-8">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs uppercase tracking-[0.18em] text-fg/70 hover:text-fg transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Far right: Theme Toggle + Black pill-shaped Contact button */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center justify-center rounded-full bg-fg text-bg px-6 py-2.5 text-xs uppercase font-mono tracking-wider font-medium hover:opacity-90 transition active:scale-[0.98]"
          >
            Contact
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-fg/20 text-fg"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {open && (
        <div className="md:hidden border-b border-fg/10 bg-bg/95 backdrop-blur-lg px-6 py-6 transition-all">
          <nav className="flex flex-col gap-4">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-widest text-fg/80 hover:text-fg py-1.5"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-full bg-fg text-bg px-6 py-2.5 text-xs uppercase font-mono tracking-wider font-medium w-full mt-2"
            >
              Contact
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

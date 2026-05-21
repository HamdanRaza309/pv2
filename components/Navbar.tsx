"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { nav, personal } from "@/lib/data";
import hamdanPhoto from "@/assets/hamdan.png";

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
          ? "backdrop-blur-md bg-bg/70 border-b border-fg/10"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between">
        <a
          href="#top"
          className="flex items-center gap-2 font-mono text-sm tracking-wider"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full border border-fg/20 overflow-hidden">
            <Image
              src={hamdanPhoto}
              alt={`${personal.name} profile photo`}
              className="h-full w-full object-cover"
              priority
            />
          </span>
          <span className="hidden sm:inline text-fg/80">{personal.name}</span>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-fg/70 hover:text-fg transition link-underline"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="#contact"
            className="hidden sm:inline-flex btn-primary text-xs px-4 py-2"
          >
            Get in touch
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-fg/15"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-fg/10 bg-bg/95 backdrop-blur">
          <nav className="container-x py-4 flex flex-col gap-3">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm text-fg/80 hover:text-fg py-1"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="btn-primary w-fit text-xs px-4 py-2 mt-1"
            >
              Get in touch
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

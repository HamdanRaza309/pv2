"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, BookOpen, Coffee, ChevronDown } from "lucide-react";

const personas = [
  { label: "Engineer", href: "/engineer", icon: Code2 },
  { label: "Research", href: "/research", icon: BookOpen },
  { label: "Off the Clock", href: "/life", icon: Coffee },
] as const;

export function PersonaSwitcher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Determine which persona is active
  const active = personas.find((p) => pathname.startsWith(p.href)) ?? personas[0];
  const ActiveIcon = active.icon;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`
          inline-flex items-center gap-1.5 rounded-full px-3 py-1.5
          text-[10px] sm:text-[11px] uppercase tracking-[0.12em] font-mono
          border border-fg/15 bg-fg/[0.03] hover:bg-fg/[0.07]
          transition-all duration-200 whitespace-nowrap text-fg/70 hover:text-fg
        `}
      >
        <ActiveIcon className="h-3 w-3" />
        <span>{active.label}</span>
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full mt-2 min-w-[180px] rounded-xl border border-fg/10 bg-bg/95 backdrop-blur-xl shadow-lg overflow-hidden z-50 animate-fade-in">
          {personas.map(({ label, href, icon: Icon }) => {
            const isActive = active.href === href;
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-2.5 px-4 py-2.5
                  text-[11px] uppercase tracking-[0.12em] font-mono
                  transition-colors duration-150
                  ${isActive
                    ? "bg-fg/10 text-fg font-medium"
                    : "text-fg/60 hover:text-fg hover:bg-fg/[0.04]"
                  }
                `}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-fg" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

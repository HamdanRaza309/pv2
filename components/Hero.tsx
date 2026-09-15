import Image from "next/image";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { personal } from "@/lib/data";
import type { SiteSettings } from "@/lib/supabase/types";

const DEFAULT_PORTRAIT =
  "https://tnpbnridezldixmriner.supabase.co/storage/v1/object/public/portfolio/avatars/hamdan_cutout.png";

interface HeroProps {
  settings?: SiteSettings;
}

export function Hero({ settings }: HeroProps = {}) {
  const profile = settings || {
    name: personal.name,
    initials: personal.initials,
    role: personal.role,
    tagline: personal.tagline,
    intro: personal.intro,
    location: personal.location,
    analytics: personal.analytics,
    availability: personal.availability,
    email: personal.email,
    resume_url: personal.resume,
    portrait_url: null,
    socials: personal.socials,
  };

  const isPortraitVisible =
    (profile as any).socials?.portrait_visible ??
    (profile as any).portrait_visible ??
    true;

  const portraitSrc =
    profile.portrait_url && !profile.portrait_url.startsWith("/assets/")
      ? profile.portrait_url
      : DEFAULT_PORTRAIT;

  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex flex-col justify-between pt-24 sm:pt-28 pb-10 sm:pb-12 hero-warm-gradient overflow-hidden border-b border-fg/10"
    >
      <div className="container-x relative w-full flex-1 flex flex-col justify-between">

        {/* ========================================================================= */}
        {/* DESKTOP HERO (lg:block ≥1024px) — Exact Reference Layered Overlap Composition */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex relative w-full max-w-6xl mx-auto flex-1 flex-col justify-between pt-4">

          {/* Central Large Portrait Photo — Connecting the whole hero into one visual */}
          {isPortraitVisible && portraitSrc && (
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[580px] lg:w-[640px] xl:w-[700px] aspect-[4/5] z-10 pointer-events-none select-none">
              <Image
                src={portraitSrc}
                alt={profile.name}
                fill
                priority
                unoptimized={typeof portraitSrc === "string"}
                className="object-contain object-top"
                style={{
                  maskImage: "linear-gradient(to bottom, black 65%, transparent 96%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 65%, transparent 96%)",
                }}
                sizes="(min-width: 1024px) 700px"
              />
            </div>
          )}

          {/* Top Layer: "Hey, [Head] there" Script */}
          <div className="relative z-0 flex items-center justify-between w-full pt-4 select-none pointer-events-none">
            <span className="font-serif italic font-normal text-8xl xl:text-[11rem] leading-none text-fg/85 pl-2">
              Hey,
            </span>
            <span className="font-serif italic font-normal text-8xl xl:text-[11rem] leading-none text-fg/85 pr-2">
              there
            </span>
          </div>

          {/* Middle Layer: Badge on Left, Specialization Text on Right (flanking shoulders) */}
          <div className="relative z-20 flex items-center justify-between w-full mt-8 xl:mt-10">
            {/* Left: Available Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-black/10 dark:border-white/15 bg-white/90 dark:bg-black/70 backdrop-blur-md px-4 py-2 shadow-sm text-xs font-mono uppercase tracking-wider text-fg">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <span>{profile.availability}</span>
            </div>

            {/* Right: Small Specialization Paragraph */}
            <p className="max-w-[240px] xl:max-w-[280px] text-xs text-fg/80 leading-relaxed text-right font-normal">
              {profile.intro}
            </p>
          </div>

          {/* Bottom Layer: "I AM [NAME]" on Left, Role & CTAs on Right (flanking chest/waist) */}
          <div className="relative z-20 flex items-end justify-between w-full mt-6 xl:mt-10">
            {/* Left: Bold condensed headline */}
            <div className="max-w-xl">
              <h1 className="font-display font-bold uppercase tracking-tight text-5xl sm:text-6xl xl:text-7xl leading-[0.88] text-fg">
                <span className="font-serif italic normal-case text-4xl sm:text-5xl font-normal block mb-1 text-fg/80">
                  I am
                </span>
                {profile.name.split(" ")[0]} <br />
                {profile.name.split(" ")[1] || ""}
              </h1>
            </div>

            {/* Right: Role, Location, & Action Buttons */}
            <div className="flex flex-col items-end text-right">
              <div className="font-display font-bold uppercase tracking-tight text-xl lg:text-[1.85rem] xl:text-[2.15rem] leading-[0.95] text-fg">
                FULL-STACK <br />
                AI ENGINEER
              </div>

              {/* Pill CTA buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <a href="#contact" className="btn-primary">
                  <span>Get in touch</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <a href="#projects" className="btn-secondary">
                  View work
                </a>
                <a
                  href={personal.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Resume
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE HERO (<1024px) — Vertical Column Layout with Cutout Photo */}
        {/* ========================================================================= */}
        <div className="lg:hidden flex flex-col items-center justify-between w-full flex-1 pt-2 pb-4">
          {/* Status Row */}
          <div className="flex items-center justify-between w-full px-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-white/90 dark:bg-black/70 backdrop-blur-md px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-fg">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <span>{profile.availability}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-muted font-mono">
              <MapPin className="h-3 w-3" />
              <span>{profile.location.split(",")[0]}, PK</span>
            </div>
          </div>

          {/* Script Greeting Header */}
          <div className="font-serif italic font-normal text-6xl sm:text-7xl leading-none text-fg/85 text-center mt-4">
            Hey, there
          </div>

          {/* Centered Floating Cutout Portrait */}
          {isPortraitVisible && portraitSrc && (
            <div className="relative w-56 sm:w-64 md:w-80 aspect-[4/5] mx-auto my-2 pointer-events-none select-none">
              <Image
                src={portraitSrc}
                alt={profile.name}
                fill
                priority
                unoptimized={typeof portraitSrc === "string"}
                className="object-contain object-bottom"
                style={{
                  maskImage: "linear-gradient(to bottom, black 72%, transparent 98%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 72%, transparent 98%)",
                }}
                sizes="(max-width: 640px) 240px, (max-width: 1024px) 320px, 400px"
              />
            </div>
          )}

          {/* Headline + Role + Bio block */}
          <div className="w-full text-center mt-2 px-2">
            <span className="font-serif italic normal-case text-2xl text-fg/80 block">
              I am
            </span>
            <h1 className="font-display font-bold uppercase tracking-tight text-4xl sm:text-5xl text-fg leading-none mt-1">
              {profile.name}
            </h1>

            <p className="font-mono text-xs uppercase tracking-widest text-muted mt-2">
              {profile.role.toUpperCase()}
            </p>

            <p className="mt-4 text-xs sm:text-sm text-fg/75 max-w-md mx-auto leading-relaxed">
              {profile.intro}
            </p>

            {/* CTAs */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <a
                href="#projects"
                className="btn-primary !px-5 !py-2.5 text-xs tracking-wider uppercase font-mono"
              >
                <span>Selected Works</span>
                <ArrowDown className="h-3.5 w-3.5" />
              </a>
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary !px-4 !py-2.5 text-xs tracking-wider uppercase font-mono"
              >
                <span>CV</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Ticker/Meta bar */}
        <div className="w-full pt-4 flex items-center justify-between text-[10px] font-mono tracking-widest uppercase text-muted">
          <span className="hidden sm:inline">
            {profile.analytics}
          </span>
          <span>Scroll ↓</span>
        </div>

      </div>
    </section>
  );
}

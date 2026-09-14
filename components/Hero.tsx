import Image from "next/image";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { personal } from "@/lib/data";
import hamdanCutout from "@/assets/hamdan_cutout.png";

export function Hero() {
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
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[580px] lg:w-[640px] xl:w-[700px] aspect-[4/5] z-10 pointer-events-none select-none">
            <Image
              src={hamdanCutout}
              alt={personal.name}
              fill
              priority
              className="object-contain object-top"
              style={{
                maskImage: "linear-gradient(to bottom, black 65%, transparent 96%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 65%, transparent 96%)",
              }}
              sizes="(min-width: 1024px) 700px"
            />
          </div>

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
              <span>{personal.availability}</span>
            </div>

            {/* Right: Small Specialization Paragraph */}
            <p className="max-w-[240px] xl:max-w-[280px] text-xs text-fg/80 leading-relaxed text-right font-normal">
              {personal.intro}
            </p>
          </div>
          {/* Bottom Layer: "I AM [NAME]" on Left, Role & CTAs on Right (flanking chest/waist) */}
          <div className="relative z-20 flex items-end justify-between w-full mt-6 xl:mt-10">
            {/* Left: Bold condensed headline */}
            <div className="max-w-xl">
              <h1 className="font-display font-bold uppercase tracking-tight text-3xl lg:text-[3.4rem] xl:text-[3.85rem] leading-[0.92] text-fg">
                I AM <br />
                {personal.name.split(" ")[0]} <br />
                {personal.name.split(" ")[1] || ""}
              </h1>
            </div>

            {/* Right: Stacked role in bold uppercase + CTA buttons */}
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
        {/* MOBILE & TABLET HERO (<lg <1024px) — Graceful Stacked Layout with Zero Clashes */}
        {/* ========================================================================= */}
        <div className="lg:hidden flex flex-col items-center justify-between w-full flex-1 pt-2 sm:pt-4">

          {/* Top status bar: Badge + Location */}
          <div className="flex items-center justify-between w-full">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-white/90 dark:bg-black/70 backdrop-blur-md px-3.5 py-1.5 shadow-sm text-[11px] sm:text-xs font-mono uppercase tracking-wider text-fg">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <span>{personal.availability}</span>
            </div>

            <div className="inline-flex items-center gap-1 font-mono text-[11px] sm:text-xs text-muted">
              <MapPin className="h-3 w-3" />
              <span>{personal.location.split(",")[0]}, PK</span>
            </div>
          </div>

          {/* Script phrase: "Hey, there" */}
          <div className="font-serif italic font-normal text-5xl sm:text-6xl md:text-7xl text-fg/85 text-center mt-5 mb-1 select-none">
            Hey, there
          </div>

          {/* Centered Floating Cutout Portrait */}
          <div className="relative w-56 sm:w-64 md:w-80 aspect-[4/5] mx-auto my-2 pointer-events-none select-none">
            <Image
              src={hamdanCutout}
              alt={personal.name}
              fill
              priority
              className="object-contain object-bottom"
              style={{
                maskImage: "linear-gradient(to bottom, black 72%, transparent 98%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 72%, transparent 98%)",
              }}
              sizes="(max-width: 640px) 240px, (max-width: 1024px) 320px, 400px"
            />
          </div>

          {/* Headline + Role + Bio block */}
          <div className="w-full text-center mt-2 px-2">
            <h1 className="font-display font-bold uppercase tracking-tight text-3xl sm:text-4xl md:text-5xl leading-[0.92] text-fg">
              I AM <br />
              {personal.name}
            </h1>

            <div className="font-display font-bold uppercase tracking-tight text-base sm:text-lg md:text-xl text-fg mt-2">
              {personal.role.toUpperCase()}
            </div>

            <p className="mt-2 text-xs sm:text-sm text-fg/75 max-w-sm sm:max-w-md mx-auto leading-relaxed">
              {personal.intro}
            </p>

            {/* Pill CTA buttons */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <a href="#contact" className="btn-primary text-xs !px-5 !py-2">
                <span>Get in touch</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a href="#projects" className="btn-secondary text-xs !px-5 !py-2">
                View work
              </a>
              <a
                href={personal.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs !px-5 !py-2"
              >
                Resume
              </a>
            </div>
          </div>

        </div>

        {/* Subtle bottom bar: scroll indicator */}
        <div className="pt-6 flex items-center justify-between text-muted w-full">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            {personal.analytics}
          </span>
          <a
            href="#about"
            aria-label="Scroll to about"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted hover:text-fg transition-colors"
          >
            <span>Scroll</span>
            <ArrowDown className="h-3 w-3 animate-bounce" />
          </a>
        </div>

      </div>
    </section>
  );
}

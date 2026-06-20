import Image from "next/image";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { personal } from "@/lib/data";
import hamdanPhoto from "@/assets/hamdan.png";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex items-center pt-28 pb-20"
    >
      <div className="absolute inset-0 hero-grid pointer-events-none" />

      <div className="container-x relative w-full">
        <div className="grid items-start gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <div className="flex items-center gap-2 mb-10 animate-fade-in">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                {personal.availability}
              </span>
            </div>

            <div className="font-mono text-sm text-muted mb-6 animate-fade-in">
              {personal.name} · {personal.role}
            </div>

            <h1 className="h-display max-w-5xl animate-slide-up">
              I&apos;m a{" "}
              <span className="text-accent">Full-Stack AI Engineer</span>.
              <span /> I build <span className="text-accent">MERN apps</span>, ship{" "}
              <span className="text-accent">production code</span>.
            </h1>

            <p
              className="mt-10 max-w-2xl text-lg text-fg/70 leading-relaxed animate-slide-up"
              style={{ animationDelay: "120ms" }}
            >
              {personal.intro}
            </p>

            <div
              className="mt-12 flex flex-wrap items-center gap-3 animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <a href="#contact" className="btn-primary">
                Get in touch <ArrowUpRight className="h-4 w-4" />
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

            <div
              className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted animate-fade-in font-mono"
              style={{ animationDelay: "320ms" }}
            >
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {personal.location}
              </span>
              <span className="hidden sm:inline opacity-40">/</span>
              <span>Open to remote work</span>
            </div>
          </div>

          <div className="hidden md:flex justify-end items-start self-start animate-fade-in" style={{ animationDelay: "220ms" }}>
            <div className="relative w-full max-w-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-xl shadow-slate-950/20">
              <Image
                src={hamdanPhoto}
                alt="Hamdan"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>

        <a
          href="#about"
          aria-label="Scroll to about"
          className="absolute bottom-0 left-0 hidden sm:flex flex-col items-start gap-2 text-muted hover:text-fg transition"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
            Scroll
          </span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
}

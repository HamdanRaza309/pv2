import type { Metadata } from "next";
import Image from "next/image";
import { Heart, Camera, Sparkles, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import {
  informalBio,
  hobbies,
  photoGallery,
  personalProjects,
  favorites,
  lifeNav,
  personal,
} from "@/lib/data.life";

export const metadata: Metadata = {
  title: "Hamdan Raza — Off the Clock",
  description:
    "The human side of Hamdan Raza — hobbies, interests, photos, and the person beyond the code and research.",
};

export default function LifePage() {
  return (
    <div className="persona-life bg-bg text-fg min-h-screen">
      <Navbar navItems={lifeNav} />

      <main>
        {/* ── Hero ─────────────────────────────────────── */}
        <section
          id="top"
          className="relative min-h-[65svh] flex items-center pt-28 sm:pt-32 pb-16 sm:pb-24 border-b border-fg/10"
        >
          <div className="container-x">
            <Reveal>
              <div className="max-w-3xl">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted mb-4 block">
                  Off the Clock · {personal.name}
                </span>
                <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.05] text-fg">
                  {informalBio.headline}
                </h1>
                <p className="mt-6 text-base sm:text-lg text-fg/75 leading-relaxed max-w-2xl">
                  {informalBio.greeting}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── About Me ────────────────────────────────── */}
        <section id="about-me" className="section">
          <div className="container-x">
            <Reveal>
              <div className="flex items-center gap-3 mb-10">
                <Heart className="h-5 w-5 text-accent" />
                <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-fg uppercase">
                  About Me
                </h2>
              </div>
            </Reveal>

            <Reveal>
              <div className="max-w-3xl">
                <p className="text-base sm:text-lg text-fg/80 leading-relaxed">
                  {informalBio.bio}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Hobbies & Interests ─────────────────────── */}
        <section id="hobbies" className="section">
          <div className="container-x">
            <Reveal>
              <div className="flex items-center gap-3 mb-10">
                <Sparkles className="h-5 w-5 text-accent" />
                <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-fg uppercase">
                  Hobbies & Interests
                </h2>
              </div>
            </Reveal>

            {hobbies.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {hobbies.map((hobby, idx) => (
                  <Reveal key={idx} delay={idx * 0.08}>
                    <div className="rounded-2xl border border-fg/10 bg-card overflow-hidden hover:border-fg/20 hover:shadow-md transition-all duration-300 group">
                      {hobby.image && (
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <Image
                            src={hobby.image}
                            alt={hobby.title}
                            fill
                            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="font-display font-bold text-lg text-fg uppercase tracking-tight">
                          {hobby.emoji && <span className="mr-2">{hobby.emoji}</span>}
                          {hobby.title}
                        </h3>
                        <p className="mt-2 text-sm text-fg/70 leading-relaxed">
                          {hobby.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <PlaceholderNotice section="Hobbies & Interests" />
            )}
          </div>
        </section>

        {/* ── Photo Gallery ───────────────────────────── */}
        <section id="gallery" className="section">
          <div className="container-x">
            <Reveal>
              <div className="flex items-center gap-3 mb-10">
                <Camera className="h-5 w-5 text-accent" />
                <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-fg uppercase">
                  Gallery
                </h2>
              </div>
            </Reveal>

            {photoGallery.length > 0 ? (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {photoGallery.map((photo, idx) => (
                  <Reveal key={idx} delay={idx * 0.06}>
                    <div className="break-inside-avoid rounded-2xl overflow-hidden border border-fg/10 group">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        width={600}
                        height={400}
                        className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500"
                      />
                      {photo.caption && (
                        <div className="px-4 py-3">
                          <p className="text-xs text-muted">{photo.caption}</p>
                        </div>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <PlaceholderNotice section="Photo Gallery" />
            )}
          </div>
        </section>

        {/* ── Personal Projects ───────────────────────── */}
        <section id="personal-projects" className="section">
          <div className="container-x">
            <Reveal>
              <div className="flex items-center gap-3 mb-10">
                <Sparkles className="h-5 w-5 text-accent" />
                <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-fg uppercase">
                  Personal Projects
                </h2>
              </div>
            </Reveal>

            {personalProjects.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {personalProjects.map((proj, idx) => (
                  <Reveal key={idx} delay={idx * 0.08}>
                    <div className="p-6 rounded-2xl border border-fg/10 bg-card hover:border-fg/20 transition">
                      <h3 className="font-display font-bold text-lg text-fg uppercase tracking-tight">
                        {proj.title}
                      </h3>
                      <p className="mt-2 text-sm text-fg/70 leading-relaxed">
                        {proj.description}
                      </p>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex text-xs font-mono text-accent hover:underline underline-offset-4"
                        >
                          View →
                        </a>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <PlaceholderNotice section="Personal Projects" />
            )}
          </div>
        </section>

        {/* ── Favorite Things ─────────────────────────── */}
        <section id="favorites" className="section">
          <div className="container-x">
            <Reveal>
              <div className="flex items-center gap-3 mb-10">
                <Star className="h-5 w-5 text-accent" />
                <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-fg uppercase">
                  Favorites
                </h2>
              </div>
            </Reveal>

            {favorites.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((fav, idx) => (
                  <Reveal key={idx} delay={idx * 0.08}>
                    <div className="p-5 rounded-xl border border-fg/10 bg-card">
                      <h3 className="font-display font-bold text-sm text-fg uppercase tracking-wider mb-3">
                        {fav.category}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {fav.items.map((item) => (
                          <span key={item} className="chip text-xs">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <PlaceholderNotice section="Favorites" />
            )}
          </div>
        </section>

        {/* ── Contact CTA ─────────────────────────────── */}
        <section id="contact" className="section">
          <div className="container-x">
            <Reveal>
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-fg uppercase mb-4">
                  Say Hello
                </h2>
                <p className="text-sm sm:text-base text-fg/70 leading-relaxed mb-8">
                  Want to chat about something non-work-related? I&apos;m always up for it.
                </p>
                <a
                  href={`mailto:${personal.email}`}
                  className="btn-primary"
                >
                  Drop a message
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ── Placeholder notice for empty sections ──────────────── */
function PlaceholderNotice({ section }: { section: string }) {
  return (
    <div className="rounded-xl border border-dashed border-fg/20 bg-fg/[0.02] p-8 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">
        {section} — Awaiting real content
      </p>
      <p className="mt-2 text-sm text-fg/50">
        Edit <code className="font-mono text-xs bg-fg/5 px-1.5 py-0.5 rounded">lib/data.life.ts</code> to populate this section.
      </p>
    </div>
  );
}

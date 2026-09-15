import type { Metadata } from "next";
import Image from "next/image";
import { Heart, Camera, Sparkles, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { lifeNav } from "@/lib/data.life";
import { getLifeContent, getSiteSettings } from "@/lib/supabase/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Hamdan Raza — Off the Clock",
  description:
    "The human side of Hamdan Raza — hobbies, interests, photos, and the person beyond the code and research.",
};

export default async function LifePage() {
  const [lifeData, settings] = await Promise.all([
    getLifeContent(),
    getSiteSettings(),
  ]);

  const {
    bio,
    hobbies,
    photoGallery,
    personalProjects,
    favorites,
  } = lifeData;

  const headline = bio?.headline || "Off the Clock";
  const greeting =
    bio?.greeting ||
    "The human side — hobbies, photography, and personal explorations beyond code and research.";
  const extendedBio =
    bio?.bio ||
    "When I'm not writing code or exploring neural models, I spend my time exploring mountain trails, tinkering with photography, discovering music, and enjoying good chai.";

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
                  Off the Clock · {settings.name}
                </span>
                <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.05] text-fg">
                  {headline}
                </h1>
                <p className="mt-6 text-base sm:text-lg text-fg/75 leading-relaxed max-w-2xl">
                  {greeting}
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
                <p className="text-base sm:text-lg text-fg/80 leading-relaxed font-serif italic">
                  {extendedBio}
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
                  Hobbies &amp; Interests
                </h2>
              </div>
            </Reveal>

            {hobbies.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {hobbies.map((hobby, idx) => (
                  <Reveal key={idx} delay={idx * 0.08}>
                    <div className="p-6 rounded-xl border border-fg/10 bg-card hover:border-fg/20 transition">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{hobby.emoji || "✨"}</span>
                        <h3 className="font-display font-bold text-lg text-fg uppercase">
                          {hobby.title}
                        </h3>
                      </div>
                      <p className="text-sm text-fg/70 leading-relaxed">
                        {hobby.description}
                      </p>
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
                  Photo Gallery
                </h2>
              </div>
            </Reveal>

            {photoGallery.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photoGallery.map((photo, idx) => (
                  <Reveal key={idx} delay={idx * 0.08}>
                    <div className="group overflow-hidden rounded-xl border border-fg/10 bg-card">
                      <div className="relative aspect-[4/3] overflow-hidden bg-fg/5">
                        {photo.src ? (
                          <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            unoptimized={typeof photo.src === "string"}
                            className="object-cover group-hover:scale-105 transition duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-fg/5 to-fg/10 text-muted">
                            <Camera className="h-8 w-8 stroke-[1.5] text-accent/60" />
                            <span className="font-mono text-[11px] uppercase tracking-wider text-fg/40">
                              {photo.alt || "Photo placeholder"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="font-display font-semibold text-sm text-fg">
                          {photo.alt}
                        </p>
                        {photo.caption && (
                          <p className="mt-1 text-xs text-fg/60 font-serif italic">
                            {photo.caption}
                          </p>
                        )}
                      </div>
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
              <div className="grid md:grid-cols-2 gap-6">
                {personalProjects.map((project, idx) => (
                  <Reveal key={idx} delay={idx * 0.08}>
                    <div className="p-6 rounded-xl border border-fg/10 bg-card hover:border-fg/20 transition flex flex-col justify-between">
                      <div>
                        <h3 className="font-display font-bold text-lg text-fg uppercase mb-2">
                          {project.title}
                        </h3>
                        <p className="text-sm text-fg/70 leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 font-mono text-xs text-accent hover:underline inline-block"
                        >
                          View project &rarr;
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

        {/* ── Favorites ───────────────────────────────── */}
        <section id="favorites" className="section">
          <div className="container-x">
            <Reveal>
              <div className="flex items-center gap-3 mb-10">
                <Star className="h-5 w-5 text-accent" />
                <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-fg uppercase">
                  Favorite Things
                </h2>
              </div>
            </Reveal>

            {favorites.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((fav, idx) => (
                  <Reveal key={idx} delay={idx * 0.08}>
                    <div className="p-6 rounded-xl border border-fg/10 bg-card hover:border-fg/20 transition">
                      <h3 className="font-display font-bold text-base text-accent uppercase mb-3">
                        {fav.category}
                      </h3>
                      <ul className="space-y-2">
                        {fav.items.map((item, itemIdx) => (
                          <li
                            key={itemIdx}
                            className="text-sm text-fg/75 flex items-start gap-2"
                          >
                            <span className="text-accent/60 text-xs mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
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
                  href={`mailto:${settings.email}`}
                  className="btn-primary"
                >
                  Drop a message
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}

/* ── Clean placeholder notice for empty sections (no dummy data) ──────────────── */
function PlaceholderNotice({ section }: { section: string }) {
  return (
    <div className="rounded-xl border border-dashed border-fg/15 bg-fg/[0.02] p-8 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">
        {section}
      </p>
      <p className="mt-2 text-xs text-fg/50 font-serif italic">
        Entries will appear once published in the portfolio database.
      </p>
    </div>
  );
}

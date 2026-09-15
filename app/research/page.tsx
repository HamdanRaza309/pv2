import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BookOpen, FlaskConical, GraduationCap, Building2, BookMarked } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { researchNav } from "@/lib/data.research";
import { getResearchContent, getSiteSettings } from "@/lib/supabase/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Hamdan Raza — NeuroAI Researcher",
  description:
    "Research interests in NeuroAI, Brain-Computer Interfaces, Neural Signal Processing, Computational Neuroscience, and Neuroprosthetics.",
};

export default async function ResearchPage() {
  const [researchData, settings] = await Promise.all([
    getResearchContent(),
    getSiteSettings(),
  ]);

  const enabledAspects = settings.enabled_aspects || ["engineer", "research", "life"];
  if (!enabledAspects.includes("research")) {
    const fallback = enabledAspects[0] === "life" ? "/life" : `/${enabledAspects[0]}`;
    redirect(fallback || "/");
  }

  const {
    bio,
    interests: researchInterests,
    publications,
    projects: researchProjects,
    affiliations,
    coursework,
  } = researchData;

  const headline = bio?.headline || "Researcher & Aspiring Neuroscientist";
  const summary =
    bio?.summary ||
    "Research investigations in NeuroAI, Brain-Computer Interfaces (BCIs), neural signal processing, and computational neuroscience. Real publications and ongoing project data will appear here.";

  return (
    <div className="persona-research bg-bg text-fg min-h-screen">
      <Navbar navItems={researchNav} enabledAspects={enabledAspects} />

      <main>
        {/* ── Hero ─────────────────────────────────────── */}
        <section
          id="top"
          className="relative min-h-[70svh] flex items-center pt-28 sm:pt-32 pb-16 sm:pb-24 border-b border-fg/10"
        >
          <div className="container-x">
            <Reveal>
              <div className="max-w-3xl">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted mb-4 block">
                  Research · {settings.name}
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.15] tracking-tight text-fg">
                  {headline}
                </h1>
                <p className="mt-6 text-base sm:text-lg text-fg/75 leading-relaxed font-serif italic max-w-2xl">
                  {summary}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Research Interests ──────────────────────── */}
        <section id="interests" className="section">
          <div className="container-x">
            <Reveal>
              <div className="flex items-center gap-3 mb-10">
                <BookOpen className="h-5 w-5 text-accent" />
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-fg">
                  Research Interests
                </h2>
              </div>
            </Reveal>

            {researchInterests.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {researchInterests.map((interest, idx) => (
                  <Reveal key={idx} delay={idx * 0.08}>
                    <div className="p-6 rounded-xl border border-fg/10 bg-card hover:border-fg/20 transition">
                      <h3 className="font-serif font-semibold text-lg text-fg mb-2">
                        {interest.title}
                      </h3>
                      <p className="text-sm text-fg/70 leading-relaxed">
                        {interest.description}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <PlaceholderNotice section="Research Interests" />
            )}
          </div>
        </section>

        {/* ── Publications ────────────────────────────── */}
        <section id="publications" className="section">
          <div className="container-x">
            <Reveal>
              <div className="flex items-center gap-3 mb-10">
                <BookMarked className="h-5 w-5 text-accent" />
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-fg">
                  Publications
                </h2>
              </div>
            </Reveal>

            {publications.length > 0 ? (
              <div className="space-y-6">
                {publications.map((pub, idx) => (
                  <Reveal key={idx} delay={idx * 0.08}>
                    <div className="p-6 rounded-xl border border-fg/10 bg-card hover:border-fg/20 transition">
                      <h3 className="font-serif font-semibold text-lg sm:text-xl text-fg leading-snug">
                        {pub.link ? (
                          <a
                            href={pub.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-accent transition"
                          >
                            {pub.title}
                          </a>
                        ) : (
                          pub.title
                        )}
                      </h3>
                      <p className="mt-2 text-sm text-fg/70 font-serif italic">
                        {pub.authors}
                      </p>
                      <p className="mt-1 font-mono text-xs text-muted">
                        {pub.venue} · {pub.year}
                      </p>
                      {pub.abstract && (
                        <p className="mt-4 text-xs sm:text-sm text-fg/60 leading-relaxed border-t border-fg/5 pt-3">
                          {pub.abstract}
                        </p>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <PlaceholderNotice section="Publications" />
            )}
          </div>
        </section>

        {/* ── Ongoing Projects ────────────────────────── */}
        <section id="research-projects" className="section">
          <div className="container-x">
            <Reveal>
              <div className="flex items-center gap-3 mb-10">
                <FlaskConical className="h-5 w-5 text-accent" />
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-fg">
                  Ongoing Projects
                </h2>
              </div>
            </Reveal>

            {researchProjects.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {researchProjects.map((project, idx) => (
                  <Reveal key={idx} delay={idx * 0.08}>
                    <div className="p-6 rounded-xl border border-fg/10 bg-card hover:border-fg/20 transition flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-4 mb-3">
                          <h3 className="font-serif font-semibold text-lg text-fg">
                            {project.title}
                          </h3>
                          <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-accent/30 text-accent shrink-0">
                            {project.status}
                          </span>
                        </div>
                        <p className="text-sm text-fg/70 leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                      {project.collaborators && (
                        <p className="mt-4 pt-3 border-t border-fg/5 font-mono text-xs text-muted">
                          Collaborators: {project.collaborators}
                        </p>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <PlaceholderNotice section="Ongoing Projects" />
            )}
          </div>
        </section>

        {/* ── Affiliations ────────────────────────────── */}
        <section id="affiliations" className="section">
          <div className="container-x">
            <Reveal>
              <div className="flex items-center gap-3 mb-10">
                <Building2 className="h-5 w-5 text-accent" />
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-fg">
                  Lab &amp; Academic Affiliations
                </h2>
              </div>
            </Reveal>

            {affiliations.length > 0 ? (
              <div className="space-y-6">
                {affiliations.map((aff, idx) => (
                  <Reveal key={idx} delay={idx * 0.08}>
                    <div className="p-6 rounded-xl border border-fg/10 bg-card hover:border-fg/20 transition">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <h3 className="font-serif font-semibold text-lg text-fg">
                          {aff.institution}
                        </h3>
                        <span className="font-mono text-xs text-muted">
                          {aff.period}
                        </span>
                      </div>
                      <p className="font-serif italic text-sm text-accent mb-2">
                        {aff.role}
                      </p>
                      {aff.description && (
                        <p className="text-sm text-fg/70 leading-relaxed">
                          {aff.description}
                        </p>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <PlaceholderNotice section="Affiliations" />
            )}
          </div>
        </section>

        {/* ── Coursework ──────────────────────────────── */}
        <section id="coursework" className="section">
          <div className="container-x">
            <Reveal>
              <div className="flex items-center gap-3 mb-10">
                <GraduationCap className="h-5 w-5 text-accent" />
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-fg">
                  Relevant Coursework
                </h2>
              </div>
            </Reveal>

            {coursework.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {coursework.map((course, idx) => (
                  <Reveal key={idx} delay={idx * 0.08}>
                    <div className="p-6 rounded-xl border border-fg/10 bg-card hover:border-fg/20 transition">
                      <h3 className="font-serif font-semibold text-lg text-fg">
                        {course.title}
                      </h3>
                      {course.institution && (
                        <p className="font-serif italic text-xs text-accent mt-1 mb-2">
                          {course.institution}
                        </p>
                      )}
                      {course.description && (
                        <p className="text-sm text-fg/70 leading-relaxed">
                          {course.description}
                        </p>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <PlaceholderNotice section="Coursework" />
            )}
          </div>
        </section>

        {/* ── Contact CTA ─────────────────────────────── */}
        <section id="contact" className="section">
          <div className="container-x">
            <Reveal>
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-fg mb-4">
                  Interested in collaborating?
                </h2>
                <p className="text-sm sm:text-base text-fg/70 leading-relaxed mb-8">
                  I&apos;m always open to research collaborations, academic discussions, and new opportunities in NeuroAI and brain-computer interfaces.
                </p>
                <a
                  href={`mailto:${settings.email}`}
                  className="btn-primary"
                >
                  Get in touch
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

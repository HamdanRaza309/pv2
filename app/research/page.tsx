import type { Metadata } from "next";
import { BookOpen, FlaskConical, GraduationCap, Building2, BookMarked } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import {
  researchBio,
  researchInterests,
  publications,
  researchProjects,
  affiliations,
  coursework,
  researchNav,
  personal,
} from "@/lib/data.research";

export const metadata: Metadata = {
  title: "Hamdan Raza — NeuroAI Researcher",
  description:
    "Research interests in NeuroAI, Brain-Computer Interfaces, Neural Signal Processing, Computational Neuroscience, and Neuroprosthetics.",
};

export default function ResearchPage() {
  return (
    <div className="persona-research bg-bg text-fg min-h-screen">
      <Navbar navItems={researchNav} />

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
                  Research · {personal.name}
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.15] tracking-tight text-fg">
                  {researchBio.headline}
                </h1>
                <p className="mt-6 text-base sm:text-lg text-fg/75 leading-relaxed font-serif italic max-w-2xl">
                  {researchBio.summary}
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
                      <h3 className="font-serif font-semibold text-lg text-fg">
                        {pub.link ? (
                          <a
                            href={pub.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline underline-offset-4"
                          >
                            {pub.title}
                          </a>
                        ) : (
                          pub.title
                        )}
                      </h3>
                      <p className="mt-1 text-sm text-muted">{pub.authors}</p>
                      <p className="mt-1 text-sm text-fg/60 italic">
                        {pub.venue} · {pub.year}
                      </p>
                      {pub.abstract && (
                        <p className="mt-3 text-sm text-fg/70 leading-relaxed">
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

        {/* ── Ongoing Research Projects ───────────────── */}
        <section id="research-projects" className="section">
          <div className="container-x">
            <Reveal>
              <div className="flex items-center gap-3 mb-10">
                <FlaskConical className="h-5 w-5 text-accent" />
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-fg">
                  Ongoing Research Projects
                </h2>
              </div>
            </Reveal>

            {researchProjects.length > 0 ? (
              <div className="space-y-6">
                {researchProjects.map((proj, idx) => (
                  <Reveal key={idx} delay={idx * 0.08}>
                    <div className="p-6 rounded-xl border border-fg/10 bg-card hover:border-fg/20 transition">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-serif font-semibold text-lg text-fg">
                          {proj.title}
                        </h3>
                        <span className="badge text-[10px]">{proj.status}</span>
                      </div>
                      <p className="text-sm text-fg/70 leading-relaxed">
                        {proj.description}
                      </p>
                      {proj.collaborators && (
                        <p className="mt-2 text-xs text-muted font-mono">
                          Collaborators: {proj.collaborators}
                        </p>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <PlaceholderNotice section="Research Projects" />
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
                  Affiliations
                </h2>
              </div>
            </Reveal>

            {affiliations.length > 0 ? (
              <div className="space-y-4">
                {affiliations.map((aff, idx) => (
                  <Reveal key={idx} delay={idx * 0.08}>
                    <div className="hairline-row py-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <span className="font-serif font-semibold text-fg min-w-[200px]">
                        {aff.institution}
                      </span>
                      <span className="text-sm text-fg/80">{aff.role}</span>
                      <span className="font-mono text-xs text-muted ml-auto">
                        {aff.period}
                      </span>
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
              <div className="grid sm:grid-cols-2 gap-5">
                {coursework.map((course, idx) => (
                  <Reveal key={idx} delay={idx * 0.08}>
                    <div className="p-5 rounded-xl border border-fg/10 bg-card">
                      <h3 className="font-serif font-semibold text-fg">
                        {course.title}
                      </h3>
                      {course.institution && (
                        <p className="mt-1 text-xs text-muted font-mono">
                          {course.institution}
                        </p>
                      )}
                      {course.description && (
                        <p className="mt-2 text-sm text-fg/70 leading-relaxed">
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
                  href={`mailto:${personal.email}`}
                  className="btn-primary"
                >
                  Get in touch
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
        Edit <code className="font-mono text-xs bg-fg/5 px-1.5 py-0.5 rounded">lib/data.research.ts</code> to populate this section.
      </p>
    </div>
  );
}

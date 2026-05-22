"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Github, X, ExternalLink, ArrowLeft, Check, Compass, Cpu, Layers, Sparkles, ChevronRight } from "lucide-react";
import { projects } from "@/lib/data";

interface ProjectDetail {
  categoryLong: string;
  problem: string;
  solution: string;
  contributions: string[];
  features: { title: string; description: string; icon?: string }[];
  metrics: { value: string; label: string }[];
  techStack: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    cloud?: string[];
  };
}

const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  "Look Atlas": {
    categoryLong: "AI Commerce Infrastructure",
    problem: "eCommerce brands struggle to produce high-end product photography on diverse models and in varying settings. Traditional studios are slow and expensive, while simple AI image generators lack control, ingestion calibration, and consistency.",
    solution: "Developed a production-grade AI content generation engine. By orchestrating product and model ingestion calibration with multi-provider APIs (Veo, Gemini, OpenAI), the system delivers high-quality assets through isolated task workers, integrated with Shopify and Stripe.",
    contributions: [
      "Architected the distributed task orchestration pipeline with Fastify, BullMQ, and Redis for heavy background media generation.",
      "Built multi-provider generation endpoints integrating Google Gemini, OpenAI, and Google Veo pipelines.",
      "Implemented Stripe subscription tiers, usage credit ledgers, and idempotent webhook handlers with transaction safety.",
      "Engineered data persistence, secure asset storage, and schema definitions with Supabase (PostgreSQL, Auth, RLS).",
      "Designed and deployed the embedded Shopify app surface using App Bridge, React Router, and Tailwind CSS."
    ],
    features: [
      { title: "Multi-Provider Generative AI", description: "Orchestrates API calls across OpenAI, Gemini, and Veo to leverage the best models for image, text, and video creation.", icon: "Sparkles" },
      { title: "Distributed Queue Architecture", description: "Utilizes Fastify + BullMQ + Redis to isolate heavy media rendering and calibration jobs, maintaining API responsiveness.", icon: "Cpu" },
      { title: "Shopify App Integration", description: "Seamlessly embeds into Shopify admin dashboards using App Bridge, providing store owners with native controls.", icon: "Layers" },
      { title: "Subscription & Ledger System", description: "Implements secure Stripe checkout, automated credit resets, and real-time usage auditing.", icon: "Compass" }
    ],
    metrics: [
      { value: "99.9%", label: "Pipeline Uptime" },
      { value: "3+", label: "GenAI Providers" },
      { value: "100%", label: "Webhook Idempotency" }
    ],
    techStack: {
      frontend: ["React.js", "Vite", "Tailwind CSS", "Shopify App Bridge", "React Router"],
      backend: ["Node.js", "Fastify", "BullMQ", "Redis"],
      database: ["Supabase PostgreSQL", "RLS Policies", "Supabase Storage"],
      cloud: ["Railway", "Render", "Vercel", "Docker"]
    }
  },
  "Climate Tracker Initiative": {
    categoryLong: "Full-Stack · AI · SaaS",
    problem: "Corporations and financial institutions spend hundreds of hours manually reviewing, extracting, and auditing ESG sustainability metrics from long, messy, unstructured PDF disclosure reports.",
    solution: "Engineered an AI-powered ESG data platform. It leverages autonomous web agents, custom Puppeteer scripts, and LLM-powered RAG pipelines to automatically ingest, parse, structure, and verify corporate environmental compliance data.",
    contributions: [
      "Built autonomous document parsing and LLM metadata extraction pipelines using LangChain and OpenAI APIs.",
      "Created highly stable Puppeteer scripts to scrape and extract clean text from multi-page corporate PDFs.",
      "Designed a robust queuing mechanism with Redis and Bull to scale heavy ingestion and processing tasks.",
      "Integrated enterprise-grade Single Sign-On (SSO) authentication using Microsoft Entra ID (Azure AD) and SAML 2.0.",
      "Developed a modern, responsive audit dashboard in React + Vite with Tailwind CSS for manual metric verification."
    ],
    features: [
      { title: "Autonomous Document Extraction", description: "Parses complex tables and narrative text in corporate disclosures, turning messy documents into audit-ready JSON data.", icon: "Sparkles" },
      { title: "Enterprise Entra ID SSO", description: "Secures user access with Single Sign-On, supporting Microsoft Entra ID and corporate authentication policies.", icon: "Layers" },
      { title: "Ingestion Queue System", description: "Background queue architecture using Bull and Redis keeps the application responsive during heavy ingestion loads.", icon: "Cpu" },
      { title: "ESG Audit Ledger", description: "Provides visual audit trails highlighting exactly where in the source PDF each metric was extracted from.", icon: "Compass" }
    ],
    metrics: [
      { value: "42%", label: "Ingestion Speedup" },
      { value: "10k+", label: "Multi-page PDFs Parsed" },
      { value: "100%", label: "Traceable Data Points" }
    ],
    techStack: {
      frontend: ["React.js", "TypeScript", "Vite", "Tailwind CSS"],
      backend: ["Node.js", "Express.js", "LangChain", "Puppeteer"],
      database: ["PostgreSQL", "Supabase", "Redis", "Bull"],
      cloud: ["Vercel"]
    }
  },
  "Inhalo: Distributed AI Short-Form Content Engine": {
    categoryLong: "Full-Stack & AI Infrastructure",
    problem: "Content creators spend significant resources scriptwriting, voiceacting, and manually editing short-form videos. Rendering video assets locally is slow and scales poorly under concurrent request loads.",
    solution: "Designed a distributed, queue-based content automation engine. Users configure layouts and generate scripts via a React dashboard, which drives a FastAPI media rendering service leveraging Gemini, Claude, ElevenLabs, and MoviePy/FFmpeg.",
    contributions: [
      "Architected the distributed media rendering microservices using Express, BullMQ, and Redis to isolate rendering resource load.",
      "Built a FastAPI background worker leveraging MoviePy and FFmpeg to compose high-definition video assets programmatically.",
      "Integrated Gemini and Claude APIs to generate dynamic, contextual scripts, prompts, and layout configs.",
      "Connected ElevenLabs TTS API to synthesize lifelike voiceovers synced precisely with the video timeline.",
      "Created a real-time progress-tracking dashboard with React, Tailwind CSS, Supabase, and Redis WebSockets."
    ],
    features: [
      { title: "Programmatic Video Composing", description: "Composes scripts, audio voiceovers, subtitles, and backgrounds into short-form videos using MoviePy and FFmpeg.", icon: "Sparkles" },
      { title: "AI Scripting & TTS Synthesis", description: "Generates high-retention video hooks and narrations via Gemini/Claude and ElevenLabs speech synthesis.", icon: "Layers" },
      { title: "Resource Isolation", description: "Decouples heavy media processing from API endpoints using BullMQ background workers for horizontal scaling.", icon: "Cpu" },
      { title: "Real-time Processing Tracker", description: "Employs WebSockets and Supabase listeners to display granular processing steps to the user in real-time.", icon: "Compass" }
    ],
    metrics: [
      { value: "100%", label: "Automated Generation" },
      { value: "Sync", label: "Timeline Audio Sync" },
      { value: "Isolated", label: "Render queue isolation" }
    ],
    techStack: {
      frontend: ["React.js", "Tailwind CSS", "WebSockets"],
      backend: ["FastAPI", "Python", "Node.js", "Express.js", "BullMQ"],
      database: ["Supabase", "Redis"],
      cloud: ["MoviePy", "FFmpeg", "Vercel"]
    }
  }
};

const getIcon = (iconName?: string) => {
  switch (iconName) {
    case "Sparkles": return <Sparkles className="h-5 w-5 text-accent" />;
    case "Cpu": return <Cpu className="h-5 w-5 text-accent" />;
    case "Layers": return <Layers className="h-5 w-5 text-accent" />;
    case "Compass": return <Compass className="h-5 w-5 text-accent" />;
    default: return <Sparkles className="h-5 w-5 text-accent" />;
  }
};

const featured = projects.filter((p) => p.featured);


export function HorizontalProjects() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);

  useEffect(() => {
    if (selectedProjectSlug) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProjectSlug]);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // Slide horizontally from 0 to ~-(N-1) * 100% as user scrolls
  const slides = featured.length;
  // Distance to translate so the last card aligns to the right edge.
  // Each slide is ~85vw wide on desktop. We translate by (slides-1) * 85vw.
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `-${(slides - 1) * 85}vw`]
  );

  return (
    <section
      id="projects"
      ref={wrapRef}
      // section height = number of slides * viewport height (controls scroll length)
      style={{ height: `${slides * 100}vh` }}
      className="relative bg-bg"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* Top header strip */}
        <div className="container-x pt-24 pb-6 border-b border-fg/10">
          <div className="flex items-baseline gap-4">
            <span className="section-num-big">05</span>
            <span className="eyebrow">Selected Projects</span>
            <span className="ml-auto font-mono text-xs text-muted">
              scroll ↓ · slide →
            </span>
          </div>
          <h2 className="mt-4 font-display font-bold text-2xl sm:text-3xl tracking-tight leading-tight">
            Real things I&apos;ve built and shipped.
          </h2>
        </div>

        {/* Horizontal track */}
        <div className="flex-1 flex items-center overflow-hidden">
          <motion.div style={{ x }} className="flex h-full items-center will-change-transform">
            {featured.map((p, i) => (
              <div
                key={p.title}
                className="w-[85vw] sm:w-[80vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] h-full flex items-center px-6 sm:px-12"
              >
                <article className="w-full h-[200px] sm:h-[300px] rounded-3xl border border-fg/15 bg-card p-3 sm:px-12 sm:py-4 relative overflow-hidden flex flex-col">
                  <div
                    className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-accent/10 blur-3xl pointer-events-none"
                    aria-hidden
                  />
                  <div className="relative flex flex-col flex-1 min-h-0">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="badge">{p.category}</span>
                        <span className="font-mono text-xs text-muted">
                          {String(i + 1).padStart(2, "0")} / {String(slides).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    <h3 className="mt-4 font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight leading-[1.02]">
                      {p.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-fg/75 leading-relaxed text-[15px] sm:text-base line-clamp-3">
                      {p.description}
                    </p>

                    <div className="mt-auto pt-4 flex flex-wrap items-center gap-6">
                      {p.live && (
                        <a
                          href={p.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg link-underline"
                        >
                          <span>Live Site</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg link-underline"
                        >
                          <span>GitHub</span>
                          <Github className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {PROJECT_DETAILS[p.title] && (
                        <button
                          onClick={() => setSelectedProjectSlug(p.title)}
                          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent hover:text-accent/80 transition group"
                        >
                          <span>Full project</span>
                          <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              </div>
            ))}

            {/* trailing spacer so last card sits comfortably */}
            <div className="w-[15vw] shrink-0" />
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="container-x pb-6">
          <div className="h-px w-full bg-fg/10 overflow-hidden">
            <motion.div
              style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
              className="h-full bg-accent"
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProjectSlug && (() => {
          const detail = PROJECT_DETAILS[selectedProjectSlug];
          const project = featured.find((p) => p.title === selectedProjectSlug);
          if (!detail || !project) return null;

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] h-screen w-screen overflow-y-auto bg-bg text-fg select-text no-scrollbar"
            >
              {/* Header section with solid dark premium background */}
              <div className="relative bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 text-neutral-100 py-16 sm:py-24 border-b border-white/10">
                <div className="container-x relative z-10">
                  {/* Back button */}
                  <button
                    onClick={() => setSelectedProjectSlug(null)}
                    className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-100 transition mb-8 sm:mb-12 font-mono text-xs uppercase tracking-wider"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to projects</span>
                  </button>

                  <div className="max-w-4xl">
                    <span className="badge border-white/15 bg-white/5 text-neutral-400 mb-4 inline-block">
                      {detail.categoryLong}
                    </span>
                    <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.05] text-white">
                      {project.title}
                    </h1>
                    <p className="mt-6 text-lg sm:text-xl text-neutral-300 leading-relaxed max-w-3xl">
                      {detail.solution}
                    </p>

                    {/* Links */}
                    <div className="mt-8 flex flex-wrap gap-4">
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-white text-neutral-900 px-5 py-2.5 text-sm font-medium hover:bg-neutral-100 transition"
                        >
                          <span>Visit live site</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium hover:bg-white/5 transition text-white"
                        >
                          <span>View source</span>
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ambient glow in header */}
                <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] bg-accent/15 rounded-full blur-[100px] pointer-events-none" />
              </div>

              {/* Detail body sections */}
              <div className="py-16 sm:py-24 space-y-16 sm:space-y-24 container-x">
                {/* The Problem & The Solution */}
                <div className="grid md:grid-cols-2 gap-12 sm:gap-16">
                  <div>
                    <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
                      The Problem
                    </h2>
                    <p className="mt-4 text-fg/80 leading-relaxed text-[15px] sm:text-base whitespace-pre-line">
                      {detail.problem}
                    </p>
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
                      The Solution
                    </h2>
                    <p className="mt-4 text-fg/80 leading-relaxed text-[15px] sm:text-base whitespace-pre-line">
                      {detail.solution}
                    </p>
                  </div>
                </div>

                <hr className="border-fg/10" />

                {/* My Contribution */}
                <div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-8">
                    My Contribution
                  </h2>
                  <ul className="grid sm:grid-cols-2 gap-4">
                    {detail.contributions.map((c, idx) => (
                      <li
                        key={idx}
                        className="flex gap-3.5 p-4 rounded-xl border border-fg/10 bg-card hover:border-fg/20 transition animate-fade-in"
                      >
                        <span className="text-accent font-bold mt-0.5 flex-shrink-0">
                          <Check className="h-5 w-5" />
                        </span>
                        <span className="text-fg/85 text-sm sm:text-[15px] leading-relaxed">
                          {c}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <hr className="border-fg/10" />

                {/* Key Features */}
                <div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-8 text-center">
                    Key Features
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {detail.features.map((f, idx) => (
                      <div
                        key={idx}
                        className="p-6 rounded-2xl border border-fg/10 bg-card hover:shadow-md transition duration-300"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2.5 rounded-lg bg-fg/5 text-accent flex-shrink-0">
                            {getIcon(f.icon)}
                          </div>
                          <h3 className="font-display font-bold text-lg text-fg">
                            {f.title}
                          </h3>
                        </div>
                        <p className="text-fg/75 text-sm sm:text-[15px] leading-relaxed">
                          {f.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-fg/10" />

                {/* Impact & Metrics */}
                <div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-8 text-center">
                    Impact & Metrics
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {detail.metrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="bg-card p-6 sm:p-8 rounded-2xl border border-fg/10 text-center hover:border-fg/25 transition duration-300"
                      >
                        <div className="text-3xl sm:text-4xl font-display font-bold text-accent mb-2">
                          {m.value}
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-muted uppercase tracking-wider">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-fg/10" />

                {/* Tech Stack Details */}
                <div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-8">
                    Technology Stack
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(detail.techStack).map(([category, items]) => (
                      <div key={category} className="p-5 rounded-xl border border-fg/10 bg-card">
                        <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">
                          {category}
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {items?.map((item) => (
                            <span key={item} className="chip font-sans text-xs">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-fg/10" />

                {/* CTA / Similar Project */}
                <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden border border-white/10">
                  <div className="relative z-10 max-w-xl mx-auto">
                    <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-4 text-white">
                      Have a similar project?
                    </h2>
                    <p className="text-neutral-400 text-sm sm:text-base mb-8 leading-relaxed">
                      I help startups and teams architect and build production-grade Web Applications with AI features that scale. Let&apos;s discuss your idea.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <a
                        href="mailto:hamdanraza309@gmail.com"
                        className="inline-flex items-center gap-2 rounded-full bg-white text-neutral-900 px-6 py-3 text-sm font-semibold hover:bg-neutral-100 transition"
                      >
                        Start a conversation
                      </a>
                      <button
                        onClick={() => setSelectedProjectSlug(null)}
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold hover:bg-white/5 transition text-white"
                      >
                        Back to work
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(var(--accent),0.1)_0%,transparent_70%)] pointer-events-none" />
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
}

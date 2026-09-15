/* ──────────────────────────────────────────────────────────────
   Research Persona — Data  (lib/data.research.ts)
   All placeholder content is clearly marked.
   Replace bracketed text with your real content.
   ────────────────────────────────────────────────────────────── */

import { personal } from "./data";

/** Re-export shared identity so Research page can reference name/email/socials */
export { personal };

/* ── Research Bio ─────────────────────────────────────────── */
export const researchBio = {
  headline: "Researcher & Aspiring Neuroscientist",
  summary:
    "[PLACEHOLDER — Write a 2-3 sentence academic-flavored bio. Example: 'I explore the intersection of machine learning and neuroscience, focusing on decoding neural signals for brain-computer interfaces. My work bridges computational methods with biological insight.']",
};

/* ── Research Interests / Focus Areas ─────────────────────── */
export const researchInterests = [
  {
    title: "NeuroAI",
    description:
      "[PLACEHOLDER — Describe your interest in NeuroAI, e.g. how AI models can be informed by or applied to understanding neural computation.]",
  },
  {
    title: "Brain-Computer Interfaces (BCIs)",
    description:
      "[PLACEHOLDER — Describe your interest in BCIs, e.g. non-invasive EEG decoding, motor imagery classification, real-time neural control systems.]",
  },
  {
    title: "Neural Signal Processing",
    description:
      "[PLACEHOLDER — Describe your interest in signal processing for neural data, e.g. EEG/ECoG preprocessing, feature extraction, artifact removal.]",
  },
  {
    title: "Computational Neuroscience",
    description:
      "[PLACEHOLDER — Describe your interest in computational modeling of neural systems, spiking networks, Hodgkin-Huxley models, etc.]",
  },
  {
    title: "Neuroprosthetics",
    description:
      "[PLACEHOLDER — Describe your interest in neuroprosthetic devices, e.g. restoring motor or sensory function through neural interfaces.]",
  },
];

/* ── Publications / Papers ────────────────────────────────── */
export const publications: {
  title: string;
  authors: string;
  venue: string;
  year: string;
  link?: string;
  abstract?: string;
}[] = [
  /* PLACEHOLDER — Add your publications here. Example:
  {
    title: "Decoding Motor Imagery from EEG Using Transformer Architectures",
    authors: "Hamdan Raza, et al.",
    venue: "Conference / Journal Name",
    year: "2025",
    link: "https://doi.org/...",
    abstract: "Brief abstract text...",
  },
  */
];

/* ── Ongoing Research Projects ────────────────────────────── */
export const researchProjects: {
  title: string;
  status: string;
  description: string;
  collaborators?: string;
}[] = [
  /* PLACEHOLDER — Add your research projects here. Example:
  {
    title: "Real-Time BCI System for Wheelchair Navigation",
    status: "In Progress",
    description: "Developing a low-latency motor imagery BCI system using consumer-grade EEG headsets...",
    collaborators: "Lab Name / University",
  },
  */
];

/* ── Lab / Academic Affiliations ──────────────────────────── */
export const affiliations: {
  institution: string;
  role: string;
  period: string;
  description?: string;
}[] = [
  /* PLACEHOLDER — Add your affiliations here. Example:
  {
    institution: "Neurocomputation Lab, University X",
    role: "Research Assistant",
    period: "2024 – Present",
    description: "Working on EEG-based motor imagery classification...",
  },
  */
];

/* ── Relevant Coursework / Research Experience ────────────── */
export const coursework: {
  title: string;
  institution?: string;
  description?: string;
}[] = [
  /* PLACEHOLDER — Add relevant coursework here. Example:
  {
    title: "Neural Signal Processing (EE 540)",
    institution: "University X",
    description: "Covered EEG/ECoG signal analysis, filtering, ICA, and time-frequency decomposition.",
  },
  */
];

/* ── Section nav for Research page ────────────────────────── */
export const researchNav = [
  { label: "Interests", href: "#interests" },
  { label: "Publications", href: "#publications" },
  { label: "Projects", href: "#research-projects" },
  { label: "Affiliations", href: "#affiliations" },
  { label: "Coursework", href: "#coursework" },
];

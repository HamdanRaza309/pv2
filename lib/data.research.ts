/* ──────────────────────────────────────────────────────────────
   ⚠️  ALL CONTENT IN THIS FILE IS DUMMY / PLACEHOLDER DATA  ⚠️
   It exists solely so the Research page renders with realistic
   text volume for layout evaluation. Replace every entry with
   your real content before deploying.
   ────────────────────────────────────────────────────────────── */

import { personal } from "./data";

/** Re-export shared identity so Research page can reference name/email/socials */
export { personal };

/* ── Research Bio ─────────────────────────────────────────── */
export const researchBio = {
  headline: "Researcher & Aspiring Neuroscientist",
  summary:
    "[DUMMY] I explore the intersection of machine learning and neuroscience, focusing on decoding neural signals for brain-computer interfaces. My work bridges modern deep learning architectures with biological signal processing to build adaptive, real-time systems that restore or augment human motor and cognitive function.",
};

/* ── Research Interests / Focus Areas ─────────────────────── */
export const researchInterests = [
  {
    title: "NeuroAI",
    description:
      "[DUMMY] Investigating how artificial neural networks can be informed by biological neural computation — studying representational similarity between deep learning models and cortical activity patterns to build more brain-like AI systems.",
  },
  {
    title: "Brain-Computer Interfaces (BCIs)",
    description:
      "[DUMMY] Developing non-invasive EEG-based brain-computer interfaces for motor imagery classification, with a focus on transfer learning approaches that reduce calibration time for new users while maintaining high decoding accuracy across sessions.",
  },
  {
    title: "Neural Signal Processing",
    description:
      "[DUMMY] Applying advanced time-frequency decomposition, independent component analysis, and artifact rejection techniques to raw EEG and ECoG recordings to extract robust neural features suitable for real-time BCI operation.",
  },
  {
    title: "Computational Neuroscience",
    description:
      "[DUMMY] Building biophysical models of cortical microcircuits using Hodgkin-Huxley and integrate-and-fire neurons to simulate population dynamics and understand how neural oscillations encode information in motor and sensory cortices.",
  },
  {
    title: "Neuroprosthetics",
    description:
      "[DUMMY] Exploring closed-loop neuroprosthetic systems that combine neural decoding with sensory feedback to enable intuitive control of robotic limbs, exoskeletons, and assistive devices for individuals with motor impairments.",
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
  {
    title:
      "[DUMMY] Adaptive Transfer Learning for Cross-Subject EEG-Based Motor Imagery Classification Using Domain-Adversarial Neural Networks",
    authors: "Hamdan Raza, A. Khan, S. Malik, R. Ahmed",
    venue: "IEEE Transactions on Neural Systems and Rehabilitation Engineering",
    year: "2025",
    link: "#",
    abstract:
      "We propose a domain-adversarial training framework that aligns feature distributions across subjects in EEG-based motor imagery paradigms. Our approach reduces calibration requirements by 72% while achieving 89.3% classification accuracy on the BCI Competition IV dataset, outperforming conventional CSP-based methods.",
  },
  {
    title:
      "[DUMMY] Real-Time Artifact Rejection in Consumer-Grade EEG Headsets for Practical Brain-Computer Interface Deployment",
    authors: "Hamdan Raza, F. Hussain, M. Tariq",
    venue: "Proceedings of the 12th International BCI Conference, Graz, Austria",
    year: "2024",
    abstract:
      "Consumer-grade EEG devices suffer from significant motion and EMG artifacts that degrade BCI performance in unconstrained environments. We present a lightweight convolutional autoencoder that operates within 15ms latency to clean single-trial EEG, enabling reliable motor imagery detection outside laboratory settings.",
  },
];

/* ── Ongoing Research Projects ────────────────────────────── */
export const researchProjects: {
  title: string;
  status: string;
  description: string;
  collaborators?: string;
}[] = [
  {
    title: "[DUMMY] Low-Latency BCI System for Wheelchair Navigation Using Consumer EEG",
    status: "In Progress",
    description:
      "Developing an end-to-end brain-computer interface system that translates motor imagery intentions into wheelchair navigation commands using a 4-channel consumer EEG headset. The system targets sub-200ms command latency with an embedded Raspberry Pi inference pipeline and includes an adaptive classifier that improves with continued user interaction.",
    collaborators: "Neural Engineering Lab, NUST Islamabad",
  },
  {
    title: "[DUMMY] Comparative Analysis of Transformer vs. CNN Architectures for P300 Speller Decoding",
    status: "Writing Phase",
    description:
      "Benchmarking vision transformer and EEGNet-style convolutional architectures on the P300 speller paradigm across three public datasets. Preliminary results show transformers achieve 4.2% higher character-level accuracy but require 3× more training data, suggesting hybrid approaches may offer the best trade-off for practical deployment.",
    collaborators: "Computational Neuroscience Group, UET Peshawar",
  },
];

/* ── Lab / Academic Affiliations ──────────────────────────── */
export const affiliations: {
  institution: string;
  role: string;
  period: string;
  description?: string;
}[] = [
  {
    institution: "[DUMMY] Neural Engineering & Intelligent Systems Lab, NUST Islamabad",
    role: "Undergraduate Research Assistant",
    period: "2024 – Present",
    description:
      "Contributing to EEG-based BCI research, running experiments with human subjects, preprocessing neural data pipelines, and training deep learning models for motor imagery classification.",
  },
  {
    institution: "[DUMMY] Computational Neuroscience Reading Group, UET Peshawar",
    role: "Member & Presenter",
    period: "2023 – Present",
    description:
      "Weekly journal club covering recent publications in computational neuroscience, neural coding, and machine learning for neuroscience. Presented 6 papers on attention mechanisms in neural decoding.",
  },
];

/* ── Relevant Coursework / Research Experience ────────────── */
export const coursework: {
  title: string;
  institution?: string;
  description?: string;
}[] = [
  {
    title: "[DUMMY] Neural Signal Processing & Brain-Computer Interfaces",
    institution: "NUST School of Electrical Engineering",
    description:
      "Covered EEG/ECoG signal acquisition, digital filtering, time-frequency analysis (STFT, wavelets), spatial filtering (CSP, Laplacian), and classification pipelines for motor imagery and P300 BCI paradigms.",
  },
  {
    title: "[DUMMY] Deep Learning for Biomedical Applications",
    institution: "Coursera — Johns Hopkins University",
    description:
      "Focused on applying CNNs, RNNs, and transformer architectures to biomedical signal data including EEG, EMG, and ECG. Final project: seizure detection from scalp EEG using a temporal convolutional network.",
  },
];

/* ── Section nav for Research page ────────────────────────── */
export const researchNav = [
  { label: "Interests", href: "#interests" },
  { label: "Publications", href: "#publications" },
  { label: "Projects", href: "#research-projects" },
  { label: "Affiliations", href: "#affiliations" },
  { label: "Coursework", href: "#coursework" },
];

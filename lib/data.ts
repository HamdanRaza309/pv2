export const personal = {
  name: "Hamdan Raza",
  initials: "HR",
  role: "Full-Stack AI Engineer",
  tagline: "I build full-stack web apps, ship clean code.",
  intro:
    "Full-stack AI Engineer based in Peshawar, Pakistan. I build scalable web applications with the MERN stack and integrate AI features into modern production software.",
  location: "Ring Road, Peshawar, KPK, Pakistan",
  availability: "Available for work",
  email: "hamdanraza309@gmail.com",
  resume:
    "https://drive.google.com/file/d/1b09PLu_V_CARXeeC9WnG3TYQG65weDtB/view?usp=sharing",
  socials: {
    github: "https://github.com/HamdanRaza309",
    linkedin: "https://www.linkedin.com/in/hamdanraza/",
    facebook: "https://www.facebook.com/Remeo.hamdan?mibextid=ZbWKwL",
    instagram: "https://www.instagram.com/khan_arman309",
  },
};

export const about = {
  paragraphs: [
    "I'm a Full-Stack AI Engineer with a focus on the MERN stack. I started by building small JavaScript projects (games, utilities, clocks) and grew into shipping production-grade React apps and Node.js APIs.",
    "Currently I work on full-stack web applications integrated with AI features and tools — combining clean frontend interfaces with reliable backend services.",
    "My approach: write code that's simple to read, easy to ship, and built to scale. I use AI tools to move faster, not to skip the thinking.",
  ],
};

export const techStack = [
  {
    category: "Frontend",
    items: [
      "React.js",
      "Next.js",
      "Redux",
      "Context API",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "Bootstrap",
      "SASS",
    ],
  },
  {
    category: "Backend",
    items: [
      "Node.js",
      "Express.js",
      "Nest.js",
      "FastAPI",
      "REST APIs",
      "GraphQL",
      "Python",
      "JWT Authentication",
      "OAuth 2.0",
      "SAML 2.0",
      "Microsoft Entra ID",
      "Microservices Architecture",
    ],
  },
  {
    category: "Database & Storage",
    items: [
      "PostgreSQL",
      "MongoDB",
      "Mongoose",
      "Supabase",
      "Redis",
      "Pinecone",
      "ChromaDB",
      "Vector Databases",
    ],
  },
  {
    category: "AI & Automation",
    items: [
      "LangChain",
      "LlamaIndex",
      "RAG Systems",
      "OpenAI APIs",
      "Generative AI",
      "Voice AI",
      "AI Automation",
      "Semantic Search",
      "Embedding Optimization",
      "n8n",
    ],
  },
  {
    category: "Cloud, DevOps & Tools",
    items: [
      "Docker",
      "Git",
      "GitHub",
      "CI/CD",
      "Postman",
      "Vercel",
      "VS Code",
      "WebSockets",
      "Event-Driven Architecture",
    ],
  },
  {
    category: "Others",
    items: [
      "Java",
      "C++",
      "Solidity",
      "Metamask",
    ],
  },
];

export const experience = [
  {
    company: "Metasense Technologies",
    type: "Full Stack AI Engineer",
    range: "07/2024 – Present",
    title: "Full Stack AI Engineer",
    location: "Peshawar, PK",
    intro:
      "Building AI-powered SaaS platforms, RAG systems, scalable backend infrastructure, and enterprise-grade authentication systems for production applications.",
    highlights: [
      "Built scalable Node.js + PostgreSQL backend systems handling thousands of daily operations",
      "Developed AI-powered RAG applications using LangChain, Pinecone, Redis, and vector databases",
      "Implemented enterprise authentication using Microsoft Entra ID, SAML 2.0, and SSO",
      "Designed secure RBAC and tenant-isolated multi-tenant architectures",
      "Built AI-driven content automation systems using OpenAI APIs and voice synthesis",
      "Improved semantic search performance by 42% through embedding optimization",
      "Developed bulk email and referral systems supporting 10k+ users",
      "Built scalable REST APIs, authentication systems, feeds, and engagement tracking systems",
      "Implemented modular service-based backend architecture for maintainability and scalability",
    ],
  },
  {
    company: "Freelance / Independent",
    type: "AI & Full-Stack Developer",
    range: "04/2024 – 06/2024",
    title: "Full-Stack AI Developer",
    location: "Remote",
    intro:
      "Building AI-powered full-stack applications, automation systems, and production-ready SaaS products for international clients and personal projects.",
    highlights: [
      "Developed AI code review systems using Gemini and OpenAI APIs",
      "Built automated content generation and short-video AI workflows",
      "Integrated LLMs, semantic search, and AI voice systems into real-world applications",
      "Designed and deployed modern MERN-stack applications with secure authentication",
    ],
  },
  {
    company: "CodeAlpha",
    type: "Internship",
    range: "01/2024 – 03/2024",
    title: "Full-Stack Web Development Intern",
    location: "Remote",
    intro:
      "Worked on real-time backend systems and full-stack web applications using event-driven architectures.",
    highlights: [
      "Built real-time chat applications using WebSockets",
      "Implemented bidirectional communication systems for live messaging",
      "Worked with REST APIs, backend logic, and scalable application flows",
      "Collaborated using Git and modern development workflows",
    ],
  },
];

export const services = [
  {
    title: "AI-Powered SaaS Development",
    description:
      "Building scalable AI-powered SaaS platforms with modern frontend, backend, authentication, and cloud infrastructure.",
  },
  {
    title: "Full-Stack Web Development",
    description:
      "Developing production-ready full-stack applications using React, Next.js, Node.js, PostgreSQL, and modern backend architectures.",
  },
  {
    title: "RAG & AI System Development",
    description:
      "Creating RAG pipelines, semantic search systems, vector database integrations, and LLM-powered applications using LangChain and OpenAI APIs.",
  },
  {
    title: "Backend & API Engineering",
    description:
      "Designing scalable backend systems, REST APIs, authentication flows, RBAC systems, and microservice-based architectures.",
  },
  {
    title: "Authentication & Enterprise Integration",
    description:
      "Implementing secure authentication systems including JWT, OAuth, SAML 2.0, Microsoft Entra ID, and Single Sign-On (SSO).",
  },
  {
    title: "AI Automation Systems",
    description:
      "Building AI-driven automation workflows for content generation, voice synthesis, classification systems, and operational efficiency.",
  },
  {
    title: "Cloud, Deployment & DevOps",
    description:
      "Deploying and managing applications using Docker, CI/CD workflows, Vercel, Supabase, Redis, and production cloud environments.",
  },
];

export const projects = [
  {
title: "Look Atlas",
category: "AI Commerce Infrastructure",
description:
"Architected and shipped a production AI content engine for ecommerce that orchestrates product and model ingestion, shot planning, image/video generation, and paid-download delivery through Fastify APIs + BullMQ workers, backed by Supabase Auth/Postgres/RLS/Storage, Stripe-driven subscription and credit-ledger automation with idempotent webhook handling, abuse-resistant trial controls, calibration pipelines, and multi-provider generation flows across Gemini, OpenAI, and Veo with deployment split across Railway/Render/Vercel and an embedded Shopify app surface.",
tech: [
"TypeScript",
"Node.js",
"Fastify",
"BullMQ",
"Redis",
"Supabase (Postgres, Auth, RLS, Storage)",
"Stripe",
"OpenAI",
"Google Gemini",
"Google Veo",
"React",
"Vite",
"Next.js",
"Shopify App Bridge + React Router",
"Tailwind CSS",
"Railway",
"Render",
"Vercel",
"Docker",
],
live: "https://app.lookatlas.com",
github: null,
featured: true,
},
{
  title: "Climate Tracker Initiative",
  category: "Full-Stack · AI · SaaS",
  description:
    "Engineered an AI-powered ESG data platform utilizing autonomous web agents and LLM extraction pipelines to ingest, structure, and audit corporate sustainability metrics from multi-page PDFs, integrated with enterprise Entra ID SSO.",
  tech: [
    "React",
    "TypeScript",
    "Node.js",
    "Express",
    "PostgreSQL",
    "Supabase",
    "Redis",
    "Bull",
    "OpenAI",
    "LangChain",
    "Puppeteer",
    "Vite",
    "Tailwind CSS"
  ],
  live: "https://app.climatetrackerinitiative.org/",
  github: null,
  featured: true,
},
{ title: "Inhalo: Distributed AI Short-Form Content Engine", category: "Full-Stack & AI Infrastructure", description: "Architected and shipped a distributed, queue-based content automation system that dynamically generates short-form video assets, slideshows, and interactive breathing challenges. Built an agent-centric Python FastAPI service utilizing Gemini, Claude, and ElevenLabs TTS to generate scripts, layout configurations, and voiceovers, integrated with an Express and BullMQ worker queue to isolate and scale heavy FFmpeg/MoviePy video rendering jobs. Engineered a real-time progress-tracking dashboard with React, Supabase, and Redis, enabling seamless pipeline orchestration and template management.", tech: [ "React", "TailwindCSS", "Node.js", "Express", "FastAPI", "BullMQ", "Redis", "Supabase", "Gemini API", "ElevenLabs", "FFmpeg", "MoviePy" ], live: "https://content-automation-puce.vercel.app/", github: null, featured: true, },
  {
    title: "Cozy Craze",
    category: "Full-Stack · E-commerce",
    description:
      "An e-commerce platform with product listings, shopping cart, and secure checkout — a complete solution for online shopping.",
    tech: ["React", "Node.js", "Express", "MongoDB"],
    live: "https://cozy-craze-frontend.vercel.app/",
    github: "https://github.com/HamdanRaza309/cozy-craze",
    featured: false,
  },
  {
    title: "LogBook — Cloud Storage",
    category: "Full-Stack · SaaS",
    description:
      "A cloud-based note-taking app that lets users securely store and manage notes with authentication and cloud storage.",
    tech: ["React", "Node.js", "MongoDB", "JWT"],
    live: null,
    github: "https://github.com/HamdanRaza309/logbook.git",
    featured: false,
  },
  {
    title: "IronEdge Fitness Gym",
    category: "Frontend · API",
    description:
      "A comprehensive gym management app with membership management, class schedules, and user profiles.",
    tech: ["React", "REST API", "Tailwind"],
    live: null,
    github: "https://github.com/HamdanRaza309/IronEdge-FitnessGym-UsingAPI.git",
    featured: false,
  },
  {
    title: "Code Reviewer",
    category: "AI · Tooling",
    description:
      "An AI-powered code reviewer that analyzes code snippets and returns structured suggestions.",
    tech: ["React", "OpenAI", "Node.js"],
    live: "https://code-reviewer-black.vercel.app/",
    github: null,
    featured: false,
  },
];

export const nav = [
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

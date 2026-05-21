export const personal = {
  name: "Hamdan Raza",
  initials: "HR",
  role: "Full-Stack Web Developer",
  tagline: "I build full-stack web apps, ship clean code.",
  intro:
    "Full-stack developer based in Peshawar, Pakistan. I build scalable web applications with the MERN stack and integrate AI features into modern production software.",
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
    "I'm a full-stack developer with a focus on the MERN stack. I started by building small JavaScript projects (games, utilities, clocks) and grew into shipping production-grade React apps and Node.js APIs.",
    "Currently I work on full-stack web applications integrated with AI features and tools — combining clean frontend interfaces with reliable backend services.",
    "My approach: write code that's simple to read, easy to ship, and built to scale. I use AI tools to move faster, not to skip the thinking.",
  ],
};

export const techStack = [
  {
    category: "Frontend",
    items: ["React.js", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Bootstrap", "SASS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express.js", "REST APIs", "Python"],
  },
  {
    category: "Database",
    items: ["MongoDB", "Mongoose"],
  },
  {
    category: "Tools & Workflow",
    items: ["Git", "GitHub", "VS Code", "Postman", "Vercel", "EmailJS"],
  },
];

export const experience = [
  {
    company: "Freelance / Independent",
    type: "Full-Stack Developer",
    range: "2024 — Present",
    title: "Full-Stack Web Developer",
    location: "Peshawar, PK",
    intro:
      "Building full-stack web applications integrated with AI features and tools for clients and personal projects.",
    highlights: [
      "Designed and shipped MERN-stack production apps end-to-end",
      "Integrated AI / OpenAI APIs into client web apps",
      "Built authenticated, cloud-backed apps (LogBook, Cozy Craze)",
      "Maintained code quality with reusable React components and clean APIs",
    ],
  },
  {
    company: "MERN Internship",
    type: "Internship",
    range: "2023 — 2024",
    title: "MERN Stack Web Development Intern",
    location: "Remote",
    intro:
      "Contributed to the development of web applications using the MERN stack (MongoDB, Express, React, Node).",
    highlights: [
      "Built React components and Express APIs for live projects",
      "Worked on authentication, CRUD operations, and REST APIs",
      "Collaborated using Git, GitHub, and code reviews",
      "Learned production deployment workflows (Vercel, MongoDB Atlas)",
    ],
  },
];

export const services = [
  {
    title: "Web Design & Development",
    description:
      "Developing both frontend and backend solutions for websites and web apps with the MERN stack.",
  },
  {
    title: "E-commerce Development",
    description:
      "Building and customizing online stores with integrated payment systems and product management.",
  },
  {
    title: "API Integration",
    description:
      "Integrating third-party APIs (including AI / OpenAI) to extend functionality and improve services.",
  },
  {
    title: "Web Hosting Setup",
    description:
      "Setting up hosting services and domains for your website or web application end-to-end.",
  },
  {
    title: "Web Maintenance & Support",
    description:
      "Providing ongoing support, updates, and bug fixes to keep your site running smoothly.",
  },
];

export const projects = [
  {
    title: "Cozy Craze",
    category: "Full-Stack · E-commerce",
    description:
      "An e-commerce platform with product listings, shopping cart, and secure checkout — a complete solution for online shopping.",
    tech: ["React", "Node.js", "Express", "MongoDB"],
    live: "https://cozy-craze-frontend.vercel.app/",
    github: "https://github.com/HamdanRaza309/cozy-craze",
    featured: true,
  },
  {
    title: "LogBook — Cloud Storage",
    category: "Full-Stack · SaaS",
    description:
      "A cloud-based note-taking app that lets users securely store and manage notes with authentication and cloud storage.",
    tech: ["React", "Node.js", "MongoDB", "JWT"],
    live: null,
    github: "https://github.com/HamdanRaza309/logbook.git",
    featured: true,
  },
  {
    title: "IronEdge Fitness Gym",
    category: "Frontend · API",
    description:
      "A comprehensive gym management app with membership management, class schedules, and user profiles.",
    tech: ["React", "REST API", "Tailwind"],
    live: null,
    github: "https://github.com/HamdanRaza309/IronEdge-FitnessGym-UsingAPI.git",
    featured: true,
  },
  {
    title: "SparkPress — Latest News",
    category: "Frontend · API",
    description:
      "A dynamic news app showcasing the latest headlines and articles with real-time updates and a clean UI.",
    tech: ["React", "News API"],
    live: null,
    github: "https://github.com/HamdanRaza309/SparkPress.git",
    featured: true,
  },
  {
    title: "Code Reviewer",
    category: "AI · Tooling",
    description:
      "An AI-powered code reviewer that analyzes code snippets and returns structured suggestions.",
    tech: ["React", "OpenAI", "Node.js"],
    live: "https://code-reviewer-black.vercel.app/",
    github: null,
    featured: true,
  },
  {
    title: "Quiz App",
    category: "Frontend",
    description:
      "An interactive quiz app where users can test their knowledge on various topics with a responsive design.",
    tech: ["React", "Tailwind"],
    live: null,
    github: "https://github.com/HamdanRaza309/Quiz-App.git",
    featured: false,
  },
  {
    title: "React CRUD",
    category: "Frontend",
    description:
      "A clean CRUD app demonstrating create, read, update, and delete operations in React.",
    tech: ["React", "REST API"],
    live: null,
    github: "https://github.com/HamdanRaza309/Handling-API-Professionally.git",
    featured: false,
  },
  {
    title: "PDF Merger",
    category: "Utility · JS",
    description:
      "A tool for merging multiple PDF files into a single document — simplifies managing and combining PDFs.",
    tech: ["JavaScript", "pdf-lib"],
    live: null,
    github: null,
    featured: false,
  },
  {
    title: "Analogue Clock",
    category: "Vanilla JS",
    description:
      "A classic analogue clock built with JavaScript that displays current time with real-time updates and a stylish design.",
    tech: ["JavaScript", "CSS"],
    live: null,
    github: null,
    featured: false,
  },
  {
    title: "Snake Game for Kids",
    category: "Vanilla JS · Game",
    description:
      "A fun and interactive Snake game designed for kids using vanilla JavaScript — easy to learn with simple controls.",
    tech: ["JavaScript", "HTML5 Canvas"],
    live: null,
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

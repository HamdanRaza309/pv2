"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, BookOpen, Coffee, ArrowRight } from "lucide-react";
import { personal } from "@/lib/data";

const personas = [
  {
    label: "Engineer",
    href: "/engineer",
    icon: Code2,
    description: "Full-stack web apps, production systems, and AI integrations.",
    accent: "group-hover:border-fg/40",
  },
  {
    label: "Research",
    href: "/research",
    icon: BookOpen,
    description: "NeuroAI, brain-computer interfaces, and computational neuroscience.",
    accent: "group-hover:border-[rgb(107,143,113)]/60",
  },
  {
    label: "Off the Clock",
    href: "/life",
    icon: Coffee,
    description: "Hobbies, photos, and the person behind the code.",
    accent: "group-hover:border-[rgb(212,118,91)]/60",
  },
] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function GatePage() {
  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-center px-6 py-16 bg-bg text-fg">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-3xl mx-auto flex flex-col items-center"
      >
        {/* Logo */}
        <motion.div variants={item}>
          <span className="font-serif italic text-4xl sm:text-5xl font-normal text-fg tracking-tight">
            {personal.name.split(" ")[0]}.
          </span>
        </motion.div>

        {/* Prompt */}
        <motion.p
          variants={item}
          className="mt-6 font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-muted text-center"
        >
          Which side of me would you like to see?
        </motion.p>

        {/* Three persona cards */}
        <motion.div
          variants={item}
          className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 w-full"
        >
          {personas.map(({ label, href, icon: Icon, description, accent }) => (
            <Link
              key={href}
              href={href}
              className={`group relative flex flex-col items-center text-center gap-4 sm:gap-5 rounded-2xl border border-fg/10 bg-card/50 backdrop-blur-sm p-8 sm:p-10 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${accent}`}
            >
              <div className="h-12 w-12 rounded-xl bg-fg/5 flex items-center justify-center group-hover:bg-fg/10 transition-colors">
                <Icon className="h-6 w-6 text-fg/70 group-hover:text-fg transition-colors" />
              </div>

              <h2 className="font-display font-bold uppercase tracking-tight text-xl sm:text-2xl text-fg">
                {label}
              </h2>

              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                {description}
              </p>

              <div className="mt-auto pt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-fg/50 group-hover:text-fg transition-colors">
                <span>Explore</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Subtle name below */}
        <motion.div
          variants={item}
          className="mt-12 sm:mt-16 font-mono text-[10px] uppercase tracking-[0.3em] text-muted/50"
        >
          {personal.name} · {new Date().getFullYear()}
        </motion.div>
      </motion.div>
    </div>
  );
}

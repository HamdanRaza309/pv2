"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Splash() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const seen = typeof window !== "undefined" && sessionStorage.getItem("splash-seen");
    if (seen) {
      setShow(false);
      return;
    }
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("splash-seen", "1");
      document.documentElement.style.overflow = "";
    }, 2400);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="splash"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] bg-fg text-bg flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-mono text-[11px] uppercase tracking-[0.3em] text-bg/60"
          >
            Portfolio · 2026
          </motion.div>

          <div className="mt-6 overflow-hidden">
            <motion.div
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-display font-bold text-5xl sm:text-7xl md:text-8xl tracking-tight"
            >
              Hamdan Raza
            </motion.div>
          </div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "200px" }}
            transition={{ duration: 1.2, delay: 0.9, ease: "easeInOut" }}
            className="mt-10 h-px bg-bg/30 overflow-hidden"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.1, delay: 1, ease: "easeInOut" }}
              className="h-full w-full bg-accent"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-bg/50"
          >
            Full-Stack Developer
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

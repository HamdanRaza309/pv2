"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  useEffect(() => {
    // disable on touch / small screens
    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch || window.innerWidth < 1024) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-none-all");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = t.closest("a, button, [role='button'], input, textarea, label");
      setHovering(!!interactive);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.classList.remove("cursor-none-all");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* outer ring — lags slightly */}
      <motion.div
        aria-hidden
        style={{ x: springX, y: springY }}
        className="pointer-events-none fixed left-0 top-0 z-[90]"
      >
        <motion.div
          animate={{
            scale: hovering ? 1.6 : 1,
            backgroundColor: hovering
              ? "rgb(var(--accent) / 0.18)"
              : "rgb(var(--accent) / 0)",
            borderColor: hovering
              ? "rgb(var(--accent) / 0.8)"
              : "rgb(var(--fg) / 0.6)",
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border mix-blend-difference"
        />
      </motion.div>

      {/* inner dot — exact */}
      <motion.div
        aria-hidden
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[91]"
      >
        <motion.div
          animate={{ scale: hovering ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
        />
      </motion.div>
    </>
  );
}

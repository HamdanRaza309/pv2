"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg px-6">
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Error</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-fg">Something went wrong</h1>
        <p className="text-sm text-fg/60 leading-relaxed">
          An unexpected error occurred. It&apos;s probably not your fault.
        </p>
        <button
          onClick={reset}
          className="btn-primary mt-2"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

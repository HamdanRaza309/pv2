export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-fg/10 border-t-accent" />
        <span className="font-mono text-[11px] tracking-[0.3em] text-muted animate-pulse">Loading</span>
      </div>
    </div>
  );
}

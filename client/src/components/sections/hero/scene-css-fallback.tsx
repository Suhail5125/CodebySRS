/**
 * Pure-CSS holographic fallback used when WebGL is unavailable.
 * Renders an animated orb, scanlines, and a starfield using only CSS so
 * the hero still feels alive in headless / unsupported environments.
 */
export function SceneCssFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#070512]">
      {/* Distant starfield (radial CSS) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 13% 27%, rgba(255,255,255,0.85), transparent 60%), radial-gradient(1.5px 1.5px at 78% 18%, rgba(155,240,255,0.9), transparent 60%), radial-gradient(1px 1px at 42% 81%, rgba(255,92,240,0.85), transparent 60%), radial-gradient(1px 1px at 88% 64%, rgba(255,255,255,0.7), transparent 60%), radial-gradient(2px 2px at 24% 56%, rgba(167,139,250,0.8), transparent 60%), radial-gradient(1px 1px at 65% 38%, rgba(255,255,255,0.7), transparent 60%), radial-gradient(1px 1px at 8% 73%, rgba(155,240,255,0.7), transparent 60%), radial-gradient(2px 2px at 92% 88%, rgba(255,92,240,0.7), transparent 60%)",
          backgroundSize: "100% 100%",
        }}
      />

      {/* Conic glow nebula */}
      <div
        className="absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl motion-safe:animate-spin"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(0,240,255,0.45), rgba(255,92,240,0.35), rgba(167,139,250,0.4), rgba(0,240,255,0.45))",
          animationDuration: "30s",
        }}
      />

      {/* Central holo orb */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative h-72 w-72">
          <div
            className="absolute inset-0 rounded-full motion-safe:animate-pulse"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.55), rgba(0,240,255,0.6) 30%, rgba(255,92,240,0.45) 60%, transparent 75%)",
              boxShadow:
                "0 0 80px rgba(0,240,255,0.5), 0 0 140px rgba(255,92,240,0.35)",
            }}
          />
          <div
            className="absolute inset-0 rounded-full motion-safe:animate-spin"
            style={{
              border: "1px solid rgba(0,240,255,0.5)",
              animationDuration: "12s",
            }}
          />
          <div
            className="absolute inset-6 rounded-full motion-safe:animate-spin"
            style={{
              border: "1px dashed rgba(255,92,240,0.4)",
              animationDuration: "18s",
              animationDirection: "reverse",
            }}
          />
          <div
            className="absolute inset-12 rounded-full motion-safe:animate-spin"
            style={{
              border: "1px solid rgba(167,139,250,0.4)",
              animationDuration: "9s",
            }}
          />
        </div>
      </div>

      {/* Subtle scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,240,255,0.6) 0px, rgba(0,240,255,0.6) 1px, transparent 1px, transparent 4px)",
        }}
      />
    </div>
  );
}

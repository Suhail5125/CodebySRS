import { useState, useRef } from "react";
import { Code2, Palette, Smartphone, Rocket, Globe, Zap } from "lucide-react";
import { SectionHeader } from "@/components/section-header";

const BG     = "#0A0A0A";
const INK    = "#F2EFE6";
const ACCENT = "#FF3D00";

const PALETTES = [
  { bg: "#FF3D00", text: "#0A0A0A", sub: "rgba(0,0,0,0.45)",       tag: "#0A0A0A", tagText: "#FF3D00" },
  { bg: "#F2EFE6", text: "#0A0A0A", sub: "rgba(0,0,0,0.4)",        tag: "#0A0A0A", tagText: "#F2EFE6" },
  { bg: "#1A1A1A", text: "#F2EFE6", sub: "rgba(255,255,255,0.4)",   tag: "#F2EFE6", tagText: "#1A1A1A" },
  { bg: "#FF3D00", text: "#0A0A0A", sub: "rgba(0,0,0,0.45)",       tag: "#0A0A0A", tagText: "#FF3D00" },
  { bg: "#F2EFE6", text: "#0A0A0A", sub: "rgba(0,0,0,0.4)",        tag: "#0A0A0A", tagText: "#F2EFE6" },
  { bg: "#0F0F0F", text: "#F2EFE6", sub: "rgba(255,255,255,0.4)",   tag: "#F2EFE6", tagText: "#0F0F0F" },
];

/*
 * LEAN — how far each strip's edge angles (in CSS vw).
 *
 * Each strip's coloured inner div bleeds LEAN above AND below its layout box
 * via negative margins.  The clip-path polygon is drawn inside that extended
 * area, so adjacent strips always overlap — eliminating any gap regardless of
 * z-order.  A 2 px extension on every polygon edge kills sub-pixel antialiasing
 * gaps where two strips meet at exactly the same y coordinate.
 *
 *   /  strip  → polygon(0 LEAN, W 0,    W 100%-LEAN, 0 100%)   (left low, right high)
 *   \  strip  → polygon(0 0,    W LEAN, W 100%,      0 100%-LEAN) (left high, right low)
 */
const LEAN = "5vw";

function shuffleZ(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i + 2); // 2…n+1
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const services = [
  {
    code: "WD", icon: Code2,
    title: "Web Development",
    description: "Custom web applications built with React, Next.js and Node.js. Responsive, fast-loading, scalable.",
    deliverables: ["SSR/SSG", "API Layer", "CI/CD", "Type-Safe DB"],
  },
  {
    code: "UX", icon: Palette,
    title: "UI/UX Design",
    description: "Pixel-perfect interfaces grounded in research, wireframes and prototypes that convert.",
    deliverables: ["Design System", "Prototype", "Tokens", "Hand-off"],
  },
  {
    code: "MB", icon: Smartphone,
    title: "Mobile Development",
    description: "Native iOS / Android and cross-platform builds (React Native, Flutter) with first-class UX.",
    deliverables: ["Native UI", "Push", "Offline", "App Store"],
  },
  {
    code: "3D", icon: Globe,
    title: "3D Web Experiences",
    description: "WebGL / Three.js product configurators, virtual showrooms and interactive marketing scenes.",
    deliverables: ["WebGL", "Three.js", "GLTF", "Animation"],
  },
  {
    code: "PF", icon: Zap,
    title: "Performance",
    description: "Audit, profile and optimise. Code-splitting, lazy loading, edge caching, real Lighthouse wins.",
    deliverables: ["Audit", "Bundle Cut", "Cache", "Core Web Vitals"],
  },
  {
    code: "CS", icon: Rocket,
    title: "Consulting & Strategy",
    description: "Architecture reviews, scalability planning, technology roadmaps for digital transformation.",
    deliverables: ["Audit", "Roadmap", "Stack Pick", "Hiring"],
  },
];

export function ServicesSection() {
  const [active, setActive] = useState<number | null>(null);
  const zIndices = useRef(shuffleZ(services.length)).current;

  return (
    <section
      id="services"
      className="snap-screen relative flex min-h-screen flex-col justify-center"
      style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        <div className="mx-auto w-full max-w-[1400px]">
          <SectionHeader
            num="04"
            name="SERVICES"
            kicker="// PRODUCTION SCOPE"
            headline="WHAT I BUILD FOR CLIENTS"
            right={`${String(services.length).padStart(2, "0")} OFFERINGS`}
            variant="split"
          />
        </div>
      </div>

      {/*
       * ── Slab stack ──────────────────────────────────────────────────────
       * overflow:hidden clips the top bleed of strip[0] and bottom bleed of
       * strip[5] against the section edge.  Between strips the bleeds are
       * INSIDE this container so they are never clipped.
       */}
      <div
        className="relative w-full"
        style={{ overflow: "hidden" }}
        onMouseLeave={() => setActive(null)}
      >
        {services.map((svc, i) => (
          <Slab
            key={svc.code}
            svc={svc}
            index={i}
            total={services.length}
            palette={PALETTES[i % PALETTES.length]}
            zIndex={zIndices[i]}
            isActive={active === i}
            isDimmed={active !== null && active !== i}
            onEnter={() => setActive(i)}
          />
        ))}
      </div>

      {/* ── Footer strip ────────────────────────────────────────────────── */}
      <div
        className="relative z-10 flex flex-col items-start justify-between gap-4 px-6 py-5 font-mono text-[11px] uppercase tracking-[0.2em] md:flex-row md:items-center"
        style={{ background: BG, borderTop: `2px solid ${INK}` }}
      >
        <div className="flex items-center gap-3">
          <span style={{ color: ACCENT }}>●</span>
          <span>QUEUE OPEN — Q3 / Q4 2026</span>
        </div>
        <div className="flex items-center gap-3 opacity-60">
          <span>RETAINER + PROJECT</span>
          <span>·</span>
          <span>EU / NA TIMEZONES</span>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Slab — single service strip
   ═══════════════════════════════════════════════════════════════════════════ */
function Slab({
  svc, index, total, palette, zIndex, isActive, isDimmed, onEnter,
}: {
  svc: (typeof services)[number];
  index: number;
  total: number;
  palette: (typeof PALETTES)[number];
  zIndex: number;
  isActive: boolean;
  isDimmed: boolean;
  onEnter: () => void;
}) {
  const num    = String(index + 1).padStart(2, "0");
  const total2 = String(total).padStart(2, "0");
  const isOdd  = index % 2 === 1;

  /*
   * clip-path maths
   * ─────────────────
   * Inner div: marginTop/Bottom = -LEAN  →  bleeds LEAN above & below outer div.
   * The polygon is in the inner div's coordinate space (border-box = full height
   * including the bleed zones).
   *
   * /  strip (even): top-right corner at y=0 (bleed up), bottom-left at y=100% (bleed down)
   * \  strip  (odd): top-left corner at y=0 (bleed up), bottom-right at y=100% (bleed down)
   *
   * The ±2px extensions prevent 1-pixel antialiasing seams where two strips
   * share an exact y coordinate at x = viewport-right.
   */
  const clipSlant = isOdd
    ? `polygon(0 -2px, 100% calc(${LEAN} - 2px), 100% calc(100% + 2px), 0 calc(100% - ${LEAN} + 2px))`
    : `polygon(0 calc(${LEAN} - 2px), 100% -2px, 100% calc(100% - ${LEAN} + 2px), 0 calc(100% + 2px))`;

  /* On hover → clean straight rectangle scoped to the content zone */
  const clipRect = `polygon(0 0, 100% 0, 100% 100%, 0 100%)`;

  return (
    /*
     * Outer div: layout only — no transform so bleed positions are exact.
     * z-index stacking creates the "random layering" look.
     */
    <div
      onMouseEnter={onEnter}
      style={{
        position: "relative",
        zIndex: isActive ? 30 : zIndex,
        opacity: isDimmed ? 0.35 : 1,
        transition: "opacity 0.3s ease",
        cursor: "default",
      }}
    >
      {/*
       * Inner div: the coloured parallelogram.
       * Negative margins make it bleed LEAN beyond the outer div edges.
       * clip-path shapes it; transition animates it to a rectangle on hover.
       */}
      <div
        style={{
          background: palette.bg,
          marginTop:    `calc(-${LEAN})`,
          marginBottom: `calc(-${LEAN})`,
          paddingTop:    `calc(${LEAN} + 18px)`,
          paddingBottom: `calc(${LEAN} + 18px)`,
          paddingLeft:  "32px",
          paddingRight: "40px",
          clipPath: isActive ? clipRect : clipSlant,
          display: "flex",
          alignItems: "center",
          gap: "24px",
          position: "relative",
          transition: "clip-path 0.42s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Ghost watermark */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: "-12px",
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "Inter, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(80px, 12vw, 180px)",
            lineHeight: 1,
            letterSpacing: "-0.07em",
            color: palette.bg === "#1A1A1A" || palette.bg === "#0F0F0F"
              ? "rgba(255,255,255,0.04)"
              : "rgba(0,0,0,0.06)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {num}
        </span>

        {/* Large index number */}
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(36px, 5vw, 72px)",
            lineHeight: 1,
            letterSpacing: "-0.06em",
            color: palette.text,
            flexShrink: 0,
            minWidth: "2ch",
            opacity: 0.95,
          }}
        >
          {num}
        </span>

        {/* SVC code — vertical */}
        <div
          className="hidden sm:block"
          style={{
            fontFamily: "monospace",
            fontSize: "9px",
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: palette.sub,
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          SVC_{svc.code}
        </div>

        {/* Title + description */}
        <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          <h3
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(22px, 3.8vw, 58px)",
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
              textTransform: "uppercase",
              color: palette.text,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {svc.title}
          </h3>

          <div
            style={{
              maxHeight: isActive ? "140px" : "0px",
              overflow: "hidden",
              transition: "max-height 0.42s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "12px",
                lineHeight: 1.6,
                color: palette.text,
                opacity: isActive ? 0.75 : 0,
                transform: isActive ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.28s ease 0.14s, transform 0.28s ease 0.14s",
                marginTop: "10px",
                maxWidth: "52ch",
              }}
            >
              {svc.description}
            </p>
          </div>
        </div>

        {/* Deliverable tags */}
        <div
          className="hidden lg:flex"
          style={{
            flexDirection: "column",
            gap: "5px",
            alignItems: "flex-end",
            flexShrink: 0,
            opacity: isActive ? 1 : 0,
            transform: isActive ? "translateX(0)" : "translateX(16px)",
            transition: "opacity 0.28s ease 0.12s, transform 0.28s ease 0.12s",
            pointerEvents: isActive ? "auto" : "none",
          }}
        >
          {svc.deliverables.map((d) => (
            <span
              key={d}
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "3px 9px",
                background: palette.tag,
                color: palette.tagText,
                whiteSpace: "nowrap",
                fontWeight: 600,
              }}
            >
              {d}
            </span>
          ))}
        </div>

        {/* Counter + arrow */}
        <div
          className="hidden md:flex"
          style={{ flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: palette.sub,
            }}
          >
            {num} / {total2}
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "22px",
              color: palette.text,
              display: "block",
              transform: isActive ? "translate(4px,-3px) rotate(-42deg)" : "translate(0,0) rotate(0deg)",
              transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease",
              opacity: isActive ? 1 : 0.35,
            }}
          >
            →
          </span>
        </div>
      </div>
    </div>
  );
}

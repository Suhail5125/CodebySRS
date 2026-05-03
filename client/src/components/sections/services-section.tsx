import { useState, useRef } from "react";
import { Code2, Palette, Smartphone, Rocket, Globe, Zap } from "lucide-react";
import { SectionHeader } from "@/components/section-header";

const BG    = "#0A0A0A";
const INK   = "#F2EFE6";
const ACCENT = "#FF3D00";

const PALETTES = [
  { bg: "#FF3D00", text: "#0A0A0A", sub: "rgba(0,0,0,0.5)",  tag: "#0A0A0A", tagText: "#FF3D00" },
  { bg: "#F2EFE6", text: "#0A0A0A", sub: "rgba(0,0,0,0.45)", tag: "#0A0A0A", tagText: "#F2EFE6" },
  { bg: "#1E1E1E", text: "#F2EFE6", sub: "rgba(255,255,255,0.45)", tag: "#F2EFE6", tagText: "#1E1E1E" },
  { bg: "#FF3D00", text: "#0A0A0A", sub: "rgba(0,0,0,0.5)",  tag: "#0A0A0A", tagText: "#FF3D00" },
  { bg: "#F2EFE6", text: "#0A0A0A", sub: "rgba(0,0,0,0.45)", tag: "#0A0A0A", tagText: "#F2EFE6" },
  { bg: "#111111", text: "#F2EFE6", sub: "rgba(255,255,255,0.45)", tag: "#F2EFE6", tagText: "#111111" },
];

/*
 * All strips lean the SAME direction (all positive skewY, left stays / right drops).
 * Same-direction skews tile seamlessly with ANY positive overlap — no gap is
 * physically possible. Varying angles create depth variety like the reference.
 *
 * transformOrigin: "left center" means the left edge doesn't move; the right
 * edge shears down by width × tan(angle).
 *
 * Overlap = 8vw. At the worst adjacent-angle pair (5° vs 2°):
 *   gap-risk = width × (tan5° − tan2°) ≈ 5.26vw → 8vw covers it with 2.74vw margin.
 */
const ANGLES = [3, 4.5, 2, 5, 3.5, 4]; // degrees — all positive, all same lean

function shuffleZ(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i + 2);
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
      {/* Header */}
      <div className="px-4 pt-10 pb-6 sm:px-6 lg:px-10 lg:pt-14">
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

      {/* Strip stack */}
      <div
        className="relative w-full"
        style={{ overflow: "visible" }}
        onMouseLeave={() => setActive(null)}
      >
        {services.map((svc, i) => (
          <Slab
            key={svc.code}
            svc={svc}
            index={i}
            total={services.length}
            palette={PALETTES[i % PALETTES.length]}
            angle={ANGLES[i % ANGLES.length]}
            zIndex={zIndices[i]}
            isActive={active === i}
            onEnter={() => setActive(i)}
          />
        ))}
      </div>

      {/* Footer */}
      <div
        className="relative z-10 mt-8 flex flex-col items-start justify-between gap-4 px-6 py-5 font-mono text-[11px] uppercase tracking-[0.2em] md:flex-row md:items-center"
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

function Slab({
  svc, index, total, palette, angle, zIndex, isActive, onEnter,
}: {
  svc: (typeof services)[number];
  index: number;
  total: number;
  palette: (typeof PALETTES)[number];
  angle: number;
  zIndex: number;
  isActive: boolean;
  onEnter: () => void;
}) {
  const num    = String(index + 1).padStart(2, "0");
  const total2 = String(total).padStart(2, "0");

  /*
   * Compact strip — most content is hidden under the next strip.
   * On hover the strip straightens and the description expands.
   * No dimming of sibling strips ("no blackish when hover").
   *
   * Overlap: -8vw  so adjacent same-direction strips never gap.
   * Extra top/bottom padding: 8vw + 16px compensates so content stays
   * centred inside the visible band.
   */
  const OVERLAP_VW = 8;

  return (
    <div
      onMouseEnter={onEnter}
      style={{
        position: "relative",
        zIndex: isActive ? 30 : zIndex,
        marginTop: index === 0 ? 0 : `calc(-${OVERLAP_VW}vw)`,
        /* Straighten on hover; keep lean otherwise */
        transform: isActive
          ? "skewY(0deg)"
          : `skewY(${angle}deg)`,
        transformOrigin: "left center",
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        cursor: "default",
      }}
    >
      <div
        style={{
          background: palette.bg,
          paddingTop:    `calc(${OVERLAP_VW}vw + 16px)`,
          paddingBottom: `calc(${OVERLAP_VW}vw + 16px)`,
          paddingLeft: "32px",
          paddingRight: "40px",
          display: "flex",
          alignItems: "center",
          gap: "24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ghost watermark */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: "-8px",
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "Inter, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(80px, 12vw, 180px)",
            lineHeight: 1,
            letterSpacing: "-0.07em",
            color: palette.bg === "#1E1E1E" || palette.bg === "#111111"
              ? "rgba(255,255,255,0.04)"
              : "rgba(0,0,0,0.07)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {num}
        </span>

        {/* Index number */}
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(32px, 4.5vw, 68px)",
            lineHeight: 1,
            letterSpacing: "-0.06em",
            color: palette.text,
            flexShrink: 0,
            minWidth: "2ch",
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
              fontSize: "clamp(20px, 3.5vw, 56px)",
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
                transition: "opacity 0.28s ease 0.15s, transform 0.28s ease 0.15s",
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
          <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: palette.sub }}>
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
              opacity: isActive ? 1 : 0.4,
            }}
          >
            →
          </span>
        </div>
      </div>
    </div>
  );
}

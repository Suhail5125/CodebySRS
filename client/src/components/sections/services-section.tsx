import { useState } from "react";
import { Code2, Palette, Smartphone, Rocket, Globe, Zap, ArrowUpRight } from "lucide-react";
import { useReveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

const BG     = "#0A0A0A";
const INK    = "#F2EFE6";
const ACCENT = "#FF3D00";

/*
 * LEAN — the diagonal offset in pixels.
 * Each strip's top edge rises LEAN px from left→right (right side is higher).
 * clip-path: polygon(0 LEAN, 100% 0, 100% calc(100%-LEAN), 0 100%)
 * Each strip after the first gets marginTop: -LEAN so the top overlap
 * of strip N+1 perfectly meets the bottom of strip N — zero gap.
 */
const LEAN = 52;

/*
 * Content padding inside the visible parallelogram area.
 * Collapsed: compact — just index + title visible.
 * Expanded:  taller — description + deliverables revealed.
 */
const PY_COLLAPSED = 18;
const PY_EXPANDED  = 50;

const PALETTES = [
  { bg: "#FF3D00", text: "#0A0A0A", muted: "rgba(0,0,0,0.42)", tagBg: "rgba(0,0,0,0.14)", tagText: "#0A0A0A" },
  { bg: "#F2EFE6", text: "#0A0A0A", muted: "rgba(0,0,0,0.38)", tagBg: "rgba(0,0,0,0.1)",  tagText: "#0A0A0A" },
  { bg: "#1E1E1E", text: "#F2EFE6", muted: "rgba(242,239,230,0.42)", tagBg: "rgba(242,239,230,0.1)", tagText: "#F2EFE6" },
  { bg: "#FF3D00", text: "#0A0A0A", muted: "rgba(0,0,0,0.42)", tagBg: "rgba(0,0,0,0.14)", tagText: "#0A0A0A" },
  { bg: "#F2EFE6", text: "#0A0A0A", muted: "rgba(0,0,0,0.38)", tagBg: "rgba(0,0,0,0.1)",  tagText: "#0A0A0A" },
  { bg: "#121212", text: "#F2EFE6", muted: "rgba(242,239,230,0.42)", tagBg: "rgba(242,239,230,0.1)", tagText: "#F2EFE6" },
];

const services = [
  {
    code: "WD",
    icon: Code2,
    title: "Web Development",
    description:
      "Custom web applications built with React, Next.js, and Node.js — fully type-safe from database to UI. SSR/SSG ready, CI/CD deployed, and engineered for sub-second load times at any scale. Every project ships with a robust API layer and automated staging pipeline.",
    deliverables: ["SSR/SSG", "API Layer", "CI/CD", "Type-Safe DB"],
  },
  {
    code: "UX",
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Pixel-perfect interfaces grounded in user research — from discovery workshops and information architecture through to interactive Figma prototypes and a complete design system with tokens, component specs, and annotated developer hand-off documentation.",
    deliverables: ["Design System", "Prototype", "Tokens", "Hand-off"],
  },
  {
    code: "MB",
    icon: Smartphone,
    title: "Mobile Development",
    description:
      "Native iOS & Android and cross-platform builds using React Native or Flutter. First-class UX, smooth 60fps animations, push notifications, offline-first data sync, and full App Store & Play Store submission handled end-to-end including ASO.",
    deliverables: ["Native UI", "Push", "Offline", "App Store"],
  },
  {
    code: "3D",
    icon: Globe,
    title: "3D Web Experiences",
    description:
      "WebGL / Three.js product configurators, virtual showrooms, and interactive marketing scenes running in the browser at 60fps. Custom GLTF asset pipelines, PBR shaders, real-time lighting, physics-based animation, and progressive mobile-safe delivery.",
    deliverables: ["WebGL", "Three.js", "GLTF", "Animation"],
  },
  {
    code: "PF",
    icon: Zap,
    title: "Performance",
    description:
      "Deep profiling and systematic optimisation — code-splitting, lazy loading, critical CSS, image compression, edge caching, and database query tuning. Real Core Web Vitals improvements that push Lighthouse scores into the 90s and move conversion metrics.",
    deliverables: ["Audit", "Bundle Cut", "Cache", "Core Web Vitals"],
  },
  {
    code: "CS",
    icon: Rocket,
    title: "Consulting & Strategy",
    description:
      "Architecture reviews, scalability planning, and technology roadmaps for digital transformation — including stack selection, monolith-to-microservices planning, team structuring, hiring guidance, and embedded technical leadership on retainer or project basis.",
    deliverables: ["Audit", "Roadmap", "Stack Pick", "Hiring"],
  },
];

export function ServicesSection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section
      id="services"
      className="snap-screen relative min-h-screen"
      style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
      onMouseLeave={() => setActive(null)}
    >
      {/* Header — contained, padded */}
      <div className="mx-auto w-full max-w-[1400px] px-6 pb-6 pt-16 lg:px-10 lg:pt-20">
        <SectionHeader
          num="04"
          name="SERVICES"
          kicker="// PRODUCTION SCOPE"
          headline="WHAT I BUILD FOR CLIENTS"
          right={`${String(services.length).padStart(2, "0")} OFFERINGS`}
          variant="split"
        />
      </div>

      {/*
       * Full-bleed strips — NO horizontal padding on this wrapper.
       * Each strip is a clip-path parallelogram with diagonal top + bottom.
       * marginTop: -LEAN on strips 2-6 creates the shingle overlap.
       * z-index increases so each strip layers on top of the previous.
       */}
      <div style={{ width: "100%", position: "relative" }}>
        {services.map((svc, i) => (
          <Strip
            key={svc.code}
            svc={svc}
            index={i}
            total={services.length}
            palette={PALETTES[i % PALETTES.length]}
            isActive={active === i}
            isDimmed={active !== null && active !== i}
            onEnter={() => setActive(i)}
          />
        ))}
      </div>

      {/* Bottom status strip — contained, padded */}
      <div className="mx-auto w-full max-w-[1400px] px-6 pb-14 pt-4 lg:px-10">
        <div
          className="flex flex-col items-start justify-between gap-4 px-6 py-5 font-mono text-[11px] uppercase tracking-[0.2em] md:flex-row md:items-center"
          style={{ border: `2px solid ${INK}` }}
        >
          <div className="flex items-center gap-3">
            <span style={{ color: ACCENT }}>●</span>
            <span>QUEUE OPEN — Q3 / Q4 2026</span>
          </div>
          <div className="flex items-center gap-3 opacity-55">
            <span>RETAINER + PROJECT</span>
            <span>·</span>
            <span>EU / NA TIMEZONES</span>
          </div>
        </div>
      </div>
    </section>
  );
}

type Palette = (typeof PALETTES)[number];

function Strip({
  svc,
  index,
  total,
  palette,
  isActive,
  isDimmed,
  onEnter,
}: {
  svc: (typeof services)[number];
  index: number;
  total: number;
  palette: Palette;
  isActive: boolean;
  isDimmed: boolean;
  onEnter: () => void;
}) {
  const { ref, style: revealStyle } = useReveal({
    delay: index * 70,
    variant: "fade",
    threshold: 0.03,
  });

  const num    = String(index + 1).padStart(2, "0");
  const total2 = String(total).padStart(2, "0");
  const PY     = isActive ? PY_EXPANDED : PY_COLLAPSED;

  /*
   * Parallelogram clip-path — right side is LEAN px higher than left side.
   * Top  edge: from (0, LEAN) on the left  → (100%, 0)   on the right.
   * Bottom edge: from (0, 100%) on the left → (100%, calc(100%-LEAN)) on the right.
   * This creates a consistent / lean. All 6 strips lean the same way.
   */
  const clipPath = `polygon(0 ${LEAN}px, 100% 0, 100% calc(100% - ${LEAN}px), 0 100%)`;

  return (
    <div
      ref={ref}
      onMouseEnter={onEnter}
      style={{
        position: "relative",
        /* Each strip (after the first) overlaps the one above by exactly LEAN px,
           so the top-left corner of this strip meets the bottom-left of the strip above —
           zero visual gap between parallelograms. */
        marginTop: index === 0 ? 0 : -LEAN,
        /* Layer order: last strip sits on top — creates depth */
        zIndex: index + 1,
        /* Parallelogram clip — diagonal top and bottom edges */
        clipPath,
        /* Background colour fills the entire layout box (including LEAN bleed areas) */
        background: palette.bg,
        /* Padding drives the total strip height and the visible content area.
           Top and bottom include LEAN so content sits inside the clipped region. */
        paddingTop:    `${LEAN + PY}px`,
        paddingBottom: `${LEAN + PY}px`,
        transition: [
          "padding 0.46s cubic-bezier(0.16,1,0.3,1)",
          "opacity 0.3s ease",
        ].join(", "),
        opacity: isDimmed ? 0.28 : 1,
        cursor: "default",
        ...revealStyle,
      }}
    >
      {/* Ghost watermark — absolute, clipped by the parallelogram */}
      <div
        aria-hidden
        style={{
          position:     "absolute",
          right:        "-8px",
          top:          "50%",
          transform:    "translateY(-50%)",
          fontFamily:   "Inter, sans-serif",
          fontWeight:   900,
          fontSize:     "clamp(140px, 22vw, 300px)",
          lineHeight:   1,
          letterSpacing: "-0.07em",
          color:
            palette.bg === "#1E1E1E" || palette.bg === "#121212"
              ? "rgba(255,255,255,0.038)"
              : "rgba(0,0,0,0.055)",
          pointerEvents: "none",
          userSelect:    "none",
          zIndex:        0,
        }}
      >
        {num}
      </div>

      {/*
       * Content row — skewY(-1.5deg) gives the text a subtle lean
       * that echoes the parallelogram's diagonal, making it feel like
       * the text physically sits inside the tilted strip.
       * This stays skewed on hover (strip never straightens).
       */}
      <div
        className="relative mx-auto flex w-full max-w-[1400px] items-center gap-5 px-6 lg:gap-8 lg:px-10"
        style={{
          zIndex:    1,
          transform: "skewY(-1.5deg)",
          transformOrigin: "left center",
        }}
      >
        {/* Index + SVC code */}
        <div style={{ flexShrink: 0 }}>
          <span
            style={{
              fontFamily:    "Inter, sans-serif",
              fontWeight:    900,
              fontSize:      "clamp(34px, 5vw, 72px)",
              lineHeight:    1,
              letterSpacing: "-0.06em",
              color:         palette.text,
              display:       "block",
            }}
          >
            {num}
          </span>
          <span
            className="hidden sm:block"
            style={{
              fontFamily:    "monospace",
              fontSize:      "9px",
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color:         palette.muted,
              marginTop:     "4px",
            }}
          >
            SVC_{svc.code}
          </span>
        </div>

        {/* Divider rule */}
        <div
          className="hidden sm:block"
          style={{
            width:      "2px",
            height:     "42px",
            background: palette.muted,
            flexShrink: 0,
            opacity:    0.35,
          }}
        />

        {/* Title + revealed content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title — always visible */}
          <h3
            style={{
              fontFamily:    "Inter, sans-serif",
              fontWeight:    900,
              fontSize:      "clamp(20px, 3.8vw, 58px)",
              lineHeight:    0.92,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color:         palette.text,
            }}
          >
            {svc.title}
          </h3>

          {/* Description + tags — only on hover, smooth height reveal */}
          <div
            style={{
              maxHeight:  isActive ? "280px" : "0px",
              overflow:   "hidden",
              transition: "max-height 0.46s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <p
              style={{
                fontFamily:  "monospace",
                fontSize:    "clamp(11px, 1vw, 13px)",
                lineHeight:  1.7,
                color:       palette.text,
                opacity:     isActive ? 0.76 : 0,
                transform:   isActive ? "translateY(0)" : "translateY(8px)",
                transition:  "opacity 0.34s ease 0.16s, transform 0.34s ease 0.16s",
                marginTop:   "12px",
                maxWidth:    "58ch",
              }}
            >
              {svc.description}
            </p>

            <div
              style={{
                display:    "flex",
                flexWrap:   "wrap",
                gap:        "6px",
                marginTop:  "14px",
                opacity:    isActive ? 1 : 0,
                transform:  isActive ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 0.3s ease 0.26s, transform 0.3s ease 0.26s",
              }}
            >
              {svc.deliverables.map((d) => (
                <span
                  key={d}
                  style={{
                    fontFamily:    "monospace",
                    fontSize:      "9px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    padding:       "4px 10px",
                    background:    palette.tagBg,
                    color:         palette.tagText,
                    fontWeight:    600,
                  }}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Counter + arrow */}
        <div
          className="hidden md:flex"
          style={{
            flexDirection:  "column",
            alignItems:     "flex-end",
            justifyContent: "center",
            gap:            "10px",
            flexShrink:     0,
          }}
        >
          <span
            style={{
              fontFamily:    "monospace",
              fontSize:      "9px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color:         palette.muted,
            }}
          >
            {num} / {total2}
          </span>
          <ArrowUpRight
            style={{
              color:      palette.text,
              width:      "26px",
              height:     "26px",
              opacity:    isActive ? 1 : 0.25,
              transform:  isActive ? "translate(3px,-3px)" : "translate(0,0)",
              transition: "opacity 0.3s ease, transform 0.38s cubic-bezier(0.16,1,0.3,1)",
            }}
            strokeWidth={2.2}
          />
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Code2, Palette, Smartphone, Rocket, Globe, Zap, ArrowUpRight } from "lucide-react";
import { useReveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

const BG     = "#0A0A0A";
const INK    = "#F2EFE6";
const ACCENT = "#FF3D00";

/*
 * BG_BLEED: the skewed background div extends this many px above and below
 * the outer wrapper. Must exceed: viewport_width × tan(|max_skew|) / 2.
 * At 3.2° and 1920px: 1920 × tan(3.2°) ≈ 107px → 130px is safe.
 */
const BG_BLEED = 130;

/* Padding inside each strip (excluding bleed):
 * COLLAPSED — only title row visible, compact.
 * EXPANDED  — title + description + tags, taller.
 */
const PY_COLLAPSED = 22;
const PY_EXPANDED  = 52;

const PALETTES = [
  { bg: "#FF3D00", text: "#0A0A0A", muted: "rgba(0,0,0,0.45)", tagBg: "rgba(0,0,0,0.13)", tagText: "#0A0A0A" },
  { bg: "#F2EFE6", text: "#0A0A0A", muted: "rgba(0,0,0,0.4)",  tagBg: "rgba(0,0,0,0.1)",  tagText: "#0A0A0A" },
  { bg: "#1C1C1C", text: "#F2EFE6", muted: "rgba(242,239,230,0.45)", tagBg: "rgba(242,239,230,0.1)", tagText: "#F2EFE6" },
  { bg: "#FF3D00", text: "#0A0A0A", muted: "rgba(0,0,0,0.45)", tagBg: "rgba(0,0,0,0.13)", tagText: "#0A0A0A" },
  { bg: "#F2EFE6", text: "#0A0A0A", muted: "rgba(0,0,0,0.4)",  tagBg: "rgba(0,0,0,0.1)",  tagText: "#0A0A0A" },
  { bg: "#111111", text: "#F2EFE6", muted: "rgba(242,239,230,0.45)", tagBg: "rgba(242,239,230,0.1)", tagText: "#F2EFE6" },
];

const SKEWS = [-3.2, 3.2, -3.2, 3.2, -3.2, 3.2];

const services = [
  {
    code: "WD",
    icon: Code2,
    title: "Web Development",
    description:
      "Custom web applications built with React, Next.js, and Node.js — fully type-safe from database to UI. SSR/SSG ready, CI/CD deployed, and engineered for sub-second load times at any scale. Every project ships with a robust API layer, automated testing, and a staging environment.",
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
      "Native iOS & Android and cross-platform builds using React Native or Flutter. First-class UX, smooth 60fps animations, push notifications, offline-first data sync, and full App Store & Play Store submission handled end-to-end — including App Store Optimization.",
    deliverables: ["Native UI", "Push", "Offline", "App Store"],
  },
  {
    code: "3D",
    icon: Globe,
    title: "3D Web Experiences",
    description:
      "WebGL / Three.js product configurators, virtual showrooms, and interactive marketing scenes that run in the browser at 60fps. Custom GLTF asset pipelines, PBR shaders, real-time lighting, physics-based animations, and progressive loading for mobile-safe delivery.",
    deliverables: ["WebGL", "Three.js", "GLTF", "Animation"],
  },
  {
    code: "PF",
    icon: Zap,
    title: "Performance",
    description:
      "Deep profiling and systematic optimisation — code-splitting, lazy loading, critical CSS, image compression, edge caching, and database query tuning. Real, measurable Core Web Vitals improvements that move Lighthouse scores into the 90s and directly improve conversion rates.",
    deliverables: ["Audit", "Bundle Cut", "Cache", "Core Web Vitals"],
  },
  {
    code: "CS",
    icon: Rocket,
    title: "Consulting & Strategy",
    description:
      "Architecture reviews, scalability planning, and technology roadmaps for digital transformation — including stack selection, monolith-to-microservices migration planning, team structuring, hiring guidance, and embedded technical leadership on a retainer or project basis.",
    deliverables: ["Audit", "Roadmap", "Stack Pick", "Hiring"],
  },
];

export function ServicesSection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    /* No horizontal padding on the section — strips must be full-bleed */
    <section
      id="services"
      className="snap-screen relative min-h-screen"
      style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
      onMouseLeave={() => setActive(null)}
    >
      {/* ── Header — padded container ───────────────────────────────────── */}
      <div className="mx-auto w-full max-w-[1400px] px-6 pb-8 pt-16 lg:px-10 lg:pt-20">
        <SectionHeader
          num="04"
          name="SERVICES"
          kicker="// PRODUCTION SCOPE"
          headline="WHAT I BUILD FOR CLIENTS"
          right={`${String(services.length).padStart(2, "0")} OFFERINGS`}
          variant="split"
        />
      </div>

      {/* ── Full-bleed strips — no container, no side padding ──────────── */}
      <div style={{ width: "100%" }}>
        {services.map((svc, i) => (
          <Strip
            key={svc.code}
            svc={svc}
            index={i}
            total={services.length}
            palette={PALETTES[i % PALETTES.length]}
            skew={SKEWS[i % SKEWS.length]}
            isActive={active === i}
            isDimmed={active !== null && active !== i}
            onEnter={() => setActive(i)}
          />
        ))}
      </div>

      {/* ── Bottom status strip — padded container ─────────────────────── */}
      <div className="mx-auto w-full max-w-[1400px] px-6 pb-14 pt-6 lg:px-10">
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
  skew,
  isActive,
  isDimmed,
  onEnter,
}: {
  svc: (typeof services)[number];
  index: number;
  total: number;
  palette: Palette;
  skew: number;
  isActive: boolean;
  isDimmed: boolean;
  onEnter: () => void;
}) {
  const { ref, style: revealStyle } = useReveal({
    delay: index * 80,
    variant: "fade",
    threshold: 0.03,
  });

  const num    = String(index + 1).padStart(2, "0");
  const total2 = String(total).padStart(2, "0");
  const PY     = isActive ? PY_EXPANDED : PY_COLLAPSED;

  return (
    <div
      ref={ref}
      onMouseEnter={onEnter}
      style={{
        position: "relative",
        /* overflow:hidden clips the BG_BLEED so nothing pokes outside */
        overflow: "hidden",
        /*
         * Padding drives the visible strip height.
         * BG_BLEED is added on top so the skewed bg fills corners.
         * On hover, PY increases → strip grows → description space opens.
         */
        paddingTop:    `${BG_BLEED + PY}px`,
        paddingBottom: `${BG_BLEED + PY}px`,
        transition: [
          "padding 0.48s cubic-bezier(0.16,1,0.3,1)",
          "opacity 0.3s ease",
        ].join(", "),
        opacity:       isDimmed ? 0.3 : 1,
        cursor:        "default",
        zIndex:        isActive ? 10 : index + 1,
        ...revealStyle,
      }}
    >
      {/* ── Skewed background fill ─────────────────────────────────────
          Extends BG_BLEED px beyond the wrapper top & bottom so that at
          any skew angle the corners are always covered.
          Transitions skewY → 0 on hover (strip straightens).         ── */}
      <div
        aria-hidden
        style={{
          position:   "absolute",
          inset:      `${-BG_BLEED}px 0`,
          background: palette.bg,
          transform:  isActive ? "skewY(0deg)" : `skewY(${skew}deg)`,
          transformOrigin: "center center",
          transition: "transform 0.48s cubic-bezier(0.16,1,0.3,1)",
          zIndex:     0,
        }}
      />

      {/* ── Ghost watermark number ─────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position:     "absolute",
          right:        "-16px",
          top:          "50%",
          transform:    `translateY(-50%) rotate(${isActive ? 0 : skew * -1.8}deg)`,
          fontFamily:   "Inter, sans-serif",
          fontWeight:   900,
          fontSize:     "clamp(130px, 20vw, 280px)",
          lineHeight:   1,
          letterSpacing: "-0.07em",
          color:
            palette.bg === "#1C1C1C" || palette.bg === "#111111"
              ? "rgba(255,255,255,0.04)"
              : "rgba(0,0,0,0.05)",
          pointerEvents: "none",
          userSelect:    "none",
          zIndex:        1,
          transition:    "transform 0.48s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {num}
      </div>

      {/* ── Strip content ─────────────────────────────────────────── */}
      <div
        className="relative mx-auto flex w-full max-w-[1400px] items-center gap-5 px-6 lg:gap-8 lg:px-10"
        style={{ zIndex: 2 }}
      >
        {/* Index + SVC code */}
        <div style={{ flexShrink: 0, minWidth: "3ch" }}>
          <span
            style={{
              fontFamily:    "Inter, sans-serif",
              fontWeight:    900,
              fontSize:      "clamp(36px, 5.5vw, 80px)",
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

        {/* Slanted rule */}
        <div
          className="hidden sm:block"
          style={{
            width:      "2px",
            height:     "44px",
            background: palette.muted,
            flexShrink: 0,
            transform:  `skewX(${skew * -0.4}deg)`,
            opacity:    0.35,
            transition: "transform 0.48s cubic-bezier(0.16,1,0.3,1)",
          }}
        />

        {/* Title + revealed content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title — always visible */}
          <h3
            style={{
              fontFamily:    "Inter, sans-serif",
              fontWeight:    900,
              fontSize:      "clamp(22px, 4vw, 60px)",
              lineHeight:    0.92,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color:         palette.text,
              transition:    "font-size 0.3s ease",
            }}
          >
            {svc.title}
          </h3>

          {/* Description + tags — revealed on hover */}
          <div
            style={{
              maxHeight:  isActive ? "260px" : "0px",
              overflow:   "hidden",
              transition: "max-height 0.48s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <p
              style={{
                fontFamily:  "monospace",
                fontSize:    "clamp(12px, 1.1vw, 14px)",
                lineHeight:  1.7,
                color:       palette.text,
                opacity:     isActive ? 0.78 : 0,
                transform:   isActive ? "translateY(0)" : "translateY(10px)",
                transition:  "opacity 0.35s ease 0.18s, transform 0.35s ease 0.18s",
                marginTop:   "14px",
                maxWidth:    "62ch",
              }}
            >
              {svc.description}
            </p>

            {/* Deliverable tags */}
            <div
              style={{
                display:    "flex",
                flexWrap:   "wrap",
                gap:        "6px",
                marginTop:  "16px",
                opacity:    isActive ? 1 : 0,
                transform:  isActive ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 0.3s ease 0.28s, transform 0.3s ease 0.28s",
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
              width:      "28px",
              height:     "28px",
              opacity:    isActive ? 1 : 0.28,
              transform:  isActive
                ? "translate(3px, -3px) rotate(0deg)"
                : "translate(0,0) rotate(0deg)",
              transition: "opacity 0.35s ease, transform 0.38s cubic-bezier(0.16,1,0.3,1)",
            }}
            strokeWidth={2.2}
          />
        </div>
      </div>
    </div>
  );
}

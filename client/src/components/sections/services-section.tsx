import { useState } from "react";
import { Code2, Palette, Smartphone, Rocket, Globe, Zap, ArrowUpRight } from "lucide-react";
import { useReveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

const BG    = "#0A0A0A";
const INK   = "#F2EFE6";
const ACCENT = "#FF3D00";

/* ── Colour palettes per strip ─────────────────────────────────────────── */
const PALETTES = [
  { bg: "#FF3D00", text: "#0A0A0A", muted: "rgba(0,0,0,0.5)",  tagBg: "rgba(0,0,0,0.15)", tagText: "#0A0A0A" },
  { bg: "#F2EFE6", text: "#0A0A0A", muted: "rgba(0,0,0,0.45)", tagBg: "rgba(0,0,0,0.1)",  tagText: "#0A0A0A" },
  { bg: "#1C1C1C", text: "#F2EFE6", muted: "rgba(242,239,230,0.45)", tagBg: "rgba(242,239,230,0.1)", tagText: "#F2EFE6" },
  { bg: "#FF3D00", text: "#0A0A0A", muted: "rgba(0,0,0,0.5)",  tagBg: "rgba(0,0,0,0.15)", tagText: "#0A0A0A" },
  { bg: "#F2EFE6", text: "#0A0A0A", muted: "rgba(0,0,0,0.45)", tagBg: "rgba(0,0,0,0.1)",  tagText: "#0A0A0A" },
  { bg: "#111111", text: "#F2EFE6", muted: "rgba(242,239,230,0.45)", tagBg: "rgba(242,239,230,0.1)", tagText: "#F2EFE6" },
];

/* Alternating skew directions */
const SKEWS = [-3.2, 3.2, -3.2, 3.2, -3.2, 3.2];

const services = [
  {
    code: "WD",
    icon: Code2,
    title: "Web Development",
    description: "Custom web applications built with React, Next.js and Node.js — fully type-safe from database to UI, SSR/SSG ready, CI/CD deployed, and optimised for sub-second load times at any scale.",
    deliverables: ["SSR/SSG", "API Layer", "CI/CD", "Type-Safe DB"],
  },
  {
    code: "UX",
    icon: Palette,
    title: "UI/UX Design",
    description: "Pixel-perfect interfaces grounded in user research — from initial wireframes and interaction prototypes through to a complete design system with tokens, component specs, and developer hand-off.",
    deliverables: ["Design System", "Prototype", "Tokens", "Hand-off"],
  },
  {
    code: "MB",
    icon: Smartphone,
    title: "Mobile Development",
    description: "Native iOS & Android and cross-platform builds using React Native or Flutter. First-class UX, push notifications, offline support, and App Store / Play Store submission handled end-to-end.",
    deliverables: ["Native UI", "Push", "Offline", "App Store"],
  },
  {
    code: "3D",
    icon: Globe,
    title: "3D Web Experiences",
    description: "WebGL / Three.js product configurators, virtual showrooms, and interactive marketing scenes that run in the browser at 60fps — with custom GLTF pipelines, shaders, and physics-based animation.",
    deliverables: ["WebGL", "Three.js", "GLTF", "Animation"],
  },
  {
    code: "PF",
    icon: Zap,
    title: "Performance",
    description: "Deep audit, profiling, and systematic optimisation — code-splitting, lazy loading, image compression, edge caching, and real Core Web Vitals improvements that move Lighthouse scores into the 90s.",
    deliverables: ["Audit", "Bundle Cut", "Cache", "Core Web Vitals"],
  },
  {
    code: "CS",
    icon: Rocket,
    title: "Consulting & Strategy",
    description: "Architecture reviews, scalability planning, and technology roadmaps for digital transformation — including stack selection, team structuring, hiring guidance, and hands-on technical leadership.",
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
      {/* ── Header — contained ─────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-[1400px] px-6 pt-16 pb-10 lg:px-10 lg:pt-20">
        <SectionHeader
          num="04"
          name="SERVICES"
          kicker="// PRODUCTION SCOPE"
          headline="WHAT I BUILD FOR CLIENTS"
          right={`${String(services.length).padStart(2, "0")} OFFERINGS`}
          variant="split"
        />
      </div>

      {/* ── Full-bleed strip stack ──────────────────────────────────────── */}
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

      {/* ── Bottom strip — contained ────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-[1400px] px-6 pb-16 lg:px-10">
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
    delay: index * 75,
    variant: "fade",
    threshold: 0.03,
  });

  const num    = String(index + 1).padStart(2, "0");
  const total2 = String(total).padStart(2, "0");

  /*
   * Technique: the outer wrapper is NOT skewed — it stays in normal flow
   * so strips butt up against each other with zero gap.
   * Only the absolute background layer is skewed, and it bleeds beyond the
   * wrapper's top/bottom (inset: -BG_BLEED) so skew corners are hidden.
   * overflow:hidden on the wrapper clips the bleed.
   */
  const BG_BLEED = 48; /* px — must exceed (width * tan(|skew|)) / 2 */

  return (
    <div
      ref={ref}
      onMouseEnter={onEnter}
      style={{
        position: "relative",
        overflow: "hidden",
        /* Height is driven by content + padding; BG_BLEED is absorbed by overflow:hidden */
        transition: "opacity 0.3s ease",
        opacity: isDimmed ? 0.38 : 1,
        cursor: "default",
        ...revealStyle,
      }}
    >
      {/* ── Skewed background fill — no borders ────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: `${-BG_BLEED}px 0`,
          background: palette.bg,
          transform: `skewY(${skew}deg)`,
          transformOrigin: "center center",
          transition: "filter 0.35s ease",
          filter: isActive ? "brightness(1.06)" : "brightness(1)",
          zIndex: 0,
        }}
      />

      {/* ── Ghost watermark number ─────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: `translateY(-50%) rotate(${skew * -1.5}deg)`,
          fontFamily: "Inter, sans-serif",
          fontWeight: 900,
          fontSize: "clamp(120px, 18vw, 260px)",
          lineHeight: 1,
          letterSpacing: "-0.07em",
          color:
            palette.bg === "#1C1C1C" || palette.bg === "#111111"
              ? "rgba(255,255,255,0.035)"
              : "rgba(0,0,0,0.055)",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 1,
          transition: "color 0.35s ease",
        }}
      >
        {num}
      </div>

      {/* ── Content ────────────────────────────────────────────────── */}
      <div
        className="relative mx-auto flex w-full max-w-[1400px] items-start gap-6 px-6 py-10 lg:gap-10 lg:px-10 lg:py-12"
        style={{ zIndex: 2 }}
      >
        {/* Index */}
        <div style={{ flexShrink: 0 }}>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(44px, 6vw, 88px)",
              lineHeight: 1,
              letterSpacing: "-0.06em",
              color: palette.text,
              display: "block",
            }}
          >
            {num}
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: palette.muted,
              display: "block",
              marginTop: "6px",
            }}
          >
            SVC_{svc.code}
          </span>
        </div>

        {/* Vertical rule */}
        <div
          style={{
            width: "2px",
            alignSelf: "stretch",
            background: palette.muted,
            flexShrink: 0,
            opacity: 0.4,
            transform: `skewX(${skew * -0.5}deg)`,
          }}
        />

        {/* Title + description */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(26px, 4vw, 60px)",
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: palette.text,
              marginBottom: "16px",
            }}
          >
            {svc.title}
          </h3>

          {/* Description — always visible */}
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "clamp(12px, 1.1vw, 14px)",
              lineHeight: 1.65,
              color: palette.text,
              opacity: 0.72,
              maxWidth: "58ch",
            }}
          >
            {svc.description}
          </p>

          {/* Deliverable tags — always visible */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              marginTop: "20px",
            }}
          >
            {svc.deliverables.map((d) => (
              <span
                key={d}
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  background: palette.tagBg,
                  color: palette.tagText,
                  fontWeight: 600,
                }}
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Counter + arrow — right side */}
        <div
          className="hidden md:flex"
          style={{
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "space-between",
            alignSelf: "stretch",
            flexShrink: 0,
            gap: "12px",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: palette.muted,
            }}
          >
            {num} / {total2}
          </span>

          <ArrowUpRight
            style={{
              color: palette.text,
              opacity: isActive ? 1 : 0.3,
              transform: isActive ? "scale(1.3) rotate(-6deg)" : "scale(1) rotate(0deg)",
              transition: "transform 0.38s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease",
              width: "28px",
              height: "28px",
            }}
            strokeWidth={2}
          />
        </div>
      </div>
    </div>
  );
}

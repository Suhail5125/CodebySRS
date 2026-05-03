import { useState } from "react";
import { Code2, Palette, Smartphone, Rocket, Globe, Zap } from "lucide-react";
import { useReveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

const BG    = "#0A0A0A";
const INK   = "#F2EFE6";
const ACCENT = "#FF3D00";

/* ── Per-card colour schemes ───────────────────────────────────────────── */
const PALETTES = [
  { bg: "#FF3D00", text: "#0A0A0A", sub: "rgba(0,0,0,0.45)",  tag: "#0A0A0A", tagText: "#FF3D00" },
  { bg: "#F2EFE6", text: "#0A0A0A", sub: "rgba(0,0,0,0.4)",   tag: "#0A0A0A", tagText: "#F2EFE6" },
  { bg: "#1A1A1A", text: "#F2EFE6", sub: "rgba(255,255,255,0.4)", tag: "#F2EFE6", tagText: "#1A1A1A" },
  { bg: "#FF3D00", text: "#0A0A0A", sub: "rgba(0,0,0,0.45)",  tag: "#0A0A0A", tagText: "#FF3D00" },
  { bg: "#F2EFE6", text: "#0A0A0A", sub: "rgba(0,0,0,0.4)",   tag: "#0A0A0A", tagText: "#F2EFE6" },
  { bg: "#0F0F0F", text: "#F2EFE6", sub: "rgba(255,255,255,0.4)", tag: "#F2EFE6", tagText: "#0F0F0F" },
];

/* Skew direction alternates for the cascade feel */
const SKEW = [-3.5, 3, -2.8, 3.2, -2.5, 3.5];

const services = [
  {
    code: "WD",
    icon: Code2,
    title: "Web Development",
    description: "Custom web applications built with React, Next.js and Node.js. Responsive, fast-loading, scalable.",
    deliverables: ["SSR/SSG", "API Layer", "CI/CD", "Type-Safe DB"],
  },
  {
    code: "UX",
    icon: Palette,
    title: "UI/UX Design",
    description: "Pixel-perfect interfaces grounded in research, wireframes and prototypes that convert.",
    deliverables: ["Design System", "Prototype", "Tokens", "Hand-off"],
  },
  {
    code: "MB",
    icon: Smartphone,
    title: "Mobile Development",
    description: "Native iOS / Android and cross-platform builds (React Native, Flutter) with first-class UX.",
    deliverables: ["Native UI", "Push", "Offline", "App Store"],
  },
  {
    code: "3D",
    icon: Globe,
    title: "3D Web Experiences",
    description: "WebGL / Three.js product configurators, virtual showrooms and interactive marketing scenes.",
    deliverables: ["WebGL", "Three.js", "GLTF", "Animation"],
  },
  {
    code: "PF",
    icon: Zap,
    title: "Performance",
    description: "Audit, profile and optimise. Code-splitting, lazy loading, edge caching, real Lighthouse wins.",
    deliverables: ["Audit", "Bundle Cut", "Cache", "Core Web Vitals"],
  },
  {
    code: "CS",
    icon: Rocket,
    title: "Consulting & Strategy",
    description: "Architecture reviews, scalability planning, technology roadmaps for digital transformation.",
    deliverables: ["Audit", "Roadmap", "Stack Pick", "Hiring"],
  },
];

export function ServicesSection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section
      id="services"
      className="snap-screen relative flex min-h-screen flex-col justify-center"
      style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
    >
      {/* Header — padded */}
      <div className="px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
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

      {/* Slab stack — full bleed, no horizontal constraints */}
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
            skew={SKEW[i % SKEW.length]}
            isActive={active === i}
            isDimmed={active !== null && active !== i}
            onEnter={() => setActive(i)}
          />
        ))}
      </div>

      {/* Bottom strip — full bleed */}
      <div
        className="relative z-10 mt-8 flex flex-col items-start justify-between gap-4 px-6 py-5 font-mono text-[11px] uppercase tracking-[0.2em] md:flex-row md:items-center"
        style={{
          background: BG,
          borderTop: `2px solid ${INK}`,
          borderBottom: `2px solid ${INK}`,
        }}
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
  palette: (typeof PALETTES)[number];
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

  const num   = String(index + 1).padStart(2, "0");
  const total2 = String(total).padStart(2, "0");

  /* Each slab overlaps the one above by 28px so border edges are hidden */
  const OVERLAP = 28;
  /* First slab has no top overlap */
  const marginTop = index === 0 ? 0 : -OVERLAP;

  return (
    <div
      ref={ref}
      onMouseEnter={onEnter}
      style={{
        position: "relative",
        zIndex: isActive ? 20 : index + 1,
        marginTop,
        /* Skew the slab; on active, straighten it */
        transform: isActive
          ? "skewY(0deg) scaleY(1.04)"
          : `skewY(${skew}deg)`,
        transformOrigin: "left center",
        transition:
          "transform 0.45s cubic-bezier(0.16,1,0.3,1), " +
          "opacity 0.3s ease",
        opacity: isDimmed ? 0.35 : 1,
        cursor: "default",
        ...revealStyle,
      }}
    >
      {/* ── Solid colour fill — NO borders ───────────────────────────────── */}
      <div
        style={{
          background: palette.bg,
          /* Extra top/bottom padding compensates for the skew so content
             doesn't clip — the excess is hidden behind adjacent slabs */
          padding: `${OVERLAP + 20}px 32px ${OVERLAP + 20}px 28px`,
          display: "flex",
          alignItems: "center",
          gap: "28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ghost watermark number */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: "-12px",
            top: "50%",
            transform: `translateY(-50%) rotate(${skew * -2}deg)`,
            fontFamily: "Inter, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(100px, 14vw, 200px)",
            lineHeight: 1,
            letterSpacing: "-0.07em",
            color: isActive
              ? "rgba(0,0,0,0.07)"
              : palette.bg === "#1A1A1A" || palette.bg === "#0F0F0F"
                ? "rgba(255,255,255,0.04)"
                : "rgba(0,0,0,0.06)",
            pointerEvents: "none",
            userSelect: "none",
            transition: "color 0.4s ease",
          }}
        >
          {num}
        </span>

        {/* Index number */}
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(40px, 5.5vw, 80px)",
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

        {/* Vertical SVC code */}
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

        {/* Title + revealed description */}
        <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          <h3
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(24px, 4.2vw, 64px)",
              lineHeight: 0.9,
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

          {/* Revealed description */}
          <div
            style={{
              maxHeight: isActive ? "120px" : "0px",
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
                transition: "opacity 0.3s ease 0.15s, transform 0.3s ease 0.15s",
                marginTop: "10px",
                maxWidth: "52ch",
              }}
            >
              {svc.description}
            </p>
          </div>
        </div>

        {/* Deliverable tags — fade in on hover */}
        <div
          className="hidden lg:flex"
          style={{
            flexDirection: "column",
            gap: "5px",
            alignItems: "flex-end",
            flexShrink: 0,
            opacity: isActive ? 1 : 0,
            transform: isActive ? "translateX(0)" : "translateX(16px)",
            transition: "opacity 0.3s ease 0.12s, transform 0.3s ease 0.12s",
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
          style={{
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "6px",
            flexShrink: 0,
          }}
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
              transform: isActive
                ? "translate(4px, -3px) rotate(-42deg)"
                : "translate(0,0) rotate(0deg)",
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

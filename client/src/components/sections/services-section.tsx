import { useState } from "react";
import { Code2, Palette, Smartphone, Rocket, Globe, Zap } from "lucide-react";
import { useReveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

const BG = "#0A0A0A";
const INK = "#F2EFE6";
const ACCENT = "#FF3D00";

const services = [
  {
    code: "WD",
    icon: Code2,
    fullTitle: "Web Development",
    description:
      "Custom web applications built with React, Next.js and Node.js. Responsive, fast-loading, scalable.",
    deliverables: ["SSR/SSG", "API Layer", "CI/CD", "Type-Safe DB"],
  },
  {
    code: "UX",
    icon: Palette,
    fullTitle: "UI/UX Design",
    description:
      "Pixel-perfect interfaces grounded in research, wireframes and prototypes that convert.",
    deliverables: ["Design System", "Prototype", "Tokens", "Hand-off"],
  },
  {
    code: "MB",
    icon: Smartphone,
    fullTitle: "Mobile Development",
    description:
      "Native iOS / Android and cross-platform builds (React Native, Flutter) with first-class UX.",
    deliverables: ["Native UI", "Push", "Offline", "App Store"],
  },
  {
    code: "3D",
    icon: Globe,
    fullTitle: "3D Web Experiences",
    description:
      "WebGL / Three.js product configurators, virtual showrooms and interactive marketing scenes.",
    deliverables: ["WebGL", "Three.js", "GLTF", "Animation"],
  },
  {
    code: "PF",
    icon: Zap,
    fullTitle: "Performance",
    description:
      "Audit, profile and optimise. Code-splitting, lazy loading, edge caching, real Lighthouse wins.",
    deliverables: ["Audit", "Bundle Cut", "Cache", "Core Web Vitals"],
  },
  {
    code: "CS",
    icon: Rocket,
    fullTitle: "Consulting & Strategy",
    description:
      "Architecture reviews, scalability planning, technology roadmaps for digital transformation.",
    deliverables: ["Audit", "Roadmap", "Stack Pick", "Hiring"],
  },
];

/* Per-card skew and horizontal nudge — alternating creates diagonal cascade */
const CARD_CONFIG = [
  { skew: -2.8, nudge: "0px",   accent: false },
  { skew:  2.2, nudge: "48px",  accent: true  },
  { skew: -2.0, nudge: "16px",  accent: false },
  { skew:  3.0, nudge: "64px",  accent: true  },
  { skew: -1.5, nudge: "8px",   accent: false },
  { skew:  2.5, nudge: "40px",  accent: true  },
];

export function ServicesSection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section
      id="services"
      className="snap-screen relative flex min-h-screen flex-col justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-10"
      style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mb-10 lg:mb-14">
          <SectionHeader
            num="04"
            name="SERVICES"
            kicker="// PRODUCTION SCOPE"
            headline="WHAT I BUILD FOR CLIENTS"
            right={`${String(services.length).padStart(2, "0")} OFFERINGS`}
            variant="split"
          />
        </div>

        {/* Diagonal cascade */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0px",
          }}
          onMouseLeave={() => setActive(null)}
        >
          {services.map((svc, i) => {
            const cfg = CARD_CONFIG[i % CARD_CONFIG.length];
            const isActive = active === i;
            const isDimmed = active !== null && !isActive;
            return (
              <ServiceCard
                key={svc.code}
                svc={svc}
                index={i}
                total={services.length}
                cfg={cfg}
                isActive={isActive}
                isDimmed={isDimmed}
                onHover={() => setActive(i)}
              />
            );
          })}
        </div>

        {/* Bottom strip */}
        <div
          className="mt-10 flex flex-col items-start justify-between gap-4 px-5 py-5 font-mono text-[11px] uppercase tracking-[0.2em] md:flex-row md:items-center"
          style={{ border: `2px solid ${INK}` }}
        >
          <div className="flex items-center gap-3">
            <span style={{ color: ACCENT }}>●</span>
            <span>QUEUE OPEN — Q3 / Q4 2026</span>
          </div>
          <div className="flex items-center gap-3 opacity-70">
            <span>RETAINER + PROJECT</span>
            <span>•</span>
            <span>EU / NA TIMEZONES</span>
          </div>
        </div>
      </div>
    </section>
  );
}

type CardConfig = { skew: number; nudge: string; accent: boolean };

function ServiceCard({
  svc,
  index,
  total,
  cfg,
  isActive,
  isDimmed,
  onHover,
}: {
  svc: (typeof services)[number];
  index: number;
  total: number;
  cfg: CardConfig;
  isActive: boolean;
  isDimmed: boolean;
  onHover: () => void;
}) {
  const { ref, style: revealStyle } = useReveal({
    delay: index * 90,
    variant: "fade",
    threshold: 0.04,
  });

  const num = String(index + 1).padStart(2, "0");

  /* On active: un-skew and pull the card forward */
  const skewTransform = isActive
    ? "skewY(0deg) scaleX(1.012)"
    : `skewY(${cfg.skew}deg)`;

  /* Background: accent fills on active, otherwise use accent vs dark alternation */
  const bg = isActive
    ? ACCENT
    : cfg.accent
    ? "rgba(255,61,0,0.06)"
    : "transparent";

  const borderColor = isActive ? ACCENT : INK;
  const textColor = isActive ? BG : INK;

  return (
    <div
      ref={ref}
      onMouseEnter={onHover}
      style={{
        marginLeft: cfg.nudge,
        transform: skewTransform,
        transformOrigin: "left center",
        transition:
          "transform 0.42s cubic-bezier(0.16,1,0.3,1), " +
          "opacity 0.3s ease, " +
          "margin 0.42s cubic-bezier(0.16,1,0.3,1)",
        opacity: isDimmed ? 0.22 : 1,
        zIndex: isActive ? 5 : 1,
        position: "relative",
        marginBottom: "-1px",
        ...revealStyle,
      }}
    >
      <div
        style={{
          background: bg,
          border: `2px solid ${borderColor}`,
          transition: "background 0.35s ease, border-color 0.35s ease",
          padding: "18px 28px",
          display: "flex",
          alignItems: "center",
          gap: "24px",
          overflow: "hidden",
          position: "relative",
          cursor: "default",
        }}
      >
        {/* Ghost number watermark */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: "-8px",
            top: "50%",
            transform: `translateY(-50%) rotate(${cfg.skew * -3}deg)`,
            fontFamily: "Inter, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(72px, 11vw, 160px)",
            lineHeight: 1,
            letterSpacing: "-0.06em",
            color: isActive
              ? "rgba(10,10,10,0.1)"
              : "rgba(242,239,230,0.035)",
            pointerEvents: "none",
            userSelect: "none",
            transition: "color 0.35s ease",
          }}
        >
          {num}
        </span>

        {/* Index */}
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(32px, 4.5vw, 68px)",
            lineHeight: 1,
            letterSpacing: "-0.055em",
            color: isActive ? BG : ACCENT,
            flexShrink: 0,
            minWidth: "2ch",
            transition: "color 0.35s ease",
          }}
        >
          {num}
        </span>

        {/* Slanted rule */}
        <div
          style={{
            width: "2px",
            height: "44px",
            background: isActive ? "rgba(10,10,10,0.4)" : `rgba(242,239,230,0.35)`,
            transform: "rotate(16deg)",
            flexShrink: 0,
            transition: "background 0.35s ease",
            display: "none",
          }}
          className="sm:!block"
        />

        {/* SVC code — vertical on desktop */}
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "9px",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: isActive ? "rgba(10,10,10,0.55)" : ACCENT,
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            flexShrink: 0,
            lineHeight: 1,
            transition: "color 0.35s ease",
          }}
          className="hidden sm:block"
        >
          SVC_{svc.code}
        </div>

        {/* Title + revealed description */}
        <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          <h3
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(22px, 3.8vw, 58px)",
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: textColor,
              transition: "color 0.35s ease",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {svc.fullTitle}
          </h3>

          <div
            style={{
              maxHeight: isActive ? "100px" : "0px",
              overflow: "hidden",
              transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "12px",
                lineHeight: 1.55,
                color: BG,
                opacity: isActive ? 0.82 : 0,
                transform: isActive ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 0.28s ease 0.12s, transform 0.28s ease 0.12s",
                marginTop: "8px",
                maxWidth: "54ch",
              }}
            >
              {svc.description}
            </p>
          </div>
        </div>

        {/* Deliverable tags — slide in from right */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            alignItems: "flex-end",
            flexShrink: 0,
            opacity: isActive ? 1 : 0,
            transform: isActive ? "translateX(0)" : "translateX(20px)",
            transition: "opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s",
            pointerEvents: isActive ? "auto" : "none",
          }}
          className="hidden lg:flex"
        >
          {svc.deliverables.map((d) => (
            <span
              key={d}
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "2px 8px",
                border: `1.5px solid ${BG}`,
                color: BG,
                whiteSpace: "nowrap",
              }}
            >
              {d}
            </span>
          ))}
        </div>

        {/* Arrow */}
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "20px",
            color: textColor,
            flexShrink: 0,
            opacity: isActive ? 1 : 0.28,
            transform: isActive
              ? "translateX(4px) rotate(-42deg)"
              : "translateX(0) rotate(0deg)",
            transition:
              "transform 0.38s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease, color 0.35s ease",
          }}
        >
          →
        </span>
      </div>
    </div>
  );
}

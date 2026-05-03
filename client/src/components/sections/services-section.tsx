import { useState, useRef } from "react";
import { Code2, Palette, Smartphone, Rocket, Globe, Zap, ChevronDown } from "lucide-react";
import { Reveal, useReveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

const BG = "#0A0A0A";
const INK = "#F2EFE6";
const ACCENT = "#FF3D00";

const services = [
  {
    code: "WD",
    icon: Code2,
    title: "Web Development",
    description:
      "Custom web applications built with React, Next.js and Node.js. Responsive, fast-loading, scalable.",
    deliverables: ["SSR/SSG", "API Layer", "CI/CD", "Type-Safe DB"],
  },
  {
    code: "UX",
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Pixel-perfect interfaces grounded in research, wireframes and prototypes that convert.",
    deliverables: ["Design System", "Prototype", "Tokens", "Hand-off"],
  },
  {
    code: "MB",
    icon: Smartphone,
    title: "Mobile Development",
    description:
      "Native iOS / Android and cross-platform builds (React Native, Flutter) with first-class UX.",
    deliverables: ["Native UI", "Push", "Offline", "App Store"],
  },
  {
    code: "3D",
    icon: Globe,
    title: "3D Web Experiences",
    description:
      "WebGL / Three.js product configurators, virtual showrooms and interactive marketing scenes.",
    deliverables: ["WebGL", "Three.js", "GLTF", "Animation"],
  },
  {
    code: "PF",
    icon: Zap,
    title: "Performance",
    description:
      "Audit, profile and optimise. Code-splitting, lazy loading, edge caching, real Lighthouse wins.",
    deliverables: ["Audit", "Bundle Cut", "Cache", "Core Web Vitals"],
  },
  {
    code: "CS",
    icon: Rocket,
    title: "Consulting & Strategy",
    description:
      "Architecture reviews, scalability planning, technology roadmaps for digital transformation.",
    deliverables: ["Audit", "Roadmap", "Stack Pick", "Hiring"],
  },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      className="snap-screen relative flex min-h-screen flex-col justify-center px-6 py-20 lg:px-10"
      style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <Reveal>
          <SectionHeader
            num="04"
            name="SERVICES"
            kicker="// PRODUCTION SCOPE"
            headline="WHAT I BUILD FOR CLIENTS"
            right={`${String(services.length).padStart(2, "0")} OFFERINGS`}
            variant="split"
          />
        </Reveal>

        {/* Bands container */}
        <div
          className="mt-10"
          style={{
            border: `2px solid ${INK}`,
            borderBottom: "none",
          }}
        >
          {services.map((s, i) => (
            <ServiceBand key={s.title} svc={s} index={i} total={services.length} />
          ))}
        </div>

        {/* Bottom strip */}
        <div
          className="flex flex-col items-start justify-between gap-4 px-5 py-5 font-mono text-[11px] uppercase tracking-[0.2em] md:flex-row md:items-center"
          style={{ border: `2px solid ${INK}`, borderTop: "none" }}
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

function ServiceBand({
  svc,
  index,
  total,
}: {
  svc: (typeof services)[number];
  index: number;
  total: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const isTouchDevice = useRef(
    typeof window !== "undefined" && window.matchMedia("(hover: none)").matches
  );
  const { ref, style: revealStyle } = useReveal({ delay: index * 80, variant: "clip" });
  const num = String(index + 1).padStart(2, "0");
  const totalStr = String(total).padStart(2, "0");

  function handleMouseEnter() {
    if (!isTouchDevice.current) setExpanded(true);
  }
  function handleMouseLeave() {
    if (!isTouchDevice.current) setExpanded(false);
  }
  function handleClick() {
    if (isTouchDevice.current) setExpanded((v) => !v);
  }

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        background: expanded ? INK : "transparent",
        color: expanded ? BG : INK,
        borderBottom: `2px solid ${INK}`,
        cursor: "default",
        transition: "background 0.3s ease-out, color 0.3s ease-out",
        ...revealStyle,
      }}
    >
      {/* Collapsed row — always visible */}
      <div
        className="flex w-full items-center gap-4 px-5 py-5 md:gap-6 md:px-8"
        style={{ cursor: isTouchDevice.current ? "pointer" : "default" }}
      >
        {/* Index number */}
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 56px)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: expanded ? ACCENT : ACCENT,
            minWidth: "2ch",
            flexShrink: 0,
          }}
        >
          {num}
        </span>

        {/* SVC code */}
        <span
          className="hidden font-mono text-[11px] uppercase tracking-[0.22em] sm:block"
          style={{
            color: expanded ? BG : ACCENT,
            opacity: expanded ? 0.75 : 1,
            flexShrink: 0,
            minWidth: "6ch",
            transition: "color 0.3s ease-out, opacity 0.3s ease-out",
          }}
        >
          SVC_{svc.code}
        </span>

        {/* Title */}
        <h3
          className="flex-1 leading-none"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(18px, 3.5vw, 48px)",
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          {svc.title}
        </h3>

        {/* Counter — desktop only */}
        <span
          className="hidden font-mono text-[11px] uppercase tracking-[0.2em] opacity-50 lg:block"
          style={{ flexShrink: 0 }}
        >
          {num} / {totalStr}
        </span>

        {/* Arrow indicator */}
        <ChevronDown
          className="h-5 w-5 flex-shrink-0 transition-transform duration-300 ease-out"
          style={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            opacity: expanded ? 0.8 : 0.6,
          }}
          strokeWidth={2.5}
        />
      </div>

      {/* Expanded panel — description + tags */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: expanded ? "300px" : "0px",
          transition: "max-height 0.32s ease-out",
        }}
      >
        <div
          className="flex flex-col gap-4 px-5 pb-6 md:flex-row md:items-start md:gap-10 md:px-8"
          style={{
            paddingLeft: "calc(2ch + 1rem + 1.5rem)",
          }}
        >
          {/* Mobile: start from left edge with same indent as title */}
          <div className="flex-1">
            <p
              className="text-[13px] leading-snug md:text-[14px]"
              style={{ opacity: 0.8, maxWidth: "56ch" }}
            >
              {svc.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 md:justify-end">
            {svc.deliverables.map((d) => (
              <span
                key={d}
                className="font-mono text-[10px] uppercase tracking-[0.16em]"
                style={{
                  padding: "3px 8px",
                  border: `1.5px solid ${expanded ? BG : INK}`,
                  transition: "border-color 0.3s ease-out",
                  flexShrink: 0,
                }}
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

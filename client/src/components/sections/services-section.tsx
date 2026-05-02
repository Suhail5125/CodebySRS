import { useState } from "react";
import { Code2, Palette, Smartphone, Rocket, Globe, Zap, ArrowUpRight } from "lucide-react";
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

        <Reveal delay={160}>
        {/* Grid */}
        <div
          className="mt-10 grid grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-3"
          style={{ border: `2px solid ${INK}` }}
        >
          {services.map((s, i) => (
            <ServiceCell key={s.title} svc={s} index={i} total={services.length} />
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
        </Reveal>
      </div>
    </section>
  );
}

function ServiceCell({
  svc,
  index,
  total,
}: {
  svc: (typeof services)[number];
  index: number;
  total: number;
}) {
  const [hover, setHover] = useState(false);
  const { ref, style: revealStyle } = useReveal({ delay: index * 90, variant: "clip" });
  const Icon = svc.icon;
  const isLastRow = index >= total - (total % 3 === 0 ? 3 : total % 3);
  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative flex flex-col p-6"
      style={{
        background: hover ? INK : "transparent",
        color: hover ? BG : INK,
        borderRight: (index + 1) % 3 !== 0 ? `2px solid ${INK}` : "none",
        borderBottom: !isLastRow ? `2px solid ${INK}` : "none",
        transition: "none",
        minHeight: 280,
        ...revealStyle,
      }}
    >
      <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
        <span style={{ color: ACCENT }}>SVC_{svc.code}</span>
        <span style={{ opacity: hover ? 0.7 : 0.55 }}>{num} / {String(total).padStart(2, "0")}</span>
      </div>

      <Icon className="mb-4 h-8 w-8" strokeWidth={2.5} />

      <h3
        className="mb-3"
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 800,
          fontSize: "26px",
          lineHeight: 1,
          letterSpacing: "-0.025em",
          textTransform: "uppercase",
        }}
      >
        {svc.title}
      </h3>

      <p className="mb-5 text-[13px] leading-snug" style={{ opacity: 0.85 }}>
        {svc.description}
      </p>

      <div className="mt-auto flex flex-wrap gap-1.5">
        {svc.deliverables.map((d) => (
          <span
            key={d}
            className="font-mono text-[10px] uppercase tracking-[0.16em]"
            style={{
              padding: "3px 7px",
              border: `1.5px solid ${hover ? BG : INK}`,
              transition: "none",
            }}
          >
            {d}
          </span>
        ))}
      </div>

      <div
        className="mt-5 flex items-center justify-between pt-3 font-mono text-[11px] uppercase tracking-[0.22em]"
        style={{ borderTop: `2px solid ${hover ? BG : INK}` }}
      >
        <span className="font-bold">SCOPE_BRIEF</span>
        <ArrowUpRight className="h-4 w-4" />
      </div>
    </div>
  );
}


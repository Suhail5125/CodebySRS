import { useState } from "react";
import { Lightbulb, FileSearch, Palette, Code, TestTube, Rocket } from "lucide-react";
import { Reveal } from "@/components/reveal";

const BG = "#0A0A0A";
const INK = "#F2EFE6";
const ACCENT = "#FF3D00";

type Step = {
  num: string;
  icon: typeof Lightbulb;
  title: string;
  description: string;
  duration: string;
  activities: string[];
  deliverables: string[];
};

const STEPS: Step[] = [
  {
    num: "01",
    icon: Lightbulb,
    title: "Discovery & Planning",
    description:
      "We map the goal, audience, constraints and success metrics into a concrete brief.",
    duration: "1–2 WK",
    activities: ["Stakeholder interviews", "Market research", "Competitor benchmark", "Requirements"],
    deliverables: ["Project brief", "Personas", "Market analysis", "Requirements doc"],
  },
  {
    num: "02",
    icon: FileSearch,
    title: "Research & Analysis",
    description:
      "Technical feasibility, resource planning, risk assessment and a fixed timeline.",
    duration: "1 WK",
    activities: ["Feasibility study", "Resource plan", "Timeline", "Risk register"],
    deliverables: ["Roadmap", "Tech specs", "Resource plan", "Timeline"],
  },
  {
    num: "03",
    icon: Palette,
    title: "Design & Prototype",
    description:
      "Interactive prototypes and a tokenised design system before a single line of production code.",
    duration: "2–3 WK",
    activities: ["Wireframes", "UX flows", "Prototype", "Design system"],
    deliverables: ["Design system", "Prototype", "UI screens", "Style guide"],
  },
  {
    num: "04",
    icon: Code,
    title: "Development",
    description:
      "Build with type-safe stacks, atomic commits and trunk-based delivery into staging daily.",
    duration: "4–6 WK",
    activities: ["Frontend", "Backend", "DB schema", "API layer"],
    deliverables: ["Source code", "Docs", "API endpoints", "DB schema"],
  },
  {
    num: "05",
    icon: TestTube,
    title: "Testing & QA",
    description:
      "Unit, integration, cross-browser and performance audits — plus a security pass.",
    duration: "1–2 WK",
    activities: ["Unit + e2e", "Cross-browser", "Performance", "Security audit"],
    deliverables: ["Test reports", "Bug fixes", "Perf metrics", "Security audit"],
  },
  {
    num: "06",
    icon: Rocket,
    title: "Launch & Support",
    description:
      "Deploy, monitor, train and stay on call. Smooth runway after go-live.",
    duration: "1 WK",
    activities: ["Production deploy", "Monitoring", "Training", "Support window"],
    deliverables: ["Live site", "Deploy guide", "Training", "Support plan"],
  },
];

export function WorkProcessSection() {
  const [active, setActive] = useState("01");
  const current = STEPS.find((s) => s.num === active) ?? STEPS[0];

  return (
    <section
      id="process"
      className="snap-screen relative flex min-h-screen flex-col justify-center px-6 py-20 lg:px-10"
      style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <Reveal>
          <SectionHeader
            num="05"
            name="PROCESS"
            kicker="// DELIVERY PIPELINE"
            headline="HOW THE WORK GETS SHIPPED"
            right="06 PHASES · ~12 WEEKS"
          />
        </Reveal>

        {/* Phase rail */}
        <div
          className="mt-10 grid grid-cols-2 gap-0 md:grid-cols-3 lg:grid-cols-6"
          style={{ border: `2px solid ${INK}` }}
        >
          {STEPS.map((s, i) => {
            const isActive = s.num === active;
            return (
              <button
                key={s.num}
                onClick={() => setActive(s.num)}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = ACCENT;
                    e.currentTarget.style.color = BG;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = INK;
                  }
                }}
                className="flex flex-col items-start px-4 py-4 text-left"
                style={{
                  background: isActive ? INK : "transparent",
                  color: isActive ? BG : INK,
                  borderRight: i < STEPS.length - 1 ? `2px solid ${INK}` : "none",
                  transition: "none",
                }}
              >
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.22em]"
                  style={{ color: isActive ? BG : ACCENT }}
                >
                  PHASE {s.num}
                </span>
                <span
                  className="mt-1.5"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 800,
                    fontSize: "13px",
                    lineHeight: 1.1,
                    textTransform: "uppercase",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.title}
                </span>
                <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] opacity-70">
                  {s.duration}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detail pane */}
        <div
          className="grid grid-cols-1 gap-0 lg:grid-cols-12"
          style={{ border: `2px solid ${INK}`, borderTop: "none" }}
        >
          {/* Left: huge number */}
          <div
            className="flex items-center justify-center px-6 py-10 lg:col-span-3"
            style={{ borderRight: `2px solid ${INK}`, background: ACCENT, color: BG }}
          >
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(120px, 14vw, 220px)",
                lineHeight: 0.85,
                letterSpacing: "-0.05em",
              }}
            >
              {current.num}
            </div>
          </div>

          {/* Middle: copy */}
          <div className="px-6 py-8 lg:col-span-5" style={{ borderRight: `2px solid ${INK}` }}>
            <div className="mb-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em]">
              <current.icon className="h-4 w-4" />
              <span style={{ color: ACCENT }}>PHASE_{current.num}</span>
              <span className="opacity-60">DURATION {current.duration}</span>
            </div>
            <h3
              className="mb-4"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(28px, 4vw, 48px)",
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
                textTransform: "uppercase",
              }}
            >
              {current.title}
            </h3>
            <p className="text-[14px] leading-relaxed" style={{ opacity: 0.85 }}>
              {current.description}
            </p>
          </div>

          {/* Right: lists */}
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:col-span-4">
            <ListBlock title="ACTIVITIES" items={current.activities} borderRight />
            <ListBlock title="DELIVERABLES" items={current.deliverables} />
          </div>
        </div>

        {/* Bottom counter */}
        <div
          className="grid grid-cols-3 gap-0 font-mono text-[11px] uppercase tracking-[0.2em]"
          style={{ border: `2px solid ${INK}`, borderTop: "none" }}
        >
          <Counter k="PHASE" v={`${current.num} / 06`} />
          <Counter k="MODE" v="ASYNC + SPRINTS" border />
          <Counter k="STATUS" v="READY" />
        </div>
      </div>
    </section>
  );
}

function ListBlock({
  title,
  items,
  borderRight,
}: {
  title: string;
  items: string[];
  borderRight?: boolean;
}) {
  return (
    <div
      className="px-5 py-6"
      style={{ borderRight: borderRight ? `2px solid ${INK}` : "none" }}
    >
      <div
        className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em]"
        style={{ color: ACCENT }}
      >
        {title}
      </div>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li
            key={i}
            className="flex items-baseline gap-2 font-mono text-[12px] uppercase tracking-[0.08em]"
          >
            <span style={{ color: ACCENT }}>›</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Counter({ k, v, border }: { k: string; v: string; border?: boolean }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3"
      style={{
        borderLeft: border ? `2px solid ${INK}` : "none",
        borderRight: border ? `2px solid ${INK}` : "none",
      }}
    >
      <span className="opacity-60">{k}</span>
      <span style={{ color: ACCENT }}>{v}</span>
    </div>
  );
}

function SectionHeader({
  num,
  name,
  kicker,
  headline,
  right,
}: {
  num: string;
  name: string;
  kicker: string;
  headline: string;
  right?: string;
}) {
  return (
    <header className="grid grid-cols-12 gap-x-6">
      <aside className="col-span-12 mb-6 lg:col-span-2 lg:mb-0">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
          [ SECTION {num} ]
        </div>
        <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] opacity-70">
          / {name}
        </div>
        <div className="mt-3 h-[2px] w-12" style={{ background: ACCENT }} />
      </aside>
      <div className="col-span-12 lg:col-span-10">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
            {kicker}
          </span>
          {right && (
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-70">
              {right}
            </span>
          )}
        </div>
        <h2
          className="mt-2"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(40px, 7vw, 96px)",
            lineHeight: 0.92,
            letterSpacing: "-0.035em",
            textTransform: "uppercase",
          }}
        >
          {headline}
        </h2>
      </div>
    </header>
  );
}

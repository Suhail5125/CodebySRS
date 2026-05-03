import { useState, useRef, useEffect, useCallback } from "react";
import { Lightbulb, FileSearch, Palette, Code, TestTube, Rocket } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

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
    description: "We map the goal, audience, constraints and success metrics into a concrete brief.",
    duration: "1–2 WK",
    activities: ["Stakeholder interviews", "Market research", "Competitor benchmark", "Requirements"],
    deliverables: ["Project brief", "Personas", "Market analysis", "Requirements doc"],
  },
  {
    num: "02",
    icon: FileSearch,
    title: "Research & Analysis",
    description: "Technical feasibility, resource planning, risk assessment and a fixed timeline.",
    duration: "1 WK",
    activities: ["Feasibility study", "Resource plan", "Timeline", "Risk register"],
    deliverables: ["Roadmap", "Tech specs", "Resource plan", "Timeline"],
  },
  {
    num: "03",
    icon: Palette,
    title: "Design & Prototype",
    description: "Interactive prototypes and a tokenised design system before a single line of production code.",
    duration: "2–3 WK",
    activities: ["Wireframes", "UX flows", "Prototype", "Design system"],
    deliverables: ["Design system", "Prototype", "UI screens", "Style guide"],
  },
  {
    num: "04",
    icon: Code,
    title: "Development",
    description: "Build with type-safe stacks, atomic commits and trunk-based delivery into staging daily.",
    duration: "4–6 WK",
    activities: ["Frontend", "Backend", "DB schema", "API layer"],
    deliverables: ["Source code", "Docs", "API endpoints", "DB schema"],
  },
  {
    num: "05",
    icon: TestTube,
    title: "Testing & QA",
    description: "Unit, integration, cross-browser and performance audits — plus a security pass.",
    duration: "1–2 WK",
    activities: ["Unit + e2e", "Cross-browser", "Performance", "Security audit"],
    deliverables: ["Test reports", "Bug fixes", "Perf metrics", "Security audit"],
  },
  {
    num: "06",
    icon: Rocket,
    title: "Launch & Support",
    description: "Deploy, monitor, train and stay on call. Smooth runway after go-live.",
    duration: "1 WK",
    activities: ["Production deploy", "Monitoring", "Training", "Support window"],
    deliverables: ["Live site", "Deploy guide", "Training", "Support plan"],
  },
];

/* ─── animation sequencing ─────────────────────────────────────────────────
   Each diagram element gets a sequential index. Delay = index * STEP_MS.
   Connectors draw first (~200ms), then their target node fades in.
   ───────────────────────────────────────────────────────────────────────── */
const STEP_MS = 140;

function elDelay(idx: number) {
  return idx * STEP_MS;
}

/* ─── Animated SVG connector ────────────────────────────────────────────── */
function Connector({
  triggered,
  seqIdx,
  height = 48,
}: {
  triggered: boolean;
  seqIdx: number;
  height?: number;
}) {
  const pathLen = height;
  const delay = elDelay(seqIdx);

  return (
    <div className="flex justify-center" style={{ height }}>
      <svg width="24" height={height} overflow="visible">
        <defs>
          <marker
            id={`arrow-${seqIdx}`}
            markerWidth="8"
            markerHeight="8"
            refX="4"
            refY="4"
            orient="auto"
          >
            <polygon points="0 0, 8 4, 0 8" fill={INK} opacity="0.9" />
          </marker>
        </defs>
        <line
          x1="12"
          y1="0"
          x2="12"
          y2={height}
          stroke={INK}
          strokeWidth="2"
          strokeDasharray={pathLen}
          strokeDashoffset={triggered ? 0 : pathLen}
          markerEnd={`url(#arrow-${seqIdx})`}
          style={{
            transition: triggered
              ? `stroke-dashoffset 0.35s cubic-bezier(0.85,0,0.15,1) ${delay}ms`
              : "none",
          }}
          opacity="0.75"
        />
      </svg>
    </div>
  );
}

/* ─── Phase node ────────────────────────────────────────────────────────── */
function PhaseNode({
  step,
  triggered,
  seqIdx,
  onHover,
}: {
  step: Step;
  triggered: boolean;
  seqIdx: number;
  onHover: (num: string | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const delay = elDelay(seqIdx);
  const Icon = step.icon;

  return (
    <div
      className="flex justify-center"
      style={{
        opacity: triggered ? 1 : 0,
        transform: triggered ? "translateY(0)" : "translateY(12px)",
        transition: triggered
          ? `opacity 0.45s ease ${delay}ms, transform 0.45s cubic-bezier(0.85,0,0.15,1) ${delay}ms`
          : "none",
      }}
    >
      <div
        className="w-full cursor-pointer"
        style={{
          maxWidth: 520,
          border: `2px solid ${INK}`,
          background: expanded ? INK : BG,
          color: expanded ? BG : INK,
          transition: "background 0.2s ease, color 0.2s ease",
        }}
        onMouseEnter={() => {
          setExpanded(true);
          onHover(step.num);
        }}
        onMouseLeave={() => {
          setExpanded(false);
          onHover(null);
        }}
      >
        {/* Node header */}
        <div
          className="flex items-center gap-4 px-5 py-4"
          style={{ borderBottom: expanded ? `2px solid ${expanded ? BG : INK}` : "none" }}
        >
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center"
            style={{
              background: ACCENT,
              color: BG,
            }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-3">
              <span
                className="font-mono text-[11px] uppercase tracking-[0.22em]"
                style={{ color: expanded ? BG : ACCENT }}
              >
                PHASE {step.num}
              </span>
              <span
                className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60"
              >
                {step.duration}
              </span>
            </div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(14px, 2vw, 18px)",
                lineHeight: 1.1,
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
              }}
            >
              {step.title}
            </div>
          </div>
          <div
            className="font-mono text-[10px] uppercase tracking-[0.15em] opacity-50 flex-shrink-0"
          >
            {expanded ? "▲ COLLAPSE" : "▼ EXPAND"}
          </div>
        </div>

        {/* Expandable body */}
        <div
          style={{
            maxHeight: expanded ? "400px" : "0px",
            overflow: "hidden",
            transition: "max-height 0.4s cubic-bezier(0.85,0,0.15,1)",
          }}
        >
          <div className="px-5 py-4">
            <p
              className="mb-4 text-[13px] leading-relaxed"
              style={{ opacity: 0.85 }}
            >
              {step.description}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div
                  className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: ACCENT }}
                >
                  ACTIVITIES
                </div>
                <ul className="space-y-1">
                  {step.activities.map((a, i) => (
                    <li
                      key={i}
                      className="flex items-baseline gap-2 font-mono text-[11px] uppercase tracking-[0.08em]"
                    >
                      <span style={{ color: ACCENT }}>›</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div
                  className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: ACCENT }}
                >
                  DELIVERABLES
                </div>
                <ul className="space-y-1">
                  {step.deliverables.map((d, i) => (
                    <li
                      key={i}
                      className="flex items-baseline gap-2 font-mono text-[11px] uppercase tracking-[0.08em]"
                    >
                      <span style={{ color: ACCENT }}>›</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Decision diamond ──────────────────────────────────────────────────── */
function DecisionDiamond({
  label,
  triggered,
  seqIdx,
}: {
  label: string;
  triggered: boolean;
  seqIdx: number;
}) {
  const delay = elDelay(seqIdx);

  return (
    <div
      className="flex justify-center"
      style={{
        opacity: triggered ? 1 : 0,
        transition: triggered ? `opacity 0.4s ease ${delay}ms` : "none",
      }}
    >
      <div className="relative flex items-center justify-center" style={{ width: 180, height: 90 }}>
        {/* Diamond shape */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            width: 120,
            height: 120,
            transform: "rotate(45deg) scale(0.6)",
            border: `2px solid ${ACCENT}`,
            background: BG,
            animation: triggered
              ? `diamond-pulse 2.5s ${delay + 600}ms ease-in-out infinite`
              : "none",
          }}
        />
        {/* Label (not rotated) */}
        <div
          className="relative z-10 text-center font-mono uppercase"
          style={{
            fontSize: "9px",
            letterSpacing: "0.16em",
            color: ACCENT,
            lineHeight: 1.3,
            maxWidth: 100,
          }}
        >
          {label}
        </div>
        {/* YES label */}
        <div
          className="absolute font-mono uppercase"
          style={{
            fontSize: "8px",
            letterSpacing: "0.18em",
            color: INK,
            opacity: 0.5,
            bottom: -2,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          YES ↓
        </div>
        {/* NO branch (decorative loop) */}
        <svg
          className="absolute"
          style={{ right: -48, top: "50%", transform: "translateY(-50%)" }}
          width="48"
          height="60"
          overflow="visible"
        >
          <path
            d={`M 0 30 L 20 30 L 20 0 L -10 0`}
            fill="none"
            stroke={INK}
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.35"
          />
          <text
            x="22"
            y="34"
            fontFamily="monospace"
            fontSize="8"
            fill={INK}
            opacity="0.4"
            letterSpacing="2"
          >
            NO
          </text>
        </svg>
      </div>
    </div>
  );
}

/* ─── Fork / Join bar ───────────────────────────────────────────────────── */
function ForkBar({
  triggered,
  seqIdx,
}: {
  triggered: boolean;
  seqIdx: number;
}) {
  const delay = elDelay(seqIdx);

  return (
    <div
      className="flex justify-center"
      style={{
        opacity: triggered ? 1 : 0,
        transition: triggered ? `opacity 0.35s ease ${delay}ms` : "none",
      }}
    >
      <div style={{ width: "100%", maxWidth: 520 }}>
        {/* Fork bar */}
        <div
          style={{
            height: 4,
            background: INK,
            width: "100%",
            opacity: 0.85,
          }}
        />
        {/* Two parallel tracks */}
        <div className="flex" style={{ height: 52 }}>
          {/* Left track — FRONTEND */}
          <div
            className="flex flex-1 flex-col items-center"
            style={{ borderRight: `1px solid ${INK}`, opacity: 0.6 }}
          >
            <div style={{ width: 2, flex: 1, background: INK, opacity: 0.7 }} />
            <div
              className="font-mono uppercase"
              style={{ fontSize: "8px", letterSpacing: "0.2em", color: ACCENT, marginBottom: 4 }}
            >
              FRONTEND
            </div>
          </div>
          {/* Right track — BACKEND */}
          <div
            className="flex flex-1 flex-col items-center"
            style={{ opacity: 0.6 }}
          >
            <div style={{ width: 2, flex: 1, background: INK, opacity: 0.7 }} />
            <div
              className="font-mono uppercase"
              style={{ fontSize: "8px", letterSpacing: "0.2em", color: ACCENT, marginBottom: 4 }}
            >
              BACKEND
            </div>
          </div>
        </div>
        {/* Join bar */}
        <div
          style={{
            height: 4,
            background: INK,
            width: "100%",
            opacity: 0.85,
          }}
        />
      </div>
    </div>
  );
}

/* ─── Start terminator ──────────────────────────────────────────────────── */
function StartTerminator({ triggered, seqIdx }: { triggered: boolean; seqIdx: number }) {
  const delay = elDelay(seqIdx);
  return (
    <div
      className="flex justify-center"
      style={{
        opacity: triggered ? 1 : 0,
        transform: triggered ? "scale(1)" : "scale(0.5)",
        transition: triggered
          ? `opacity 0.4s ease ${delay}ms, transform 0.4s cubic-bezier(0.85,0,0.15,1) ${delay}ms`
          : "none",
      }}
    >
      <div className="flex flex-col items-center gap-1">
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: INK,
          }}
        />
        <span
          className="font-mono uppercase"
          style={{ fontSize: "8px", letterSpacing: "0.2em", opacity: 0.5 }}
        >
          START
        </span>
      </div>
    </div>
  );
}

/* ─── End terminator (bullseye) ─────────────────────────────────────────── */
function EndTerminator({ triggered, seqIdx }: { triggered: boolean; seqIdx: number }) {
  const delay = elDelay(seqIdx);
  return (
    <div
      className="flex justify-center"
      style={{
        opacity: triggered ? 1 : 0,
        transform: triggered ? "scale(1)" : "scale(0.5)",
        transition: triggered
          ? `opacity 0.4s ease ${delay}ms, transform 0.4s cubic-bezier(0.85,0,0.15,1) ${delay}ms`
          : "none",
      }}
    >
      <div className="flex flex-col items-center gap-1">
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: `3px solid ${INK}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: INK,
            }}
          />
        </div>
        <span
          className="font-mono uppercase"
          style={{ fontSize: "8px", letterSpacing: "0.2em", opacity: 0.5 }}
        >
          END
        </span>
      </div>
    </div>
  );
}

/* ─── Main export ───────────────────────────────────────────────────────── */
export function WorkProcessSection() {
  const [triggered, setTriggered] = useState(false);
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setTriggered(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setTriggered(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(node);
    const fallback = setTimeout(() => setTriggered(true), 2000);
    return () => {
      obs.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  const handlePhaseHover = useCallback((num: string | null) => {
    setHoveredPhase(num);
  }, []);

  /* Sequence index counter — each visual element gets the next slot */
  let seq = 0;
  const next = () => seq++;

  const currentPhase = hoveredPhase
    ? STEPS.find((s) => s.num === hoveredPhase)
    : null;

  return (
    <section
      id="process"
      className="snap-screen relative flex min-h-screen flex-col justify-center px-6 py-20 lg:px-10"
      style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
    >
      {/* Diamond pulse keyframe */}
      <style>{`
        @keyframes diamond-pulse {
          0%, 100% { box-shadow: 0 0 0 0 ${ACCENT}00; }
          50% { box-shadow: 0 0 0 8px ${ACCENT}44; }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[1400px]">
        <Reveal>
          <SectionHeader
            num="05"
            name="PROCESS"
            kicker="// DELIVERY PIPELINE"
            headline="HOW THE WORK GETS SHIPPED"
            right="06 PHASES · ~12 WEEKS"
            variant="banner"
          />
        </Reveal>

        {/* ── Diagram ─────────────────────────────────────────────────────── */}
        <div
          ref={sectionRef}
          className="mt-10"
          style={{ overflowX: "auto", overflowY: "visible" }}
        >
          {/* Mobile hint */}
          <div
            className="mb-3 block font-mono text-[10px] uppercase tracking-[0.2em] opacity-40 md:hidden"
            style={{ textAlign: "center" }}
          >
            SCROLL →
          </div>

          {/* Diagram column */}
          <div
            className="mx-auto flex flex-col gap-0"
            style={{ minWidth: 340, maxWidth: 520 }}
          >
            {/* START */}
            <StartTerminator triggered={triggered} seqIdx={next()} />

            {/* → Phase 01 */}
            <Connector triggered={triggered} seqIdx={next()} />
            <PhaseNode step={STEPS[0]} triggered={triggered} seqIdx={next()} onHover={handlePhaseHover} />

            {/* Decision: BRIEF APPROVED? */}
            <Connector triggered={triggered} seqIdx={next()} height={36} />
            <DecisionDiamond label="BRIEF APPROVED?" triggered={triggered} seqIdx={next()} />

            {/* → Phase 02 */}
            <Connector triggered={triggered} seqIdx={next()} height={36} />
            <PhaseNode step={STEPS[1]} triggered={triggered} seqIdx={next()} onHover={handlePhaseHover} />

            {/* → Phase 03 */}
            <Connector triggered={triggered} seqIdx={next()} />
            <PhaseNode step={STEPS[2]} triggered={triggered} seqIdx={next()} onHover={handlePhaseHover} />

            {/* Decision: PROTOTYPE SIGNED OFF? */}
            <Connector triggered={triggered} seqIdx={next()} height={36} />
            <DecisionDiamond label="PROTOTYPE SIGNED OFF?" triggered={triggered} seqIdx={next()} />

            {/* Fork + parallel tracks */}
            <Connector triggered={triggered} seqIdx={next()} height={36} />
            <ForkBar triggered={triggered} seqIdx={next()} />

            {/* → Phase 04 */}
            <Connector triggered={triggered} seqIdx={next()} height={36} />
            <PhaseNode step={STEPS[3]} triggered={triggered} seqIdx={next()} onHover={handlePhaseHover} />

            {/* → Phase 05 */}
            <Connector triggered={triggered} seqIdx={next()} />
            <PhaseNode step={STEPS[4]} triggered={triggered} seqIdx={next()} onHover={handlePhaseHover} />

            {/* Decision: QA PASS? */}
            <Connector triggered={triggered} seqIdx={next()} height={36} />
            <DecisionDiamond label="QA PASS?" triggered={triggered} seqIdx={next()} />

            {/* → Phase 06 */}
            <Connector triggered={triggered} seqIdx={next()} height={36} />
            <PhaseNode step={STEPS[5]} triggered={triggered} seqIdx={next()} onHover={handlePhaseHover} />

            {/* END */}
            <Connector triggered={triggered} seqIdx={next()} />
            <EndTerminator triggered={triggered} seqIdx={next()} />
          </div>
        </div>

        {/* ── Status bar ──────────────────────────────────────────────────── */}
        <div
          className="mt-10 grid grid-cols-3 gap-0 font-mono text-[11px] uppercase tracking-[0.2em]"
          style={{ border: `2px solid ${INK}` }}
        >
          <StatusCell
            k="PHASE"
            v={currentPhase ? `${currentPhase.num} / 06` : "START"}
          />
          <StatusCell k="MODE" v="ASYNC + SPRINTS" border />
          <StatusCell k="STATUS" v={currentPhase ? currentPhase.title.split(" ")[0] : "READY"} />
        </div>
      </div>
    </section>
  );
}

function StatusCell({ k, v, border }: { k: string; v: string; border?: boolean }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3"
      style={{
        borderLeft: border ? `2px solid ${INK}` : "none",
        borderRight: border ? `2px solid ${INK}` : "none",
        transition: "color 0.2s ease",
      }}
    >
      <span className="opacity-60">{k}</span>
      <span style={{ color: ACCENT }}>{v}</span>
    </div>
  );
}

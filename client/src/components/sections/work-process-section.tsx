import { useState, useRef, useEffect, useCallback } from "react";
import { Lightbulb, FileSearch, Palette, Code, TestTube, Rocket } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

const BG = "#0A0A0A";
const INK = "#F2EFE6";
const ACCENT = "#FF3D00";

const CONN_STEP_MS = 140;
const CONN_DURATION_MS = 360;
const CONN_H = 44;
const FORK_H = 128;
const FORK_SPREAD_PX = 90;

// ── Step data ────────────────────────────────────────────────────────────────

type StepData = {
  num: string;
  icon: typeof Lightbulb;
  title: string;
  description: string;
  duration: string;
  activities: string[];
  deliverables: string[];
};

const STEPS: StepData[] = [
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

// ── Diagram data model ───────────────────────────────────────────────────────

type NodeKind = "start" | "phase" | "decision" | "fork" | "join" | "end";

interface DiagramEl {
  id: string;
  kind: NodeKind;
  stepIndex?: number;
  label?: string;
}

// Flat ordered list that drives rendering and sequencing
const DIAGRAM: DiagramEl[] = [
  { id: "start",   kind: "start" },
  { id: "phase-0", kind: "phase",    stepIndex: 0 },
  { id: "dec-0",   kind: "decision", label: "BRIEF APPROVED?" },
  { id: "phase-1", kind: "phase",    stepIndex: 1 },
  { id: "phase-2", kind: "phase",    stepIndex: 2 },
  { id: "dec-1",   kind: "decision", label: "PROTOTYPE SIGNED OFF?" },
  { id: "fork",    kind: "fork" },
  { id: "join",    kind: "join" },
  { id: "phase-3", kind: "phase",    stepIndex: 3 },
  { id: "phase-4", kind: "phase",    stepIndex: 4 },
  { id: "dec-2",   kind: "decision", label: "QA PASS?" },
  { id: "phase-5", kind: "phase",    stepIndex: 5 },
  { id: "end",     kind: "end" },
];

// Connection list — index = animation sequence number
type ConnKind = "straight" | "fork-left" | "fork-right";
interface ConnDef { from: string; to: string; kind: ConnKind; trackLabel?: string; }

const CONNECTIONS: ConnDef[] = [
  { from: "start",   to: "phase-0", kind: "straight" },                           // 0
  { from: "phase-0", to: "dec-0",   kind: "straight" },                           // 1
  { from: "dec-0",   to: "phase-1", kind: "straight" },                           // 2
  { from: "phase-1", to: "phase-2", kind: "straight" },                           // 3
  { from: "phase-2", to: "dec-1",   kind: "straight" },                           // 4
  { from: "dec-1",   to: "fork",    kind: "straight" },                           // 5
  { from: "fork",    to: "join",    kind: "fork-left",  trackLabel: "FRONTEND" }, // 6
  { from: "fork",    to: "join",    kind: "fork-right", trackLabel: "BACKEND"  }, // 7
  { from: "join",    to: "phase-3", kind: "straight" },                           // 8
  { from: "phase-3", to: "phase-4", kind: "straight" },                           // 9
  { from: "phase-4", to: "dec-2",   kind: "straight" },                           // 10
  { from: "dec-2",   to: "phase-5", kind: "straight" },                           // 11
  { from: "phase-5", to: "end",     kind: "straight" },                           // 12
];

// Node reveal delay = incoming connector start delay + connector draw duration
// Both fork branches share connIdx 6 (simultaneous draw)
const NODE_REVEAL_DELAYS: Record<string, number> = (() => {
  const d: Record<string, number> = { start: 0 };
  CONNECTIONS.forEach((conn, idx) => {
    const effectiveIdx = conn.kind === "fork-right" ? idx - 1 : idx;
    const finish = effectiveIdx * CONN_STEP_MS + CONN_DURATION_MS;
    if (d[conn.to] === undefined || finish > d[conn.to]) d[conn.to] = finish;
  });
  return d;
})();

// Helper: find connIdx for a straight connection between two node IDs
function connIdxBetween(fromId: string, toId: string): number {
  return CONNECTIONS.findIndex(c => c.from === fromId && c.to === toId);
}

// ── Inline connector components ──────────────────────────────────────────────

// A straight vertical connector with arrowhead, self-contained in its own div.
// Because it's in normal DOM flow, it's always perfectly aligned with adjacent nodes.
function StraightConnector({
  connIdx,
  triggered,
}: {
  connIdx: number;
  triggered: boolean;
}) {
  const len = CONN_H;
  const delay = connIdx * CONN_STEP_MS;
  const markerId = `uml-arr-${connIdx}`;

  return (
    <div style={{ display: "flex", justifyContent: "center", height: CONN_H, flexShrink: 0 }}>
      <svg width="24" height={CONN_H} overflow="visible" style={{ display: "block" }}>
        <defs>
          <marker id={markerId} markerWidth="8" markerHeight="8" refX="4" refY="7" orient="auto">
            <polygon points="0 0, 8 0, 4 8" fill={INK} opacity="0.85" />
          </marker>
        </defs>
        <line
          x1="12" y1="2"
          x2="12" y2={CONN_H - 6}
          stroke={INK}
          strokeWidth="2"
          opacity="0.8"
          strokeDasharray={len}
          strokeDashoffset={triggered ? 0 : len}
          markerEnd={`url(#${markerId})`}
          style={{
            transition: triggered
              ? `stroke-dashoffset ${CONN_DURATION_MS}ms cubic-bezier(0.85,0,0.15,1) ${delay}ms`
              : "none",
          }}
        />
      </svg>
    </div>
  );
}

// Fork connector: two diverging then converging paths, representing parallel tracks.
// Rendered in flow between fork bar and join bar — always perfectly aligned.
function ForkConnector({
  connIdxLeft,
  triggered,
}: {
  connIdxLeft: number;
  triggered: boolean;
}) {
  const W = 400;
  const H = FORK_H;
  const cx = W / 2;
  const ox = FORK_SPREAD_PX;
  const spread = 22;
  const delay = connIdxLeft * CONN_STEP_MS;

  // Left branch: center → cx-ox → cx-ox → center
  const leftD = `M ${cx} 2 L ${cx - ox} ${spread} L ${cx - ox} ${H - spread} L ${cx} ${H - 2}`;
  const rightD = `M ${cx} 2 L ${cx + ox} ${spread} L ${cx + ox} ${H - spread} L ${cx} ${H - 2}`;

  const seg1 = Math.hypot(ox, spread - 2);
  const seg2 = H - 2 * spread;
  const seg3 = Math.hypot(ox, spread - 2);
  const pathLen = seg1 + seg2 + seg3;

  const markL = "uml-fork-l";
  const markR = "uml-fork-r";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: H,
        flexShrink: 0,
        position: "relative",
      }}
    >
      <svg
        width={W}
        height={H}
        style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", overflow: "visible" }}
      >
        <defs>
          <marker id={markL} markerWidth="8" markerHeight="8" refX="4" refY="7" orient="auto">
            <polygon points="0 0, 8 0, 4 8" fill={INK} opacity="0.85" />
          </marker>
          <marker id={markR} markerWidth="8" markerHeight="8" refX="4" refY="7" orient="auto">
            <polygon points="0 0, 8 0, 4 8" fill={INK} opacity="0.85" />
          </marker>
        </defs>
        {/* Left branch (FRONTEND) */}
        <path
          d={leftD}
          fill="none"
          stroke={INK}
          strokeWidth="2"
          opacity="0.8"
          strokeDasharray={pathLen}
          strokeDashoffset={triggered ? 0 : pathLen}
          markerEnd={`url(#${markL})`}
          style={{
            transition: triggered
              ? `stroke-dashoffset ${CONN_DURATION_MS}ms cubic-bezier(0.85,0,0.15,1) ${delay}ms`
              : "none",
          }}
        />
        {/* Right branch (BACKEND) */}
        <path
          d={rightD}
          fill="none"
          stroke={INK}
          strokeWidth="2"
          opacity="0.8"
          strokeDasharray={pathLen}
          strokeDashoffset={triggered ? 0 : pathLen}
          markerEnd={`url(#${markR})`}
          style={{
            transition: triggered
              ? `stroke-dashoffset ${CONN_DURATION_MS}ms cubic-bezier(0.85,0,0.15,1) ${delay}ms`
              : "none",
          }}
        />
        {/* Track labels */}
        <text
          x={cx - ox - 10}
          y={H / 2}
          textAnchor="end"
          fontFamily="monospace"
          fontSize="9"
          letterSpacing="2"
          fill={ACCENT}
          opacity={triggered ? 0.85 : 0}
          style={{ transition: triggered ? `opacity 0.3s ease ${delay + CONN_DURATION_MS}ms` : "none" }}
        >
          FRONTEND
        </text>
        <text
          x={cx + ox + 10}
          y={H / 2}
          textAnchor="start"
          fontFamily="monospace"
          fontSize="9"
          letterSpacing="2"
          fill={ACCENT}
          opacity={triggered ? 0.85 : 0}
          style={{ transition: triggered ? `opacity 0.3s ease ${delay + CONN_DURATION_MS}ms` : "none" }}
        >
          BACKEND
        </text>
      </svg>
    </div>
  );
}

// ── Node components ──────────────────────────────────────────────────────────

function StartTerminator({ triggered }: { triggered: boolean }) {
  const delay = NODE_REVEAL_DELAYS["start"] ?? 0;
  return (
    <div
      className="flex flex-col items-center gap-1"
      style={{
        opacity: triggered ? 1 : 0,
        transform: triggered ? "scale(1)" : "scale(0.4)",
        transition: triggered
          ? `opacity 0.35s ease ${delay}ms, transform 0.35s cubic-bezier(0.85,0,0.15,1) ${delay}ms`
          : "none",
      }}
    >
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: INK }} />
      <span className="font-mono uppercase" style={{ fontSize: "8px", letterSpacing: "0.22em", opacity: 0.5 }}>
        START
      </span>
    </div>
  );
}

function EndTerminator({ triggered }: { triggered: boolean }) {
  const delay = NODE_REVEAL_DELAYS["end"] ?? 0;
  return (
    <div
      className="flex flex-col items-center gap-1"
      style={{
        opacity: triggered ? 1 : 0,
        transform: triggered ? "scale(1)" : "scale(0.4)",
        transition: triggered
          ? `opacity 0.35s ease ${delay}ms, transform 0.35s cubic-bezier(0.85,0,0.15,1) ${delay}ms`
          : "none",
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          border: `3px solid ${INK}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: INK }} />
      </div>
      <span className="font-mono uppercase" style={{ fontSize: "8px", letterSpacing: "0.22em", opacity: 0.5 }}>
        END
      </span>
    </div>
  );
}

function DecisionDiamond({
  el,
  triggered,
}: {
  el: DiagramEl;
  triggered: boolean;
}) {
  const delay = NODE_REVEAL_DELAYS[el.id] ?? 0;
  const size = 84;

  return (
    <div
      className="flex justify-center"
      style={{
        opacity: triggered ? 1 : 0,
        transition: triggered ? `opacity 0.38s ease ${delay}ms` : "none",
        minHeight: size + 20,
      }}
    >
      <div className="relative flex items-center justify-center" style={{ width: size * 2, height: size }}>
        {/* The diamond: a square rotated 45° */}
        <div
          className="absolute"
          style={{
            width: size,
            height: size,
            transform: "rotate(45deg)",
            border: `2px solid ${ACCENT}`,
            background: BG,
            animation: triggered ? `diamond-pulse 2.6s ease-in-out ${delay + 400}ms infinite` : "none",
          }}
        />
        {/* Label — not rotated */}
        <div
          className="relative z-10 text-center font-mono uppercase"
          style={{ fontSize: "9px", letterSpacing: "0.14em", color: ACCENT, maxWidth: size - 8, lineHeight: 1.4 }}
        >
          {el.label}
        </div>
        {/* YES label beneath */}
        <div
          className="absolute font-mono uppercase"
          style={{
            fontSize: "8px",
            letterSpacing: "0.16em",
            color: INK,
            opacity: 0.4,
            bottom: -2,
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
          }}
        >
          YES ↓
        </div>
        {/* Decorative NO branch loop */}
        <svg
          className="absolute"
          style={{ right: -60, top: "50%", transform: "translateY(-50%)", overflow: "visible" }}
          width="60"
          height="60"
        >
          <path
            d="M 0 30 L 26 30 L 26 -2 L -2 -2"
            fill="none"
            stroke={INK}
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.28"
          />
          <text x="28" y="34" fontFamily="monospace" fontSize="8" fill={INK} opacity="0.32" letterSpacing="2">NO</text>
        </svg>
      </div>
    </div>
  );
}

function ForkBar({ el, triggered }: { el: DiagramEl; triggered: boolean }) {
  const delay = NODE_REVEAL_DELAYS[el.id] ?? 0;
  return (
    <div
      style={{
        opacity: triggered ? 0.9 : 0,
        transition: triggered ? `opacity 0.32s ease ${delay}ms` : "none",
        height: 6,
        background: INK,
        borderRadius: 1,
      }}
    />
  );
}

function JoinBar({ el, triggered }: { el: DiagramEl; triggered: boolean }) {
  const delay = NODE_REVEAL_DELAYS[el.id] ?? 0;
  return (
    <div
      style={{
        opacity: triggered ? 0.9 : 0,
        transition: triggered ? `opacity 0.32s ease ${delay}ms` : "none",
        height: 6,
        background: INK,
        borderRadius: 1,
      }}
    />
  );
}

function PhaseNode({
  el,
  triggered,
  onActivate,
}: {
  el: DiagramEl;
  triggered: boolean;
  onActivate: (num: string | null) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const expanded = hovered || clicked;
  const step = STEPS[el.stepIndex!];
  const Icon = step.icon;
  const delay = NODE_REVEAL_DELAYS[el.id] ?? 0;

  const handleClick = () => {
    const next = !clicked;
    setClicked(next);
    onActivate(next ? step.num : null);
  };

  return (
    <div
      style={{
        opacity: triggered ? 1 : 0,
        transform: triggered ? "translateY(0)" : "translateY(10px)",
        transition: triggered
          ? `opacity 0.42s ease ${delay}ms, transform 0.42s cubic-bezier(0.85,0,0.15,1) ${delay}ms`
          : "none",
      }}
    >
      <div
        className="w-full cursor-pointer"
        style={{
          border: `2px solid ${INK}`,
          background: expanded ? INK : BG,
          color: expanded ? BG : INK,
          transition: "background 0.22s ease, color 0.22s ease",
        }}
        onMouseEnter={() => { setHovered(true); onActivate(step.num); }}
        onMouseLeave={() => { setHovered(false); if (!clicked) onActivate(null); }}
        onClick={handleClick}
      >
        {/* Header row */}
        <div
          className="flex items-center gap-4 px-5 py-4"
          style={{ borderBottom: expanded ? `2px solid ${BG}` : "none" }}
        >
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center"
            style={{ background: ACCENT, color: BG }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span
                className="font-mono text-[11px] uppercase tracking-[0.22em]"
                style={{ color: expanded ? BG : ACCENT }}
              >
                PHASE {step.num}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60">
                {step.duration}
              </span>
            </div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(14px, 2vw, 17px)",
                lineHeight: 1.15,
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
              }}
            >
              {step.title}
            </div>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] opacity-35 flex-shrink-0">
            {expanded ? "▲" : "▼"}
          </span>
        </div>

        {/* Expandable detail */}
        <div
          style={{
            maxHeight: expanded ? 400 : 0,
            overflow: "hidden",
            transition: "max-height 0.42s cubic-bezier(0.85,0,0.15,1)",
          }}
        >
          <div className="px-5 py-4">
            <p className="mb-4 text-[13px] leading-relaxed" style={{ opacity: 0.82 }}>
              {step.description}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {(["ACTIVITIES", "DELIVERABLES"] as const).map((col) => (
                <div key={col}>
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
                    {col}
                  </div>
                  <ul className="space-y-1">
                    {(col === "ACTIVITIES" ? step.activities : step.deliverables).map((item, i) => (
                      <li key={i} className="flex items-baseline gap-2 font-mono text-[11px] uppercase tracking-[0.08em]">
                        <span style={{ color: ACCENT }}>›</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Diagram renderer ─────────────────────────────────────────────────────────

// Renders one diagram element based on its kind
function DiagramNode({
  el,
  triggered,
  onActivate,
}: {
  el: DiagramEl;
  triggered: boolean;
  onActivate: (num: string | null) => void;
}) {
  switch (el.kind) {
    case "start":    return <StartTerminator triggered={triggered} />;
    case "end":      return <EndTerminator triggered={triggered} />;
    case "phase":    return <PhaseNode el={el} triggered={triggered} onActivate={onActivate} />;
    case "decision": return <DecisionDiamond el={el} triggered={triggered} />;
    case "fork":     return <ForkBar el={el} triggered={triggered} />;
    case "join":     return <JoinBar el={el} triggered={triggered} />;
    default:         return null;
  }
}

// Renders the connector that follows a given element.
// Returns null for the final element (end) or the fork→join span (handled specially).
function ConnectorAfter({
  el,
  nextEl,
  triggered,
}: {
  el: DiagramEl;
  nextEl: DiagramEl;
  triggered: boolean;
}) {
  if (el.kind === "fork") {
    // Fork→Join: use the branching fork connector
    const leftConnIdx = CONNECTIONS.findIndex(c => c.from === "fork" && c.kind === "fork-left");
    return <ForkConnector connIdxLeft={leftConnIdx} triggered={triggered} />;
  }
  const idx = connIdxBetween(el.id, nextEl.id);
  if (idx < 0) return null;
  return <StraightConnector connIdx={idx} triggered={triggered} />;
}

// ── Main section ─────────────────────────────────────────────────────────────

export function WorkProcessSection() {
  const [triggered, setTriggered] = useState(false);
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = diagramRef.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTriggered(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { setTriggered(true); obs.disconnect(); }
        }
      },
      { threshold: 0.06 }
    );
    obs.observe(node);
    const fallback = setTimeout(() => setTriggered(true), 2500);
    return () => { obs.disconnect(); clearTimeout(fallback); };
  }, []);

  const handleActivate = useCallback((num: string | null) => setActivePhase(num), []);
  const currentPhase = activePhase ? STEPS.find((s) => s.num === activePhase) : null;

  return (
    <section
      id="process"
      className="snap-screen relative flex min-h-screen flex-col justify-center px-6 py-20 lg:px-10"
      style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
    >
      <style>{`
        @keyframes diamond-pulse {
          0%, 100% { box-shadow: 0 0 0 0 ${ACCENT}00; }
          50%       { box-shadow: 0 0 0 10px ${ACCENT}33; }
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

        <p className="mt-6 block text-center font-mono text-[10px] uppercase tracking-[0.22em] opacity-38 md:hidden">
          SCROLL →
        </p>

        {/* Diagram — inline connectors in normal DOM flow for perfect alignment */}
        <div className="mt-10" style={{ overflowX: "auto", overflowY: "visible" }}>
          <div
            ref={diagramRef}
            className="mx-auto flex flex-col"
            style={{ minWidth: 380, maxWidth: 560 }}
          >
            {DIAGRAM.map((el, i) => (
              <div key={el.id}>
                <DiagramNode el={el} triggered={triggered} onActivate={handleActivate} />
                {i < DIAGRAM.length - 1 && (
                  <ConnectorAfter el={el} nextEl={DIAGRAM[i + 1]} triggered={triggered} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Status bar */}
        <div
          className="mt-10 grid grid-cols-3 gap-0 font-mono text-[11px] uppercase tracking-[0.2em]"
          style={{ border: `2px solid ${INK}` }}
        >
          <StatusCell k="PHASE" v={currentPhase ? `${currentPhase.num} / 06` : "START"} />
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

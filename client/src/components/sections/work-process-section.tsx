import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { Lightbulb, FileSearch, Palette, Code, TestTube, Rocket } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

const BG = "#0A0A0A";
const INK = "#F2EFE6";
const ACCENT = "#FF3D00";

// Animation constants
const CONN_STEP_MS = 130;       // delay increment per connector index
const CONN_DURATION_MS = 380;   // stroke-dashoffset transition duration
const FORK_OFFSET_PX = 72;

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
  stepIndex?: number; // phase only
  label?: string;     // decision only
}

// Flat ordered list — drives both DOM rendering and SVG path generation
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

// ── Connection definitions ───────────────────────────────────────────────────

type ConnKind = "straight" | "fork-left" | "fork-right";

interface ConnDef {
  from: string;
  to: string;
  kind: ConnKind;
  trackLabel?: string; // FRONTEND / BACKEND label on fork branches
}

// Ordered list — index position doubles as animation sequence number
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

// Pre-compute node reveal delays:
// Each node appears after its incoming connector(s) finish drawing.
// delay = max(incomingConnIdx) * CONN_STEP_MS + CONN_DURATION_MS
const NODE_REVEAL_DELAYS: Record<string, number> = (() => {
  const delays: Record<string, number> = { start: 0 };
  CONNECTIONS.forEach((conn, idx) => {
    const connFinish = idx * CONN_STEP_MS + CONN_DURATION_MS;
    if (delays[conn.to] === undefined || connFinish > delays[conn.to]) {
      delays[conn.to] = connFinish;
    }
  });
  return delays;
})();

// ── Computed path data ───────────────────────────────────────────────────────

interface PathData {
  d: string;
  length: number;
  connIdx: number;
  hasArrow: boolean;
  trackLabel?: { x: number; y: number; anchor: "start" | "end"; text: string };
}

function computePaths(
  containerEl: HTMLElement,
  nodeMap: Map<string, HTMLElement>
): PathData[] {
  const cRect = containerEl.getBoundingClientRect();
  const cx = cRect.width / 2;

  const getRect = (id: string) => {
    const el = nodeMap.get(id);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      top: r.top - cRect.top,
      bottom: r.bottom - cRect.top,
      midX: r.left - cRect.left + r.width / 2,
    };
  };

  const results: PathData[] = [];

  CONNECTIONS.forEach((conn, connIdx) => {
    const from = getRect(conn.from);
    const to = getRect(conn.to);
    if (!from || !to) return;

    const fx = from.midX;
    const fy = from.bottom;
    const tx = to.midX;
    const ty = to.top;

    if (conn.kind === "straight") {
      const d = `M ${fx} ${fy} L ${tx} ${ty}`;
      const length = Math.hypot(tx - fx, ty - fy);
      results.push({ d, length, connIdx, hasArrow: true });
      return;
    }

    // fork-left or fork-right — polyline that fans out then converges
    const offset = conn.kind === "fork-left" ? -FORK_OFFSET_PX : FORK_OFFSET_PX;
    const branchX = cx + offset;
    const spread = 20;

    const d = [
      `M ${fx} ${fy}`,
      `L ${branchX} ${fy + spread}`,
      `L ${branchX} ${ty - spread}`,
      `L ${tx} ${ty}`,
    ].join(" ");

    const seg1 = Math.hypot(branchX - fx, spread);
    const seg2 = Math.abs(ty - spread - (fy + spread));
    const seg3 = Math.hypot(tx - branchX, spread);
    const length = seg1 + seg2 + seg3;

    const labelAnchor: "start" | "end" = conn.kind === "fork-left" ? "end" : "start";
    const labelX = branchX + (conn.kind === "fork-left" ? -6 : 6);
    const labelY = fy + spread + (ty - spread - fy - spread) / 2;

    results.push({
      d,
      length,
      connIdx,
      hasArrow: true,
      ...(conn.trackLabel && {
        trackLabel: { x: labelX, y: labelY, anchor: labelAnchor, text: conn.trackLabel },
      }),
    });
  });

  return results;
}

// ── SVG connector overlay ────────────────────────────────────────────────────

function ConnectorOverlay({
  paths,
  svgSize,
  triggered,
}: {
  paths: PathData[];
  svgSize: { w: number; h: number };
  triggered: boolean;
}) {
  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: svgSize.w,
        height: svgSize.h,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <defs>
        <marker id="uml-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <polygon points="0 0, 7 3.5, 0 7" fill={INK} opacity="0.8" />
        </marker>
      </defs>

      {paths.map((path, i) => {
        const delay = path.connIdx * CONN_STEP_MS;
        return (
          <g key={i}>
            <path
              d={path.d}
              fill="none"
              stroke={INK}
              strokeWidth="1.75"
              opacity="0.7"
              strokeDasharray={path.length}
              strokeDashoffset={triggered ? 0 : path.length}
              markerEnd={path.hasArrow ? "url(#uml-arrow)" : undefined}
              style={{
                transition: triggered
                  ? `stroke-dashoffset ${CONN_DURATION_MS}ms cubic-bezier(0.85,0,0.15,1) ${delay}ms`
                  : "none",
              }}
            />
            {path.trackLabel && (
              <text
                x={path.trackLabel.x}
                y={path.trackLabel.y}
                fontFamily="monospace"
                fontSize="9"
                textAnchor={path.trackLabel.anchor}
                fill={ACCENT}
                opacity={triggered ? 0.8 : 0}
                letterSpacing="2"
                style={{
                  transition: triggered
                    ? `opacity 0.3s ease ${delay + CONN_DURATION_MS}ms`
                    : "none",
                }}
              >
                {path.trackLabel.text}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── Node components ──────────────────────────────────────────────────────────

function StartNode({ nodeRef }: { nodeRef: (el: HTMLElement | null) => void }) {
  return (
    <div ref={nodeRef as (el: HTMLDivElement | null) => void} className="flex justify-center py-1">
      <div className="flex flex-col items-center gap-1">
        <div style={{ width: 20, height: 20, borderRadius: "50%", background: INK }} />
        <span
          className="font-mono uppercase"
          style={{ fontSize: "8px", letterSpacing: "0.2em", opacity: 0.5, color: INK }}
        >
          START
        </span>
      </div>
    </div>
  );
}

function EndNode({ nodeRef }: { nodeRef: (el: HTMLElement | null) => void }) {
  return (
    <div ref={nodeRef as (el: HTMLDivElement | null) => void} className="flex justify-center py-1">
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
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: INK }} />
        </div>
        <span
          className="font-mono uppercase"
          style={{ fontSize: "8px", letterSpacing: "0.2em", opacity: 0.5, color: INK }}
        >
          END
        </span>
      </div>
    </div>
  );
}

function ForkBarNode({ nodeRef }: { nodeRef: (el: HTMLElement | null) => void }) {
  return (
    <div
      ref={nodeRef as (el: HTMLDivElement | null) => void}
      className="w-full"
      style={{ maxWidth: 520, margin: "0 auto" }}
    >
      <div style={{ height: 4, background: INK, opacity: 0.85 }} />
    </div>
  );
}

function JoinBarNode({ nodeRef }: { nodeRef: (el: HTMLElement | null) => void }) {
  return (
    <div
      ref={nodeRef as (el: HTMLDivElement | null) => void}
      className="w-full"
      style={{ maxWidth: 520, margin: "0 auto" }}
    >
      <div style={{ height: 4, background: INK, opacity: 0.85 }} />
    </div>
  );
}

function DecisionNode({
  label,
  nodeRef,
  pulsing,
}: {
  label: string;
  nodeRef: (el: HTMLElement | null) => void;
  pulsing: boolean;
}) {
  return (
    <div
      ref={nodeRef as (el: HTMLDivElement | null) => void}
      className="flex justify-center"
      style={{ minHeight: 80 }}
    >
      <div className="relative flex items-center justify-center" style={{ width: 180, height: 80 }}>
        <div
          className="absolute"
          style={{
            width: 80,
            height: 80,
            transform: "rotate(45deg)",
            border: `2px solid ${ACCENT}`,
            background: BG,
            animation: pulsing ? "diamond-pulse 2.5s ease-in-out infinite" : "none",
          }}
        />
        <div
          className="relative z-10 text-center font-mono uppercase"
          style={{ fontSize: "9px", letterSpacing: "0.14em", color: ACCENT, maxWidth: 90 }}
        >
          {label}
        </div>
        <div
          className="absolute font-mono uppercase"
          style={{
            fontSize: "8px",
            letterSpacing: "0.16em",
            color: INK,
            opacity: 0.45,
            bottom: -10,
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
          }}
        >
          YES ↓
        </div>
        <svg
          className="absolute"
          style={{ right: -56, top: "50%", transform: "translateY(-50%)" }}
          width="56"
          height="60"
          overflow="visible"
        >
          <path
            d="M 0 30 L 24 30 L 24 -4 L -6 -4"
            fill="none"
            stroke={INK}
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.3"
          />
          <text x="26" y="33" fontFamily="monospace" fontSize="8" fill={INK} opacity="0.35" letterSpacing="2">
            NO
          </text>
        </svg>
      </div>
    </div>
  );
}

function PhaseNode({
  step,
  nodeRef,
  onActivate,
}: {
  step: StepData;
  nodeRef: (el: HTMLElement | null) => void;
  onActivate: (num: string | null) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const expanded = hovered || clicked;
  const Icon = step.icon;

  const handleClick = () => {
    const next = !clicked;
    setClicked(next);
    onActivate(next ? step.num : null);
  };

  return (
    <div
      ref={nodeRef as (el: HTMLDivElement | null) => void}
      className="w-full cursor-pointer"
      style={{
        maxWidth: 520,
        margin: "0 auto",
        border: `2px solid ${INK}`,
        background: expanded ? INK : BG,
        color: expanded ? BG : INK,
        transition: "background 0.25s ease, color 0.25s ease",
      }}
      onMouseEnter={() => { setHovered(true); onActivate(step.num); }}
      onMouseLeave={() => { setHovered(false); if (!clicked) onActivate(null); }}
      onClick={handleClick}
    >
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
          <div className="flex items-baseline gap-3">
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
              fontSize: "clamp(14px, 2vw, 18px)",
              lineHeight: 1.1,
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
            }}
          >
            {step.title}
          </div>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.15em] opacity-40 flex-shrink-0">
          {expanded ? "▲" : "▼"}
        </span>
      </div>

      <div
        style={{
          maxHeight: expanded ? 360 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.85,0,0.15,1)",
        }}
      >
        <div className="px-5 py-4">
          <p className="mb-4 text-[13px] leading-relaxed" style={{ opacity: 0.82 }}>
            {step.description}
          </p>
          <div className="grid grid-cols-2 gap-4">
            {(["ACTIVITIES", "DELIVERABLES"] as const).map((col) => (
              <div key={col}>
                <div
                  className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: ACCENT }}
                >
                  {col}
                </div>
                <ul className="space-y-1">
                  {(col === "ACTIVITIES" ? step.activities : step.deliverables).map((item, i) => (
                    <li
                      key={i}
                      className="flex items-baseline gap-2 font-mono text-[11px] uppercase tracking-[0.08em]"
                    >
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
  );
}

// ── Render a diagram element by kind ────────────────────────────────────────

function renderNode(
  el: DiagramEl,
  opts: {
    nodeRef: (e: HTMLElement | null) => void;
    onActivate: (num: string | null) => void;
    triggered: boolean;
  }
): ReactNode {
  const { nodeRef, onActivate, triggered } = opts;
  const delay = NODE_REVEAL_DELAYS[el.id] ?? 0;

  const fadeIn: React.CSSProperties = {
    opacity: triggered ? 1 : 0,
    transform: triggered ? "translateY(0)" : "translateY(8px)",
    transition: triggered
      ? `opacity 0.4s ease ${delay}ms, transform 0.4s cubic-bezier(0.85,0,0.15,1) ${delay}ms`
      : "none",
  };

  switch (el.kind) {
    case "start":
      return <div style={fadeIn}><StartNode nodeRef={nodeRef} /></div>;
    case "end":
      return <div style={fadeIn}><EndNode nodeRef={nodeRef} /></div>;
    case "phase":
      return (
        <div style={fadeIn}>
          <PhaseNode step={STEPS[el.stepIndex!]} nodeRef={nodeRef} onActivate={onActivate} />
        </div>
      );
    case "decision":
      return (
        <div style={fadeIn}>
          <DecisionNode label={el.label!} nodeRef={nodeRef} pulsing={triggered} />
        </div>
      );
    case "fork":
      return <div style={fadeIn}><ForkBarNode nodeRef={nodeRef} /></div>;
    case "join":
      return <div style={fadeIn}><JoinBarNode nodeRef={nodeRef} /></div>;
    default:
      return null;
  }
}

// ── Main section export ──────────────────────────────────────────────────────

export function WorkProcessSection() {
  const [triggered, setTriggered] = useState(false);
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLElement>>(new Map());

  const setNodeRef = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (el) nodeRefs.current.set(id, el);
      else nodeRefs.current.delete(id);
    },
    []
  );

  const recomputePaths = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const r = container.getBoundingClientRect();
    setSvgSize({ w: r.width, h: r.height });
    setPaths(computePaths(container, nodeRefs.current));
  }, []);

  // Initial measurement after mount
  useEffect(() => {
    recomputePaths();
  }, [recomputePaths]);

  // Re-measure on container resize (handles node expand/collapse)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(recomputePaths);
    ro.observe(container);
    return () => ro.disconnect();
  }, [recomputePaths]);

  // Scroll-triggered animation via IntersectionObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
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
    obs.observe(container);
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
          0%,100% { box-shadow: 0 0 0 0 ${ACCENT}00; }
          50%      { box-shadow: 0 0 0 10px ${ACCENT}33; }
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

        <p className="mt-6 block text-center font-mono text-[10px] uppercase tracking-[0.2em] opacity-40 md:hidden">
          SCROLL →
        </p>

        <div className="mt-8" style={{ overflowX: "auto", overflowY: "visible" }}>
          <div
            ref={containerRef}
            className="relative mx-auto flex flex-col"
            style={{ minWidth: 340, maxWidth: 560, gap: 40 }}
          >
            <ConnectorOverlay paths={paths} svgSize={svgSize} triggered={triggered} />

            {DIAGRAM.map((el) => (
              <div key={el.id} style={{ position: "relative", zIndex: 1 }}>
                {renderNode(el, {
                  nodeRef: setNodeRef(el.id),
                  onActivate: handleActivate,
                  triggered,
                })}
              </div>
            ))}
          </div>
        </div>

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

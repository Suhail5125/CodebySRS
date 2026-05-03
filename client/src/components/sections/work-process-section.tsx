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

type ConnKind = "straight" | "fork-left" | "fork-right" | "loop-back";

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
  { from: "dec-0",   to: "phase-1", kind: "straight", trackLabel: "[YES]" },       // 2
  { from: "phase-1", to: "phase-2", kind: "straight" },                           // 3
  { from: "phase-2", to: "dec-1",   kind: "straight" },                           // 4
  { from: "dec-1",   to: "fork",    kind: "straight", trackLabel: "[YES]" },       // 5
  { from: "fork",    to: "join",    kind: "fork-left",  trackLabel: "FRONTEND" }, // 6
  { from: "fork",    to: "join",    kind: "fork-right", trackLabel: "BACKEND"  }, // 7
  { from: "join",    to: "phase-3", kind: "straight" },                           // 8
  { from: "phase-3", to: "phase-4", kind: "straight" },                           // 9
  { from: "phase-4", to: "dec-2",   kind: "straight" },                           // 10
  { from: "dec-2",   to: "phase-5", kind: "straight", trackLabel: "[YES]" },       // 11
  { from: "phase-5", to: "end",     kind: "straight" },                           // 12
  // [NO] loop-back paths — routed along right margin back to revision start
  { from: "dec-0",   to: "phase-0", kind: "loop-back", trackLabel: "[NO] REVISE" }, // 13
  { from: "dec-1",   to: "phase-2", kind: "loop-back", trackLabel: "[NO] REVISE" }, // 14
  { from: "dec-2",   to: "phase-4", kind: "loop-back", trackLabel: "[NO] REVISE" }, // 15
];

// Pre-compute node reveal delays:
// Each node appears after its incoming connector(s) finish drawing.
// delay = max(incomingConnIdx) * CONN_STEP_MS + CONN_DURATION_MS
// loop-back connections are excluded — they go to already-revealed nodes.
const NODE_REVEAL_DELAYS: Record<string, number> = (() => {
  const delays: Record<string, number> = { start: 0 };
  CONNECTIONS.forEach((conn, idx) => {
    if (conn.kind === "loop-back") return; // skip — target already revealed
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
  loopBack?: boolean;
  trackLabel?: { x: number; y: number; anchor: "start" | "middle" | "end"; text: string };
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
      midY: r.top - cRect.top + r.height / 2,
      right: r.right - cRect.left,
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
      const trackLabel = conn.trackLabel
        ? { x: fx, y: fy + 16, anchor: "middle" as const, text: conn.trackLabel }
        : undefined;
      results.push({ d, length, connIdx, hasArrow: true, ...(trackLabel && { trackLabel }) });
      return;
    }

    if (conn.kind === "loop-back") {
      // Route [NO] path along the right margin: exit diamond right tip → right rail → target right edge
      const exitX = from.midX + 74;   // right corner of decision diamond (104/2 × √2 ≈ 73.5)
      const exitY = from.midY;         // vertical center of decision node
      const entryX = to.right + 2;    // right edge of target phase node
      const entryY = to.midY;          // vertical center of target node
      const railX = cRect.width - 18; // right-margin routing channel

      const d = [
        `M ${exitX} ${exitY}`,
        `L ${railX} ${exitY}`,
        `L ${railX} ${entryY}`,
        `L ${entryX} ${entryY}`,
      ].join(" ");

      const seg1 = railX - exitX;
      const seg2 = Math.abs(entryY - exitY);
      const seg3 = railX - entryX;
      const length = seg1 + seg2 + seg3;

      const labelY = exitY + (entryY - exitY) / 2;

      results.push({
        d,
        length,
        connIdx,
        hasArrow: true,
        loopBack: true,
        ...(conn.trackLabel && {
          trackLabel: { x: railX + 4, y: labelY, anchor: "start", text: conn.trackLabel },
        }),
      });
      return;
    }

    // fork-left or fork-right — polyline that fans out then converges.
    // Both fork branches use the same connIdx so they draw simultaneously.
    const effectiveConnIdx = conn.kind === "fork-right" ? connIdx - 1 : connIdx;
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
      connIdx: effectiveConnIdx,
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
        <marker id="uml-arrow-accent" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <polygon points="0 0, 7 3.5, 0 7" fill={ACCENT} opacity="0.75" />
        </marker>
      </defs>

      {paths.map((path, i) => {
        const delay = path.connIdx * CONN_STEP_MS;
        const isLoop = path.loopBack;
        return (
          <g key={i}>
            <path
              d={path.d}
              fill="none"
              stroke={isLoop ? ACCENT : INK}
              strokeWidth={isLoop ? 1.5 : 1.75}
              opacity={isLoop ? 0.55 : 0.7}
              strokeDasharray={isLoop ? `${path.length} ${path.length}` : String(path.length)}
              strokeDashoffset={triggered ? 0 : path.length}
              strokeLinecap="round"
              markerEnd={path.hasArrow ? (isLoop ? "url(#uml-arrow-accent)" : "url(#uml-arrow)") : undefined}
              style={{
                transition: triggered
                  ? `stroke-dashoffset ${CONN_DURATION_MS}ms cubic-bezier(0.85,0,0.15,1) ${delay}ms`
                  : "none",
              }}
            />
            {/* dashed pattern overlay for loop-back (renders after animation) */}
            {isLoop && triggered && (
              <path
                d={path.d}
                fill="none"
                stroke={ACCENT}
                strokeWidth="1.5"
                opacity="0.55"
                strokeDasharray="6 5"
                strokeLinecap="round"
              />
            )}
            {path.trackLabel && (
              <text
                x={path.trackLabel.x}
                y={path.trackLabel.y}
                fontFamily="monospace"
                fontSize="9"
                textAnchor={path.trackLabel.anchor as "start" | "middle" | "end"}
                fill={isLoop ? ACCENT : ACCENT}
                opacity={triggered ? (isLoop ? 0.7 : 0.8) : 0}
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
    <div ref={nodeRef as (el: HTMLDivElement | null) => void} className="flex justify-center py-2">
      <div className="flex flex-col items-center gap-1.5">
        <span className="font-mono uppercase" style={{ fontSize: "8px", letterSpacing: "0.18em", opacity: 0.5, color: ACCENT }}>
          «init»
        </span>
        <div style={{
          width: 32, height: 32, borderRadius: "50%", background: INK,
          boxShadow: `0 0 0 5px ${INK}1A`,
        }} />
        <span className="font-mono uppercase" style={{ fontSize: "9px", letterSpacing: "0.2em", opacity: 0.55, color: INK }}>
          BEGIN PROCESS
        </span>
      </div>
    </div>
  );
}

function EndNode({ nodeRef }: { nodeRef: (el: HTMLElement | null) => void }) {
  return (
    <div ref={nodeRef as (el: HTMLDivElement | null) => void} className="flex justify-center py-2">
      <div className="flex flex-col items-center gap-1.5">
        <span className="font-mono uppercase" style={{ fontSize: "8px", letterSpacing: "0.18em", opacity: 0.5, color: ACCENT }}>
          «final»
        </span>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          border: `3px solid ${INK}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 0 5px ${INK}1A`,
        }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: INK }} />
        </div>
        <span className="font-mono uppercase" style={{ fontSize: "9px", letterSpacing: "0.2em", opacity: 0.55, color: ACCENT }}>
          FINISH PROCESS
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
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <span className="font-mono uppercase" style={{ fontSize: "8px", letterSpacing: "0.16em", color: INK, opacity: 0.45 }}>
          ← FRONTEND
        </span>
        <span className="font-mono uppercase" style={{ fontSize: "8px", letterSpacing: "0.18em", color: ACCENT, opacity: 0.7 }}>
          «fork»
        </span>
        <span className="font-mono uppercase" style={{ fontSize: "8px", letterSpacing: "0.16em", color: INK, opacity: 0.45 }}>
          BACKEND →
        </span>
      </div>
      <div style={{ height: 4, background: INK }} />
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
      <div style={{ height: 4, background: INK }} />
      <div className="flex items-center justify-center mt-1.5">
        <span className="font-mono uppercase" style={{ fontSize: "8px", letterSpacing: "0.18em", color: ACCENT, opacity: 0.7 }}>
          «join» — SYNCHRONIZE TRACKS
        </span>
      </div>
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
      className="flex flex-col items-center w-full"
      style={{ maxWidth: 520, margin: "0 auto" }}
    >
      {/* nodeRef on the inner diamond box only — height=148 so from.bottom
          lands at the diamond's actual bottom tip (104px × √2 / 2 ≈ 73.5px
          below centre, centre at 74px → tip at 147.5 ≈ 148px). */}
      <div
        ref={nodeRef as (el: HTMLDivElement | null) => void}
        className="relative flex items-center justify-center"
        style={{ width: 240, height: 148 }}
      >
        {/* Diamond shape */}
        <div
          className="absolute"
          style={{
            width: 104,
            height: 104,
            transform: "rotate(45deg)",
            border: `2px solid ${ACCENT}`,
            background: BG,
            animation: pulsing ? "diamond-pulse 2.5s ease-in-out infinite" : "none",
          }}
        />

        {/* Label inside diamond */}
        <div
          className="relative z-10 text-center font-mono uppercase"
          style={{ fontSize: "9px", letterSpacing: "0.12em", color: ACCENT, maxWidth: 88, lineHeight: 1.4 }}
        >
          {label}
        </div>
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
            style={{ minWidth: 420, maxWidth: 560, gap: 40 }}
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

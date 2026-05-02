import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, Code2, Palette, Smartphone, Globe, Zap, Rocket } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

const BG     = "#0A0A0A";
const INK    = "#F2EFE6";
const ACCENT = "#FF3D00";
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░<>/\\";

/* ── scramble (same hook used across sections) ───────────────────────────── */
function useScramble(target: string, durationMs: number, runKey: number | string) {
  const [out, setOut] = useState(target);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const revealHead = Math.floor(t * (target.length + 4));
      let s = "";
      for (let i = 0; i < target.length; i++) {
        if (i < revealHead - 4) s += target[i];
        else if (target[i] === " ") s += " ";
        else s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setOut(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs, runKey]);
  return out;
}

/* ── service data ────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    code: "WD",
    Icon: Code2,
    title: "Web Development",
    desc: "Custom web applications built with React, Next.js and Node.js. Responsive, fast-loading, scalable.",
    tags: ["SSR / SSG", "API Layer", "CI / CD", "Type-Safe DB"],
    stat: "12+ shipped",
  },
  {
    code: "UX",
    Icon: Palette,
    title: "UI / UX Design",
    desc: "Pixel-perfect interfaces grounded in research, wireframes and prototypes that convert.",
    tags: ["Design System", "Prototype", "Tokens", "Hand-off"],
    stat: "Design-first",
  },
  {
    code: "MB",
    Icon: Smartphone,
    title: "Mobile Development",
    desc: "Native iOS / Android and cross-platform builds (React Native, Flutter) with first-class UX.",
    tags: ["Native UI", "Push Notifs", "Offline", "App Store"],
    stat: "iOS + Android",
  },
  {
    code: "3D",
    Icon: Globe,
    title: "3D Web Experiences",
    desc: "WebGL / Three.js product configurators, virtual showrooms and interactive marketing scenes.",
    tags: ["WebGL", "Three.js", "GLTF", "Motion"],
    stat: "Immersive",
  },
  {
    code: "PF",
    Icon: Zap,
    title: "Performance",
    desc: "Audit, profile and optimise. Code-splitting, lazy loading, edge caching, real Lighthouse wins.",
    tags: ["Audit", "Bundle Cut", "Edge Cache", "Core Web Vitals"],
    stat: "100 score",
  },
  {
    code: "CS",
    Icon: Rocket,
    title: "Consulting",
    desc: "Architecture reviews, scalability planning, technology roadmaps for digital transformation.",
    tags: ["Audit", "Roadmap", "Stack Pick", "Hiring"],
    stat: "Strategic",
  },
] as const;

/* ─────────────────────────────────────────────────────────────────────────── */

export function ServicesSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section
      id="services"
      className="snap-screen relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-16 lg:px-10"
      style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
    >
      <div className="mx-auto w-full max-w-[1400px]">

        <Reveal>
          <SectionHeader
            num="04"
            name="SERVICES"
            kicker="// PRODUCTION SCOPE"
            headline="WHAT I BUILD"
            right={`${String(SERVICES.length).padStart(2, "0")} OFFERINGS`}
            variant="banner"
          />
        </Reveal>

        {/* ── Accordion rows ── */}
        <div
          className="mt-8"
          style={{ border: `2px solid ${INK}` }}
        >
          {SERVICES.map((svc, i) => (
            <ServiceRow
              key={svc.code}
              svc={svc}
              index={i}
              total={SERVICES.length}
              isActive={activeIdx === i}
              onActivate={() => setActiveIdx(i)}
            />
          ))}
        </div>

        {/* ── Status bar ── */}
        <div
          className="flex flex-col items-start justify-between gap-3 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.2em] sm:flex-row sm:items-center"
          style={{ border: `2px solid ${INK}`, borderTop: "none" }}
        >
          <div className="flex items-center gap-3">
            <span className="brut-blink inline-block h-1.5 w-1.5" style={{ background: ACCENT }} />
            <span>Queue open — Q3 / Q4 2026</span>
          </div>
          <div className="flex items-center gap-3 opacity-50">
            <span>Retainer + Project</span>
            <span>·</span>
            <span>EU / NA timezones</span>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─── ServiceRow ─────────────────────────────────────────────────────────── */

function ServiceRow({
  svc, index, total, isActive, onActivate,
}: {
  svc: typeof SERVICES[number];
  index: number;
  total: number;
  isActive: boolean;
  onActivate: () => void;
}) {
  const num      = String(index + 1).padStart(2, "0");
  const codeKey  = isActive ? 1 : 0;
  const scrambled = useScramble(`SVC_${svc.code}`, 500, codeKey);
  const Icon     = svc.Icon;
  const isLast   = index === total - 1;

  /* scan-line ref — animates a line across the active row */
  const scanRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scanRef.current;
    if (!el) return;
    if (isActive) {
      el.style.transition = "none";
      el.style.width = "0%";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = "width 0.55s cubic-bezier(0.4,0,0.2,1)";
          el.style.width = "100%";
        });
      });
    }
  }, [isActive]);

  return (
    <div
      onMouseEnter={onActivate}
      style={{
        background: isActive ? ACCENT : "transparent",
        color:      isActive ? BG : INK,
        borderBottom: isLast ? "none" : `2px solid ${INK}`,
        overflow: "hidden",
        cursor: "default",
        /* height transition: snappy but not instant */
        maxHeight: isActive ? 320 : 58,
        transition: "max-height 0.28s cubic-bezier(0.4,0,0.2,1), background 0.15s, color 0.15s",
      }}
    >
      {/* ── Always-visible row strip ── */}
      <div
        className="flex items-center gap-4 px-5"
        style={{ height: 58 }}
      >
        {/* Scrambled code */}
        <span
          className="font-mono text-[10px] uppercase tracking-[0.2em] shrink-0"
          style={{
            color: isActive ? BG : ACCENT,
            minWidth: 64,
            transition: "color 0.15s",
          }}
        >
          {scrambled}
        </span>

        {/* Number */}
        <span
          className="font-mono text-[10px] shrink-0"
          style={{ opacity: 0.45, minWidth: 24 }}
        >
          {num}
        </span>

        {/* Hairline */}
        <div className="flex-1 h-px" style={{ background: isActive ? `${BG}30` : `${INK}20` }} />

        {/* Icon */}
        <Icon
          size={16}
          strokeWidth={2.5}
          style={{ opacity: 0.6, flexShrink: 0 }}
        />

        {/* Title */}
        <h3
          className="shrink-0 uppercase"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(14px, 2vw, 20px)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {svc.title}
        </h3>

        {/* Hairline */}
        <div className="flex-1 h-px" style={{ background: isActive ? `${BG}30` : `${INK}20` }} />

        {/* Stat chip */}
        <span
          className="font-mono text-[9px] uppercase tracking-[0.18em] shrink-0 hidden md:inline"
          style={{ opacity: 0.55 }}
        >
          {svc.stat}
        </span>

        {/* Arrow */}
        <ArrowUpRight
          size={16}
          strokeWidth={2.5}
          className="shrink-0"
          style={{
            transform: isActive ? "rotate(0deg)" : "rotate(0deg)",
            opacity: isActive ? 1 : 0.4,
            transition: "opacity 0.15s",
          }}
        />
      </div>

      {/* ── Scan line — sweeps across when row opens ── */}
      <div
        ref={scanRef}
        style={{
          height: 2,
          width: "0%",
          background: isActive ? `${BG}40` : "transparent",
          marginBottom: 2,
        }}
      />

      {/* ── Expanded content ── */}
      <div
        className="px-5 pb-5"
        style={{
          opacity: isActive ? 1 : 0,
          transform: isActive ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity 0.2s 0.1s, transform 0.2s 0.1s",
          pointerEvents: isActive ? "auto" : "none",
        }}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
          {/* Left: description */}
          <p
            className="leading-snug"
            style={{
              fontSize: 13,
              opacity: 0.82,
              maxWidth: 560,
            }}
          >
            {svc.desc}
          </p>

          {/* Right: deliverable tags + CTA */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex flex-wrap justify-end gap-1.5">
              {svc.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[9px] uppercase tracking-[0.14em]"
                  style={{
                    padding: "3px 8px",
                    border: `1.5px solid ${BG}`,
                    opacity: 0.75,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]"
              style={{
                border: `2px solid ${BG}`,
                padding: "6px 14px",
                background: "transparent",
                color: BG,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              SCOPE_BRIEF
              <ArrowUpRight size={12} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

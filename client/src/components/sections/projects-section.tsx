import { useState, useRef, useCallback, forwardRef, useEffect, useMemo } from "react";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { Reveal, useReveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import type { Project } from "@shared";

const BG  = "#0A0A0A";
const INK = "#F2EFE6";
const ACCENT = "#FF3D00";

function parseTech(raw: string): string[] {
  try { return JSON.parse(raw); } catch { return []; }
}

/* ─── hooks ─────────────────────────────────────────────────────────────── */

function useReducedMotionCheck() {
  const [v, setV] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setV(mq.matches);
    const h = (e: MediaQueryListEvent) => setV(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return v;
}

function useRotator<T>(items: T[], ms: number, paused: boolean) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (paused || items.length <= 1) return;
    const id = setInterval(() => setI((n) => (n + 1) % items.length), ms);
    return () => clearInterval(id);
  }, [items.length, ms, paused]);
  return items[i];
}

function useNow() {
  const fmt = (d: Date) => {
    const p = (n: number) => String(n).padStart(2, "0");
    return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  };
  const [s, setS] = useState(() => fmt(new Date()));
  useEffect(() => {
    const id = setInterval(() => setS(fmt(new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  return s;
}

function useScramble(target: string, ms: number, runKey: number | string, paused: boolean) {
  const [out, setOut] = useState(target);
  useEffect(() => {
    if (paused) { setOut(target); return; }
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░<>/\\";
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const head = Math.floor(t * (target.length + 4));
      let s = "";
      for (let i = 0; i < target.length; i++) {
        const ch = target[i];
        if (i < head - 4) s += ch;
        else if (ch === " ") s += " ";
        else s += glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      setOut(s);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setOut(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, ms, runKey, paused]);
  return out;
}

/* ─── primitive components ──────────────────────────────────────────────── */

function ScrambleText({
  text, runKey = 0, ms = 500, paused = false,
}: { text: string; runKey?: number | string; ms?: number; paused?: boolean }) {
  const out = useScramble(text, ms, runKey, paused);
  return <span style={{ display: "inline-block", whiteSpace: "pre" }}>{out || "\u00A0"}</span>;
}

function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] opacity-[0.06]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        backgroundRepeat: "repeat",
      }}
    />
  );
}

function GridLines() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
      {[16.66, 33.33, 50, 66.66, 83.33].map((x) => (
        <div
          key={x}
          className="absolute inset-y-0 w-px"
          style={{ left: `${x}%`, background: "rgba(242,239,230,0.035)" }}
        />
      ))}
    </div>
  );
}

function Scanline() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      <div
        className="absolute inset-x-0 h-px brut-scan"
        style={{ background: ACCENT, opacity: 0.38, boxShadow: `0 0 6px ${ACCENT}` }}
      />
    </div>
  );
}

function SectionCursor({ container }: { container: React.RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const root = container.current;
    if (!root) return;
    let raf = 0;
    let pending = { x: 0, y: 0 };
    const apply = () => {
      raf = 0;
      if (!ref.current) return;
      ref.current.style.transform = `translate(${pending.x - 14}px, ${pending.y - 14}px)`;
    };
    const onMove = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect();
      pending = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);
    root.addEventListener("mousemove", onMove, { passive: true });
    root.addEventListener("mouseenter", onEnter);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseenter", onEnter);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, [container]);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-[6] h-7 w-7"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease-out",
        willChange: "transform",
        mixBlendMode: "difference",
      }}
    >
      <span className="absolute inset-0 border" style={{ borderColor: ACCENT }} />
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2" style={{ background: ACCENT, opacity: 0.7 }} />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2" style={{ background: ACCENT, opacity: 0.7 }} />
    </div>
  );
}

/* ─── main section ──────────────────────────────────────────────────────── */

export function ProjectsSection({ projects, isLoading }: { projects: Project[]; isLoading: boolean }) {
  const reduced   = useReducedMotionCheck();
  const display   = useMemo(() => [...projects].sort((a, b) => a.order - b.order), [projects]);
  const [hovered, setHovered]   = useState<number | null>(null);
  const [imgOffset, setImgOffset] = useState(0);
  const rowEls    = useRef<(HTMLDivElement | null)[]>([]);
  const listRef   = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const FEED = useMemo(() => [
    `${display.length} ENTRIES`,
    "FEED://projects",
    "STATUS: SHIPPED",
    "HOVER TO PREVIEW",
    "STACK: REACT + TS",
  ], [display.length]);

  const feedItem = useRotator(FEED, 2200, reduced);
  const now = useNow();

  const handleEnter = useCallback((i: number) => {
    setHovered(i);
    const row  = rowEls.current[i];
    const list = listRef.current;
    if (row && list) {
      const rr = row.getBoundingClientRect();
      const lr = list.getBoundingClientRect();
      setImgOffset(rr.top - lr.top + rr.height / 2 - 105);
    }
  }, []);

  const handleLeave = useCallback(() => setHovered(null), []);
  const activeProject = hovered !== null ? display[hovered] : null;

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative min-h-screen overflow-hidden px-6 py-20 lg:px-10"
      style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
    >
      {/* ── background layers ── */}
      <NoiseOverlay />
      <GridLines />
      {!reduced && <Scanline />}
      {!reduced && <SectionCursor container={sectionRef} />}

      {/* ── top status bar ── */}
      <div
        className="relative z-[3] mb-8 flex items-center justify-between pb-3 font-mono text-[11px] uppercase tracking-[0.18em]"
        style={{ borderBottom: "1px solid rgba(242,239,230,0.14)", color: INK }}
      >
        <div className="flex items-center gap-3">
          <span
            className="inline-block h-2 w-2 brut-blink"
            style={{ background: ACCENT }}
            aria-hidden
          />
          <span className="opacity-80">LIVE</span>
          <span className="opacity-30">/</span>
          <span className="opacity-80">PROJECTS</span>
          <span className="opacity-30">·</span>
          <span
            className="opacity-60 tabular-nums"
            style={{ minWidth: "20ch", display: "inline-block" }}
          >
            {reduced
              ? FEED[0]
              : <ScrambleText text={feedItem} runKey={feedItem} ms={380} />}
          </span>
        </div>
        <span
          className="hidden tabular-nums opacity-70 md:inline"
          style={{ minWidth: "8ch", textAlign: "right" }}
        >
          {now}
        </span>
      </div>

      {/* ── content ── */}
      <div className="relative z-[3] mx-auto w-full max-w-[1400px]">
        <Reveal>
          <SectionHeader
            num="02"
            name="PROJECTS"
            kicker="// SHIPPED ARTIFACTS"
            headline="WORK THAT RUNS IN PRODUCTION"
            right={`${display.length} ENTRIES`}
          />
        </Reveal>

        {/* list + floating preview */}
        <div
          ref={listRef}
          className="relative mt-10"
          style={{ border: `2px solid ${INK}` }}
        >
          {isLoading ? (
            <LoadingSkeleton />
          ) : display.length === 0 ? (
            <EmptyState />
          ) : (
            display.map((p, i) => (
              <ProjectRow
                key={p.id}
                project={p}
                index={i}
                isActive={hovered === i}
                ref={(el) => { rowEls.current[i] = el; }}
                onEnter={() => handleEnter(i)}
                onLeave={handleLeave}
                delay={i * 70}
                isLast={i === display.length - 1}
                runKey={hovered ?? -1}
                reduced={reduced}
              />
            ))
          )}

          {/* ── floating image preview ── */}
          {activeProject && (
            <div
              className="absolute hidden lg:block"
              style={{
                right: 160,
                top: imgOffset,
                zIndex: 30,
                width: 320,
                animation: "brut-preview-in 0.2s ease-out forwards",
                pointerEvents: "none",
              }}
            >
              <div style={{ border: `2px solid ${INK}`, background: BG }}>

                {/* card header: number + link buttons */}
                <div
                  className="flex items-center justify-between px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em]"
                  style={{ borderBottom: `2px solid ${INK}` }}
                >
                  <span style={{ color: ACCENT }}>
                    P-{String((hovered ?? 0) + 1).padStart(3, "0")}
                  </span>
                  <div className="flex items-center gap-2" style={{ pointerEvents: "auto" }}>
                    {activeProject.liveUrl && (
                      <a
                        href={activeProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1"
                        style={{ border: `1.5px solid ${INK}`, color: INK, transition: "none", textDecoration: "none" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = BG; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = INK; e.currentTarget.style.color = INK; }}
                      >
                        <ExternalLink className="h-3 w-3" strokeWidth={2.5} />
                        <span>LIVE</span>
                      </a>
                    )}
                    {activeProject.githubUrl && (
                      <a
                        href={activeProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1"
                        style={{ border: `1.5px solid ${INK}`, color: INK, transition: "none", textDecoration: "none" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = INK; e.currentTarget.style.color = BG; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = INK; }}
                      >
                        <Github className="h-3 w-3" strokeWidth={2} />
                        <span>REPO</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* image with Ken-Burns drift */}
                <div style={{ overflow: "hidden", height: 210 }}>
                  {activeProject.imageUrl ? (
                    <img
                      src={activeProject.imageUrl}
                      alt={activeProject.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        filter: "grayscale(8%) contrast(1.05)",
                        animation: "brut-img-drift 7s ease-in-out infinite alternate",
                        transformOrigin: "center center",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: ACCENT,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 800,
                          fontSize: 100,
                          color: BG,
                          lineHeight: 1,
                          letterSpacing: "-0.04em",
                        }}
                      >
                        {String((hovered ?? 0) + 1).padStart(2, "0")}
                      </span>
                    </div>
                  )}
                </div>

                {/* tech tags — only if admin added them */}
                {parseTech(activeProject.technologies).length > 0 && (
                  <div
                    className="flex flex-wrap gap-1.5 p-3"
                    style={{ borderTop: `2px solid ${INK}` }}
                  >
                    {parseTech(activeProject.technologies).slice(0, 6).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em]"
                        style={{ border: `1.5px solid ${INK}`, color: INK }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

              </div>
            </div>
          )}
        </div>

        {/* ── bottom strip ── */}
        {display.length > 0 && (
          <div
            className="grid grid-cols-3 font-mono text-[11px] uppercase tracking-[0.2em]"
            style={{ border: `2px solid ${INK}`, borderTop: "none" }}
          >
            <div className="px-4 py-3" style={{ borderRight: `2px solid ${INK}` }}>
              {display.length} PROJECTS IN FEED
            </div>
            <div className="px-4 py-3 opacity-50" style={{ borderRight: `2px solid ${INK}` }}>
              HOVER TO PREVIEW
            </div>
            <div className="px-4 py-3" style={{ color: ACCENT }}>
              {hovered !== null ? (
                <>
                  P-<ScrambleText
                    text={String(hovered + 1).padStart(3, "0")}
                    runKey={hovered}
                    ms={260}
                    paused={reduced}
                  />{" "}// ACTIVE
                </>
              ) : (
                "SELECT A PROJECT"
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── ProjectRow ────────────────────────────────────────────────────────── */

interface ProjectRowProps {
  project: Project;
  index: number;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
  delay: number;
  isLast: boolean;
  runKey: number;
  reduced: boolean;
}

const ProjectRow = forwardRef<HTMLDivElement, ProjectRowProps>(function ProjectRow(
  { project, index, isActive, onEnter, onLeave, delay, isLast, runKey, reduced },
  forwardedRef,
) {
  const { ref: revealRef, style: revealStyle } = useReveal({ delay, variant: "slide-left" });

  const num  = `P-${String(index + 1).padStart(3, "0")}`;
  const year = new Date(project.createdAt).getFullYear();
  const link = project.liveUrl ?? project.githubUrl ?? null;

  return (
    <div
      ref={(el) => {
        (revealRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        if (typeof forwardedRef === "function") forwardedRef(el);
        else if (forwardedRef)
          (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        ...revealStyle,
        background: isActive ? ACCENT : "transparent",
        borderBottom: isLast ? "none" : `2px solid ${INK}`,
        color: isActive ? BG : INK,
        transition: "none",
        cursor: "default",
      }}
    >
      <div className="flex items-center gap-5 px-5 py-6">

        {/* number */}
        <span
          className="w-[68px] shrink-0 font-mono text-[10px] uppercase tracking-[0.22em]"
          style={{ opacity: isActive ? 0.55 : 0.4 }}
        >
          {num}
        </span>

        {/* title + scramble + dot */}
        <div className="flex min-w-0 flex-1 items-center gap-5">
          <h3
            className="min-w-0 flex-1 truncate"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(20px, 3vw, 46px)",
              lineHeight: 1,
              letterSpacing: "-0.025em",
              textTransform: "uppercase",
            }}
          >
            {isActive && !reduced ? (
              <ScrambleText
                text={project.title.toUpperCase()}
                runKey={runKey}
                ms={420}
              />
            ) : (
              project.title.toUpperCase()
            )}
          </h3>
          {isActive && (
            <div
              className="shrink-0"
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                border: `2px solid ${BG}`,
              }}
            />
          )}
        </div>

        {/* year */}
        <span
          className="hidden shrink-0 font-mono text-[12px] lg:block"
          style={{
            opacity: isActive ? 0.65 : 0.45,
            minWidth: 48,
            textAlign: "right",
            marginRight: "2.5rem",
          }}
        >
          {year}
        </span>

        {/* VIEW button */}
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto inline-flex shrink-0 items-center gap-2 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{
              border: `2px solid ${isActive ? BG : INK}`,
              color: isActive ? BG : INK,
              background: "transparent",
              transition: "none",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isActive ? BG : INK;
              e.currentTarget.style.color = isActive ? ACCENT : BG;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = isActive ? BG : INK;
            }}
          >
            VIEW <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
          </a>
        ) : (
          <span
            className="inline-flex shrink-0 items-center gap-2 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] opacity-25"
            style={{ border: `2px solid ${isActive ? BG : INK}`, color: isActive ? BG : INK }}
          >
            SOON <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
          </span>
        )}
      </div>
    </div>
  );
});

/* ─── utility screens ───────────────────────────────────────────────────── */

function LoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-5 px-5 py-6"
          style={{ borderBottom: `2px solid ${INK}`, opacity: 0.2 }}
        >
          <span className="w-[68px] font-mono text-[10px] uppercase tracking-[0.22em]">
            P-{String(i + 1).padStart(3, "0")}
          </span>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: 32,
              letterSpacing: "-0.025em",
              textTransform: "uppercase",
            }}
          >
            LOADING…
          </span>
        </div>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <div className="px-5 py-24 text-center font-mono text-[11px] uppercase tracking-[0.3em] opacity-35">
      NO PROJECTS IN FEED
    </div>
  );
}

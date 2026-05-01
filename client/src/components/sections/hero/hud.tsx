import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface HudProps {
  available: boolean;
  location?: string | null;
  role: string;
  reducedMotion?: boolean;
}

const TERMINAL_LINES = [
  "> initializing portfolio.exe ...",
  "> loading neural shaders ...",
  "> handshake :: client ↔ host [OK]",
  "> systems nominal — awaiting input.",
];

function useTypingLoop(
  lines: string[],
  reducedMotion: boolean,
  speed = 38,
  pause = 1500,
) {
  const [output, setOutput] = useState<string[]>(reducedMotion ? lines : []);
  const indexRef = useRef({ line: 0, char: 0 });
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      setOutput(lines);
      return;
    }
    setOutput([""]);
    indexRef.current = { line: 0, char: 0 };

    const tick = () => {
      const { line, char } = indexRef.current;
      if (line >= lines.length) {
        // pause then restart
        timerRef.current = window.setTimeout(() => {
          indexRef.current = { line: 0, char: 0 };
          setOutput([""]);
          tick();
        }, pause * 2);
        return;
      }
      const current = lines[line];
      if (char < current.length) {
        const next = current.slice(0, char + 1);
        setOutput((prev) => {
          const copy = [...prev];
          copy[line] = next;
          return copy;
        });
        indexRef.current = { line, char: char + 1 };
        timerRef.current = window.setTimeout(tick, speed);
      } else {
        // line done, move to next
        indexRef.current = { line: line + 1, char: 0 };
        setOutput((prev) => [...prev, ""]);
        timerRef.current = window.setTimeout(tick, pause);
      }
    };
    timerRef.current = window.setTimeout(tick, 400);
    return () => {
      if (timerRef.current != null) clearTimeout(timerRef.current);
    };
  }, [lines, reducedMotion, speed, pause]);

  return output;
}

function Telemetry({ reducedMotion }: { reducedMotion?: boolean }) {
  const [fps, setFps] = useState(60);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    let frames = 0;
    let last = performance.now();
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      frames++;
      if (now - last >= 1000) {
        setFps(Math.min(120, frames));
        frames = 0;
        last = now;
      }
      setUptime(Math.floor((now - start) / 1000));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  const fmtUptime = (s: number) => {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  return (
    <div className="space-y-1 font-mono text-[10px] tracking-wider text-cyan-300/80">
      <div className="flex items-center justify-between gap-3">
        <span className="text-cyan-400/60">FPS</span>
        <span className="tabular-nums text-cyan-100">{fps}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-cyan-400/60">UPTIME</span>
        <span className="tabular-nums text-cyan-100">{fmtUptime(uptime)}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-cyan-400/60">SIGNAL</span>
        <span className="text-emerald-300">●●●●●</span>
      </div>
    </div>
  );
}

export function CornerBrackets() {
  const cls =
    "pointer-events-none absolute h-8 w-8 border-cyan-300/70 drop-shadow-[0_0_6px_rgba(0,240,255,0.45)]";
  return (
    <>
      <span aria-hidden className={cn(cls, "left-4 top-20 border-l-2 border-t-2")} />
      <span aria-hidden className={cn(cls, "right-4 top-20 border-r-2 border-t-2")} />
      <span aria-hidden className={cn(cls, "bottom-4 left-4 border-b-2 border-l-2")} />
      <span aria-hidden className={cn(cls, "bottom-4 right-4 border-b-2 border-r-2")} />
    </>
  );
}

export function ScanLines({ reducedMotion }: { reducedMotion?: boolean }) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,240,255,0.18) 0px, rgba(0,240,255,0.18) 1px, transparent 1px, transparent 4px)",
        }}
      />
      {!reducedMotion && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="hud-scan absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-cyan-300/10 to-transparent" />
        </div>
      )}
    </>
  );
}

export function StatusPanel({
  available,
  location,
  role,
  reducedMotion,
}: HudProps) {
  return (
    <div
      data-testid="hero-status-pill"
      className="pointer-events-auto inline-flex flex-col gap-2 rounded-md border border-cyan-300/30 bg-black/40 p-3 backdrop-blur-md shadow-[0_0_30px_rgba(0,240,255,0.15)]"
    >
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2 shrink-0">
          {available && !reducedMotion && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          )}
          <span
            className={cn(
              "relative inline-flex h-2 w-2 rounded-full",
              available ? "bg-emerald-400" : "bg-amber-400",
            )}
          />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-200">
          {available ? "System Online" : "Currently Booked"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[10px] tracking-wider">
        <span className="text-cyan-400/60">ROLE</span>
        <span className="truncate text-cyan-100">{role}</span>
        {location && (
          <>
            <span className="text-cyan-400/60">LOC</span>
            <span className="truncate text-cyan-100">{location}</span>
          </>
        )}
      </div>
      <div className="my-1 h-px w-full bg-cyan-300/20" />
      <Telemetry reducedMotion={reducedMotion} />
    </div>
  );
}

export function Terminal({ reducedMotion }: { reducedMotion?: boolean }) {
  const out = useTypingLoop(TERMINAL_LINES, !!reducedMotion);
  return (
    <div className="pointer-events-auto rounded-md border border-fuchsia-300/30 bg-black/40 p-3 backdrop-blur-md shadow-[0_0_30px_rgba(255,92,240,0.15)] w-full max-w-xs">
      <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-fuchsia-300">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-fuchsia-400 shadow-[0_0_6px_rgba(255,92,240,0.8)]" />
          tty/portfolio
        </span>
        <span className="text-fuchsia-400/50">v2.0</span>
      </div>
      <div className="space-y-0.5 font-mono text-[11px] leading-snug text-fuchsia-100/90">
        {out.map((line, i) => (
          <div key={i}>
            {line}
            {!reducedMotion && i === out.length - 1 && (
              <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-fuchsia-300 motion-safe:animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface TechChipsProps {
  items: string[];
  reducedMotion?: boolean;
}

interface ChipState {
  /** 0..1, 1 = cursor right on top of chip, 0 = far away */
  proximity: number;
  /** unit vector from chip center → cursor (used for tilt) */
  dx: number;
  dy: number;
}

/**
 * Tech chips that gently react to cursor proximity:
 *  - within ~180px the chip glows + lifts toward the cursor.
 *  - reducedMotion disables all per-frame work.
 */
export function TechChips({ items, reducedMotion }: TechChipsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [states, setStates] = useState<ChipState[]>(() =>
    items.map(() => ({ proximity: 0, dx: 0, dy: 0 })),
  );

  useEffect(() => {
    if (reducedMotion) return;
    const RADIUS = 180; // px — proximity falloff
    let raf = 0;
    let mouse = { x: -9999, y: -9999 };

    const onMove = (e: MouseEvent) => {
      mouse = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(update);
    };
    const update = () => {
      raf = 0;
      const next: ChipState[] = chipRefs.current.map((el) => {
        if (!el) return { proximity: 0, dx: 0, dy: 0 };
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const ddx = mouse.x - cx;
        const ddy = mouse.y - cy;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dist > RADIUS) return { proximity: 0, dx: 0, dy: 0 };
        const proximity = 1 - dist / RADIUS;
        const inv = dist || 1;
        return { proximity, dx: ddx / inv, dy: ddy / inv };
      });
      setStates(next);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className="flex flex-wrap gap-2">
      {items.map((label, i) => {
        const s = states[i] ?? { proximity: 0, dx: 0, dy: 0 };
        const lift = s.proximity * 6; // px toward cursor
        const scale = 1 + s.proximity * 0.08;
        const glowAlpha = 0.08 + s.proximity * 0.4;
        const borderAlpha = 0.3 + s.proximity * 0.6;
        const style = reducedMotion
          ? { animationDelay: `${(i % 4) * 0.4}s` }
          : {
              animationDelay: `${(i % 4) * 0.4}s`,
              transform: `translate3d(${s.dx * lift}px, ${s.dy * lift}px, 0) scale(${scale})`,
              transition: "transform 200ms ease-out, box-shadow 200ms ease-out, border-color 200ms ease-out",
              borderColor: `rgba(0, 240, 255, ${borderAlpha})`,
              boxShadow: `inset 0 0 10px rgba(0,240,255,${glowAlpha}), 0 0 ${s.proximity * 24}px rgba(0,240,255,${s.proximity * 0.55})`,
            };
        return (
          <span
            key={label}
            ref={(el) => {
              chipRefs.current[i] = el;
            }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-sm border border-cyan-300/30 bg-cyan-400/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-100 will-change-transform",
              "shadow-[inset_0_0_10px_rgba(0,240,255,0.08)]",
              !reducedMotion && "hud-chip-float",
            )}
            style={style}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(0,240,255,0.9)]" />
            {label}
          </span>
        );
      })}
    </div>
  );
}

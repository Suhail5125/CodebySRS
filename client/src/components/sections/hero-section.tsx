import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Github, Linkedin, Mail, Twitter, Instagram,
} from "lucide-react";
import type { AboutInfo } from "@shared";
import { Skeleton } from "@/components/ui/skeleton";

/* ─── Brand palette ───────────────────────────────────────────── */
const INK    = "#F2EFE6";
const BG     = "#0A0A0A";
const ACCENT = "#FF3D00";

/* ─── Expo-out cubic-bezier ───────────────────────────────────── */
const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── Roles for cycling ───────────────────────────────────────── */
const ROLES = [
  "CREATIVE DEVELOPER", "3D GENERALIST", "UI / UX DESIGNER",
  "FULL-STACK ENGINEER", "MOTION DESIGNER", "FRONTEND ARCHITECT",
  "WEBGL SPECIALIST", "BRAND ENGINEER", "SYSTEMS DESIGNER",
  "GENERATIVE ARTIST", "REACT SPECIALIST", "PERFORMANCE NERD",
];

/* ─── Fallbacks ───────────────────────────────────────────────── */
const FALLBACK = {
  github:    "https://github.com",
  linkedin:  "https://linkedin.com",
  twitter:   "https://twitter.com",
  instagram: "https://instagram.com",
  email:     "hello@codebysrs.dev",
};

interface HeroSectionProps {
  aboutInfo: AboutInfo | null;
  isLoading: boolean;
}

/* ════════════════════════════════════════════════════════════════
   CANVAS 2D WAVEFORM — pure Canvas 2D, zero GPU dependency.
   Five oscilloscope channels (cream + orange) that breathe and
   respond to mouse movement. This IS the background.
════════════════════════════════════════════════════════════════ */
const CHANNELS = [
  { y: 0.20, r: 242, g: 239, b: 230, a: 0.07, freq: 2.8, amp: 0.030, spd: 0.50, ph: 0.0 },
  { y: 0.36, r: 255, g:  61, b:   0, a: 0.14, freq: 4.5, amp: 0.020, spd: 0.95, ph: 1.4 },
  { y: 0.51, r: 242, g: 239, b: 230, a: 0.06, freq: 1.8, amp: 0.046, spd: 0.38, ph: 2.8 },
  { y: 0.66, r: 255, g:  61, b:   0, a: 0.09, freq: 6.2, amp: 0.015, spd: 1.70, ph: 0.7 },
  { y: 0.80, r: 242, g: 239, b: 230, a: 0.05, freq: 3.3, amp: 0.026, spd: 0.62, ph: 4.2 },
];

function WaveformBG({ mouseRef, paused }: {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  paused: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (paused) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t   = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const draw = () => {
      t += 0.007;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current?.x ?? 0;
      const my = mouseRef.current?.y ?? 0;

      for (const ch of CHANNELS) {
        const cy  = H * ch.y;
        const yInfluence = Math.max(0, 1 - Math.abs(my - (ch.y * 2 - 1)) * 1.4);
        const eAmp = H * ch.amp * (1 + yInfluence * 2.8);

        ctx.beginPath();
        const step = Math.max(2, Math.floor(W / 500));
        for (let x = 0; x <= W; x += step) {
          const nx = x / W;
          const xInf  = Math.max(0, 1 - Math.abs(nx - (mx * 0.5 + 0.5)) * 3.5);
          const fMod  = 1 + xInf * 0.9;
          const y = cy
            + Math.sin(nx * Math.PI * 2 * ch.freq * fMod  + t * ch.spd          + ch.ph) * eAmp
            + Math.sin(nx * Math.PI * 2 * ch.freq * 1.618 + t * ch.spd * 0.7    + ch.ph) * eAmp * 0.32
            + Math.sin(nx * Math.PI * 2 * ch.freq * 0.5   + t * ch.spd * 1.4    + ch.ph) * eAmp * 0.18;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }

        const g  = ctx.createLinearGradient(0, 0, W, 0);
        const cb = `rgba(${ch.r},${ch.g},${ch.b},`;
        g.addColorStop(0,    cb + "0)");
        g.addColorStop(0.07, cb + ch.a   + ")");
        g.addColorStop(0.5,  cb + ch.a * 1.7 + ")");
        g.addColorStop(0.93, cb + ch.a   + ")");
        g.addColorStop(1,    cb + "0)");
        ctx.strokeStyle = g;
        ctx.lineWidth   = 1.5;
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [paused, mouseRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
    />
  );
}

/* ════════════════════════════════════════════════════════════════
   SPOTLIGHT PORTRAITS — MYIMG2 base, MYIMG1 revealed inside a
   circular mask that follows the cursor.
════════════════════════════════════════════════════════════════ */
function SpotlightPortraits({
  spotlightRef,
  reducedMotion,
}: {
  spotlightRef: React.RefObject<HTMLDivElement>;
  reducedMotion: boolean;
}) {
  const imgStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    userSelect: "none",
    pointerEvents: "none",
  };

  const RADIUS = 240;
  const FEATHER = 60;
  const maskValue = `radial-gradient(circle ${RADIUS}px at var(--mx, -9999px) var(--my, -9999px), rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${
    ((RADIUS - FEATHER) / RADIUS) * 100
  }%, rgba(0,0,0,0) 100%)`;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] h-full w-full">
      {/* Base layer: MYIMG2 always visible */}
      <img src="/hero/myimg2.png" alt="" style={imgStyle} draggable={false} />

      {/* Top layer: MYIMG1 revealed only inside the spotlight */}
      {!reducedMotion && (
        <div
          ref={spotlightRef}
          className="absolute inset-0 h-full w-full"
          style={{
            opacity: 0,
            transition: "opacity 200ms ease-out",
            WebkitMaskImage: maskValue,
            maskImage: maskValue,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          }}
        >
          <img src="/hero/myimg1.png" alt="" style={imgStyle} draggable={false} />
        </div>
      )}

      {/* Contrast overlay so foreground text stays legible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.35) 45%, rgba(10,10,10,0.7) 100%)",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SKILLS TICKER
════════════════════════════════════════════════════════════════ */
const SKILLS = [
  "REACT", "TYPESCRIPT", "WEBGL", "THREE.JS", "NODE.JS", "NEXT.JS",
  "GSAP", "FRAMER MOTION", "TAILWIND", "POSTGRESQL", "FIGMA",
  "GLSL", "VITE", "DOCKER", "GRAPHQL", "CANVAS 2D", "CSS GRID",
];

function SkillsTicker({ paused }: { paused: boolean }) {
  const items = [...SKILLS, ...SKILLS];
  return (
    <div
      aria-hidden
      className="absolute bottom-0 inset-x-0 z-[5] overflow-hidden"
      style={{
        borderTop: `1px solid rgba(242,239,230,0.1)`,
        background: "rgba(10,10,10,0.55)",
        backdropFilter: "blur(4px)",
        height: 36,
      }}
    >
      <div
        className="flex items-center h-full whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.28em]"
        style={{
          animation: paused ? "none" : "hero-ticker 28s linear infinite",
          willChange: "transform",
        }}
      >
        {items.map((skill, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span style={{ color: i % SKILLS.length === 0 ? ACCENT : INK, opacity: 0.45 }}>
              {skill}
            </span>
            <span aria-hidden style={{ opacity: 0.18, margin: "0 1.2em" }}>·</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes hero-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   HERO SECTION
════════════════════════════════════════════════════════════════ */
export function HeroSection({ aboutInfo, isLoading }: HeroSectionProps) {
  const reducedMotion = !!useReducedMotion();

  const location  = (aboutInfo?.location ?? "GLOBAL").toUpperCase();
  const available = aboutInfo?.availableForWork ?? true;

  /* Mouse — stored in a ref so Canvas 2D and background rAF loops
     read it without causing React re-renders */
  const sectionRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const mouseRef   = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (reducedMotion) return;
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - r.left) / r.width  - 0.5) * 2,
        y: ((e.clientY - r.top)  / r.height - 0.5) * 2,
      };
      const sl = spotlightRef.current;
      if (sl) {
        sl.style.setProperty("--mx", `${e.clientX - r.left}px`);
        sl.style.setProperty("--my", `${e.clientY - r.top}px`);
        sl.style.opacity = "1";
      }
    };
    const onLeave = () => {
      mouseRef.current = { x: 0, y: 0 };
      const sl = spotlightRef.current;
      if (sl) sl.style.opacity = "0";
    };
    const onEnter = () => {
      const sl = spotlightRef.current;
      if (sl) sl.style.opacity = "1";
    };
    el.addEventListener("mousemove",  onMove,  { passive: true });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove",  onMove);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reducedMotion]);

  /* Flying headline — animates from large center into top-right corner position */
  const [headlineFlown, setHeadlineFlown] = useState(false);
  useEffect(() => {
    if (reducedMotion) { setHeadlineFlown(true); return; }
    const t1 = setTimeout(() => setHeadlineFlown(true), 500);
    return () => { clearTimeout(t1); };
  }, [reducedMotion]);

  /* Role cycling */
  const [roleIdx, setRoleIdx] = useState(0);
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setRoleIdx(i => (i + 1) % ROLES.length), 2000);
    return () => clearInterval(id);
  }, [reducedMotion]);

  /* Live clock */
  const clock = useNowEverySecond();

  /* Social links */
  const socials = [
    { href: aboutInfo?.githubUrl    || FALLBACK.github,    label: "GitHub",    Icon: Github    },
    { href: aboutInfo?.linkedinUrl  || FALLBACK.linkedin,  label: "LinkedIn",  Icon: Linkedin  },
    { href: aboutInfo?.twitterUrl   || FALLBACK.twitter,   label: "Twitter",   Icon: Twitter   },
    { href: aboutInfo?.instagramUrl || FALLBACK.instagram, label: "Instagram", Icon: Instagram },
    { href: aboutInfo?.email ? `mailto:${aboutInfo.email}` : `mailto:${FALLBACK.email}`, label: "Email", Icon: Mail },
  ];

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });


  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100svh", background: BG, color: INK }}
    >
      {/* ── LAYER 1: dual-portrait spotlight reveal ── */}
      <SpotlightPortraits spotlightRef={spotlightRef} reducedMotion={reducedMotion} />

      {/* ── LAYER 2: film grain ── */}
      <NoiseOverlay />

      {/* ── LAYER 3: faint column guides ── */}
      <GridLines />

      {/* ── LAYER 5: crosshair cursor ── */}
      {!reducedMotion && <HeroCursor container={sectionRef} />}

      {/* ═══════════════════════════════════════════════════
          FLYING "CODEBYSRS" — starts large and centred,
          flies up and shrinks into the banner headline slot.
          transformOrigin: right top → expands outward from
          the top-right corner where the real headline lives.
      ═══════════════════════════════════════════════════ */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute z-[7]"
        style={{
          right:           "clamp(20px, 2.5vw, 40px)",
          top:             "clamp(20px, 3vh, 50px)",
          transformOrigin: "right top",
          textAlign:       "right",
          fontFamily:      "Inter, sans-serif",
          fontWeight:      800,
          fontSize:        "clamp(36px, 6vw, 84px)",
          lineHeight:      0.92,
          letterSpacing:   "-0.035em",
          textTransform:   "uppercase",
          color:           INK,
          whiteSpace:      "nowrap",
        }}
        initial={{ scale: 2.6, y: "36vh", opacity: 0 }}
        animate={{
          scale:   headlineFlown ? 1    : 2.6,
          y:       headlineFlown ? 0    : "36vh",
          opacity: 1,
        }}
        transition={{
          scale:   { duration: headlineFlown ? 0.85 : 0.25, ease: EXPO },
          y:       { duration: headlineFlown ? 0.85 : 0.25, ease: EXPO },
          opacity: { duration: 0.35 },
        }}
      >
        CODEBYSRS
      </motion.div>

      {/* ═══════════════════════════════════════════════════
          CENTER STAGE: INFO-BAR + ANNOTATION
      ═══════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-[5] flex flex-col items-start justify-center px-5 lg:px-10"
        style={{ pointerEvents: "none" }}
      >
        {isLoading ? (
          <div className="w-full max-w-[58%] space-y-6">
            <Skeleton className="h-6 w-1/2 bg-white/10" />
            <Skeleton className="h-20 w-3/4 bg-white/10" />
            <Skeleton className="h-10 w-full bg-white/10" />
            <Skeleton className="h-8 w-2/5 bg-white/10" />
          </div>
        ) : (
          <div className="w-full max-w-full sm:max-w-[72%] lg:max-w-[56%]">

            {/* ── STATUS / ROLE / TIME bar ── */}
            <motion.div
              className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em]"
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reducedMotion ? 0 : 1.1, duration: 0.55, ease: EXPO }}
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block h-1.5 w-1.5 shrink-0 brut-blink"
                  style={{ background: available ? ACCENT : "#666" }}
                  aria-hidden
                />
                <span style={{ color: available ? ACCENT : INK, opacity: available ? 1 : 0.65 }}>
                  {available ? "AVAILABLE FOR WORK" : "CURRENTLY BOOKED"}
                </span>
              </span>
              <span aria-hidden style={{ opacity: 0.2 }}>·</span>
              <span className="flex items-center gap-1.5">
                <span style={{ opacity: 0.35 }}>ROLE</span>
                <span aria-hidden style={{ opacity: 0.2 }}>|</span>
                <ScrambleText text={ROLES[roleIdx]} runKey={roleIdx} durationMs={480} paused={reducedMotion} />
              </span>
              <span aria-hidden style={{ opacity: 0.2 }}>·</span>
              <span style={{ opacity: 0.4 }}>{clock}</span>
            </motion.div>

            {/* ── SOCIALS ROW ── */}
            <motion.div
              className="flex items-center gap-2"
              style={{ pointerEvents: "auto" }}
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reducedMotion ? 0 : 1.55, duration: 0.6, ease: EXPO }}
            >
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  data-testid={`link-${label.toLowerCase()}`}
                  className="group outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    border: `1px solid rgba(242,239,230,0.18)`,
                    color: INK,
                    opacity: 0.55,
                    transition: "opacity 0.15s, color 0.15s, border-color 0.15s",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.opacity = "1";
                    el.style.color = ACCENT;
                    el.style.borderColor = ACCENT;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.opacity = "0.55";
                    el.style.color = INK;
                    el.style.borderColor = "rgba(242,239,230,0.18)";
                  }}
                  onFocus={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.opacity = "1";
                    el.style.color = ACCENT;
                    el.style.borderColor = ACCENT;
                  }}
                  onBlur={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.opacity = "0.55";
                    el.style.color = INK;
                    el.style.borderColor = "rgba(242,239,230,0.18)";
                  }}
                >
                  <Icon size={14} strokeWidth={1.5} />
                </a>
              ))}
            </motion.div>

            {/* ── CTAs ── */}
            <motion.div
              className="mt-6 flex flex-wrap items-center gap-3"
              style={{ pointerEvents: "auto" }}
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reducedMotion ? 0 : 1.75, duration: 0.6, ease: EXPO }}
            >
              <BrutButton
                label="START PROJECT"
                onClick={() => scrollTo("#contact")}
                data-testid="button-lets-work-together"
                variant="solid"
              />
              <BrutButton
                label="VIEW WORK"
                onClick={() => scrollTo("#projects")}
                data-testid="button-view-work"
                variant="ghost"
              />
            </motion.div>

            {/* ── TERMINAL STRIP ── */}
            <motion.div
              className="mt-4 flex items-center font-mono text-[10px] uppercase tracking-[0.22em]"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reducedMotion ? 0 : 2.0, duration: 0.7, ease: EXPO }}
            >
              <span style={{ color: ACCENT, opacity: 0.6, marginRight: "0.5em" }}>&gt;&gt;&gt;</span>
              <span style={{ opacity: 0.3, marginRight: "0.5em" }}>NOW BUILDING</span>
              <span style={{ opacity: 0.6 }}>REACT · WEBGL · SYSTEMS</span>
              <BlinkingCursor paused={reducedMotion} />
            </motion.div>

          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════
          BOTTOM EDGE: skills ticker marquee
      ═══════════════════════════════════════════════════ */}
      <SkillsTicker paused={reducedMotion} />

    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   BLINKING CURSOR GLYPH
════════════════════════════════════════════════════════════════ */
function BlinkingCursor({ paused }: { paused: boolean }) {
  const [vis, setVis] = useState(true);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setVis(v => !v), 530);
    return () => clearInterval(id);
  }, [paused]);
  return (
    <span
      aria-hidden
      style={{
        display:         "inline-block",
        width:           "0.55em",
        height:          "1em",
        background:      INK,
        opacity:         vis ? 0.7 : 0,
        marginLeft:      "0.3em",
        verticalAlign:   "text-bottom",
      }}
    />
  );
}

/* ════════════════════════════════════════════════════════════════
   AMBIENT OVERLAYS
════════════════════════════════════════════════════════════════ */
function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[2] opacity-[0.07]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
          "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>" +
          "<feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter>" +
          "<rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        backgroundRepeat: "repeat",
      }}
    />
  );
}

function GridLines() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[2]">
      {[16.66, 33.33, 50, 66.66, 83.33].map(x => (
        <div
          key={x}
          className="absolute inset-y-0 w-px"
          style={{ left: `${x}%`, background: "rgba(242,239,230,0.03)" }}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   CUSTOM CROSSHAIR CURSOR
════════════════════════════════════════════════════════════════ */
function HeroCursor({ container }: { container: React.RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const root = container.current;
    if (!root) return;
    let raf = 0;
    let p   = { x: 0, y: 0 };
    const apply = () => {
      raf = 0;
      if (ref.current) ref.current.style.transform = `translate(${p.x - 14}px, ${p.y - 14}px)`;
    };
    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      p = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onEnter = () => setVis(true);
    const onLeave = () => setVis(false);
    root.addEventListener("mousemove",  onMove,  { passive: true });
    root.addEventListener("mouseenter", onEnter);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      root.removeEventListener("mousemove",  onMove);
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
        opacity: vis ? 1 : 0,
        transition: "opacity 0.15s",
        willChange: "transform",
        mixBlendMode: "difference",
      }}
    >
      <span className="absolute inset-0 border" style={{ borderColor: ACCENT }} />
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2" style={{ background: ACCENT, opacity: 0.7 }} />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2"  style={{ background: ACCENT, opacity: 0.7 }} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   UI ATOMS
════════════════════════════════════════════════════════════════ */
interface BrutButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "solid" | "ghost";
  "data-testid"?: string;
}
function BrutButton({ label, onClick, variant = "solid", "data-testid": tid }: BrutButtonProps) {
  const [hov, setHov] = useState(false);
  const solid = variant === "solid";
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={tid}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onFocus={() => setHov(true)}
      onBlur={() => setHov(false)}
      className="inline-flex items-center gap-2 px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
      style={{
        borderRadius: 0,
        background:  solid ? (hov ? ACCENT  : INK)         : (hov ? INK  : "transparent"),
        color:       solid ? (hov ? INK     : BG)           : (hov ? BG   : INK),
        border:      `2px solid ${INK}`,
        opacity:     1,
        transition:  "none",
      }}
    >
      <span aria-hidden style={{ opacity: 0.6 }}>[</span>
      {label}
      <span aria-hidden style={{ opacity: 0.6 }}>]</span>
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════
   HOOKS
════════════════════════════════════════════════════════════════ */
function useNowEverySecond() {
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

/* ── ScrambleText ───────────────────────────────────────────── */
function useScramble(target: string, durationMs: number, runKey: number | string, paused: boolean) {
  const [out, setOut] = useState(target);
  useEffect(() => {
    if (paused) { setOut(target); return; }
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░<>/\\";
    const start  = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t    = Math.min(1, (now - start) / durationMs);
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
      else        setOut(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs, runKey, paused]);
  return out;
}

interface ScrambleTextProps {
  text: string;
  runKey?: number | string;
  durationMs?: number;
  paused?: boolean;
}
function ScrambleText({ text, runKey = 0, durationMs = 800, paused = false }: ScrambleTextProps) {
  const out = useScramble(text, durationMs, runKey, paused);
  return <span style={{ display: "inline-block", whiteSpace: "pre" }}>{out || "\u00A0"}</span>;
}

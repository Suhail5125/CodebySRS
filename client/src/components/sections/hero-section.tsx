import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Github, Linkedin, Mail, Twitter, Instagram,
} from "lucide-react";
import type { AboutInfo } from "@shared";

/* ─── Brand palette ───────────────────────────────────────────── */
const INK    = "#F2EFE6";
const BG     = "#0A0A0A";
const ACCENT = "#FF3D00";

/* ─── Expo-out cubic-bezier ───────────────────────────────────── */
const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── Roles for scramble cycling ─────────────────────────────── */
const ROLES = [
  "CREATIVE DEVELOPER",
  "FULL-STACK ENGINEER",
  "WEBGL SPECIALIST",
  "MOTION DESIGNER",
  "FRONTEND ARCHITECT",
  "3D GENERALIST",
  "UI / UX DESIGNER",
  "SYSTEMS DESIGNER",
  "REACT SPECIALIST",
  "GENERATIVE ARTIST",
];

/* ─── Left marquee text ───────────────────────────────────────── */
const MARQUEE_WORDS = [
  "DESIGN", "·", "CODE", "·", "CRAFT", "·", "BUILD", "·",
  "SHIP", "·", "ITERATE", "·", "LAUNCH", "·", "REPEAT", "·",
];

/* ─── Social fallbacks ────────────────────────────────────────── */
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
   SPOTLIGHT DUAL-PORTRAIT MASK
   Base image (myimg2) always visible; alt image (myimg1)
   revealed inside a radial gradient that follows the cursor.
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

  const RADIUS  = 260;
  const FEATHER = 70;
  const maskValue = `radial-gradient(circle ${RADIUS}px at var(--mx, -9999px) var(--my, -9999px), rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${
    ((RADIUS - FEATHER) / RADIUS) * 100
  }%, rgba(0,0,0,0) 100%)`;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] h-full w-full">
      <img src="/hero/myimg2.png" alt="" style={imgStyle} draggable={false} />

      {!reducedMotion && (
        <div
          ref={spotlightRef}
          className="absolute inset-0 h-full w-full"
          style={{
            opacity: 0,
            transition: "opacity 180ms ease-out",
            WebkitMaskImage: maskValue,
            maskImage: maskValue,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          }}
        >
          <img src="/hero/myimg1.png" alt="" style={imgStyle} draggable={false} />
        </div>
      )}

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.3) 45%, rgba(10,10,10,0.75) 100%)",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   NOISE OVERLAY (film grain)
════════════════════════════════════════════════════════════════ */
function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[2] opacity-[0.06]"
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

/* ════════════════════════════════════════════════════════════════
   GRID COLUMN GUIDES (very faint)
════════════════════════════════════════════════════════════════ */
function GridLines() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[2]">
      {[16.66, 33.33, 50, 66.66, 83.33].map(x => (
        <div
          key={x}
          className="absolute inset-y-0 w-px"
          style={{ left: `${x}%`, background: "rgba(242,239,230,0.025)" }}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   CROSSHAIR CURSOR
════════════════════════════════════════════════════════════════ */
function HeroCursor({ container }: { container: React.RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const root = container.current;
    if (!root) return;
    let raf = 0;
    let p = { x: 0, y: 0 };
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
      className="pointer-events-none absolute left-0 top-0 z-[8] h-7 w-7"
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
   VERTICAL LEFT MARQUEE
════════════════════════════════════════════════════════════════ */
function LeftMarquee({ paused }: { paused: boolean }) {
  const items = [...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-[5] flex h-full w-8 items-center justify-center overflow-hidden"
      style={{ borderRight: "1px solid rgba(242,239,230,0.07)" }}
    >
      <div
        className="flex flex-col items-center gap-3 font-mono text-[9px] uppercase tracking-[0.32em] whitespace-nowrap"
        style={{
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          animation: paused ? "none" : "left-marquee 18s linear infinite",
          color: INK,
          opacity: 0.22,
        }}
      >
        {items.map((word, i) => (
          <span key={i} style={{ color: word === "·" ? ACCENT : INK }}>{word}</span>
        ))}
      </div>
      <style>{`
        @keyframes left-marquee {
          from { transform: rotate(180deg) translateY(0); }
          to   { transform: rotate(180deg) translateY(-33.333%); }
        }
      `}</style>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   CTA BUTTON
════════════════════════════════════════════════════════════════ */
interface BrutButtonProps {
  label: string;
  onClick?: () => void;
  "data-testid"?: string;
}
function BrutButton({ label, onClick, "data-testid": tid }: BrutButtonProps) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={tid}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onFocus={() => setHov(true)}
      onBlur={() => setHov(false)}
      className="inline-flex items-center gap-2 px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.22em] outline-none focus-visible:ring-2"
      style={{
        background:  hov ? ACCENT : INK,
        color:       hov ? INK    : BG,
        border:      "none",
        transition:  "background 0.18s, color 0.18s",
        cursor:      "pointer",
      }}
    >
      {label}
      <span aria-hidden style={{ opacity: 0.6, fontSize: "0.85em" }}>↗</span>
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════
   SCRAMBLE TEXT HOOK + COMPONENT
════════════════════════════════════════════════════════════════ */
function useScramble(target: string, durationMs: number, runKey: number | string, paused: boolean) {
  const [out, setOut] = useState(target);
  useEffect(() => {
    if (paused) { setOut(target); return; }
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░<>/\\!@#";
    const start  = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t    = Math.min(1, (now - start) / durationMs);
      const head = Math.floor(t * (target.length + 6));
      let s = "";
      for (let i = 0; i < target.length; i++) {
        const ch = target[i];
        if (i < head - 6)  s += ch;
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

function ScrambleText({ text, runKey = 0, durationMs = 900, paused = false }: {
  text: string;
  runKey?: number | string;
  durationMs?: number;
  paused?: boolean;
}) {
  const out = useScramble(text, durationMs, runKey, paused);
  return <span style={{ display: "inline-block", whiteSpace: "pre" }}>{out || "\u00A0"}</span>;
}

/* ════════════════════════════════════════════════════════════════
   BLINKING CURSOR
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
        display: "inline-block",
        width: "0.5em",
        height: "1em",
        background: ACCENT,
        opacity: vis ? 0.85 : 0,
        marginLeft: "0.25em",
        verticalAlign: "text-bottom",
        transition: "opacity 0.05s",
      }}
    />
  );
}

/* ════════════════════════════════════════════════════════════════
   HERO SECTION
════════════════════════════════════════════════════════════════ */
export function HeroSection({ aboutInfo, isLoading }: HeroSectionProps) {
  const reducedMotion = !!useReducedMotion();
  const available     = aboutInfo?.availableForWork ?? true;

  /* Refs */
  const sectionRef   = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const mouseRef     = useRef({ x: 0, y: 0 });

  /* Cursor / spotlight tracking */
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
      if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
    };
    const onEnter = () => {
      if (spotlightRef.current) spotlightRef.current.style.opacity = "1";
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

  /* Flying CODEBYSRS headline */
  const [headlineFlown, setHeadlineFlown] = useState(false);
  useEffect(() => {
    if (reducedMotion) { setHeadlineFlown(true); return; }
    const t = setTimeout(() => setHeadlineFlown(true), 500);
    return () => clearTimeout(t);
  }, [reducedMotion]);

  /* Role cycling */
  const [roleIdx, setRoleIdx] = useState(0);
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setRoleIdx(i => (i + 1) % ROLES.length), 2800);
    return () => clearInterval(id);
  }, [reducedMotion]);

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
      style={{ minHeight: "100svh", background: BG, color: INK, cursor: "none" }}
    >
      {/* ── Background layers ── */}
      <SpotlightPortraits spotlightRef={spotlightRef} reducedMotion={reducedMotion} />
      <NoiseOverlay />
      <GridLines />

      {/* ── Custom crosshair cursor ── */}
      {!reducedMotion && <HeroCursor container={sectionRef} />}

      {/* ── Vertical left-edge marquee ── */}
      <LeftMarquee paused={reducedMotion} />

      {/* ═══════════════════════════════════════════════════
          FLYING "CODEBYSRS" — shrinks into top-right corner
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
          MAIN CONTENT — centre-left stack
      ═══════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-[5] flex flex-col justify-center"
        style={{ pointerEvents: "none", paddingLeft: "clamp(48px, 5vw, 80px)" }}
      >
        {isLoading ? (
          <div className="ml-4 space-y-6">
            <div className="h-4 w-36 rounded-sm bg-white/10 animate-pulse" />
            <div className="h-24 w-[420px] max-w-full rounded-sm bg-white/10 animate-pulse" />
            <div className="h-8 w-48 rounded-sm bg-white/10 animate-pulse" />
            <div className="h-4 w-28 rounded-sm bg-white/10 animate-pulse" />
          </div>
        ) : (
          <div className="max-w-[680px]">

            {/* STATUS */}
            <motion.div
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]"
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reducedMotion ? 0 : 0.55, duration: 0.5, ease: EXPO }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{
                  background: available ? ACCENT : "#666",
                  boxShadow:  available ? `0 0 6px ${ACCENT}` : "none",
                  animation:  available && !reducedMotion ? "status-pulse 2s ease-in-out infinite" : "none",
                }}
                aria-hidden
              />
              <span style={{ color: available ? ACCENT : INK, opacity: available ? 1 : 0.55 }}>
                {available ? "Available for work" : "Currently booked"}
              </span>
            </motion.div>

            {/* TITLE with scramble animation */}
            <motion.h1
              className="mt-5 font-sans font-semibold uppercase leading-[0.9] tracking-[-0.04em]"
              style={{ fontSize: "clamp(2.8rem, 7.5vw, 7rem)", color: INK }}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reducedMotion ? 0 : 0.8, duration: 0.8, ease: EXPO }}
            >
              <ScrambleText
                text={ROLES[roleIdx]}
                runKey={roleIdx}
                durationMs={850}
                paused={reducedMotion}
              />
              <BlinkingCursor paused={reducedMotion} />
            </motion.h1>

            {/* SOCIAL ICONS */}
            <motion.div
              className="mt-7 flex items-center gap-2"
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reducedMotion ? 0 : 1.15, duration: 0.5, ease: EXPO }}
              style={{ pointerEvents: "auto" }}
            >
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  data-testid={`link-${label.toLowerCase()}`}
                  style={{
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    width:          40,
                    height:         40,
                    border:         `1px solid rgba(242,239,230,0.16)`,
                    color:          INK,
                    opacity:        0.5,
                    transition:     "opacity 0.18s, color 0.18s, border-color 0.18s",
                    outline:        "none",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.opacity = "1"; el.style.color = ACCENT; el.style.borderColor = ACCENT;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.opacity = "0.5"; el.style.color = INK; el.style.borderColor = "rgba(242,239,230,0.16)";
                  }}
                  onFocus={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.opacity = "1"; el.style.color = ACCENT; el.style.borderColor = ACCENT;
                  }}
                  onBlur={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.opacity = "0.5"; el.style.color = INK; el.style.borderColor = "rgba(242,239,230,0.16)";
                  }}
                >
                  <Icon size={15} strokeWidth={1.5} />
                </a>
              ))}
            </motion.div>

            {/* NOW BUILDING */}
            <motion.div
              className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em]"
              style={{ opacity: 0.4 }}
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 0.4, y: 0 }}
              transition={{ delay: reducedMotion ? 0 : 1.35, duration: 0.5, ease: EXPO }}
            >
              <span style={{ color: ACCENT }}>&gt;&gt;&gt;</span>
              <span>Now building</span>
            </motion.div>

            {/* HOVER HELPER — slightly offset below title area */}
            {!reducedMotion && (
              <motion.div
                className="mt-12 font-mono text-[9px] uppercase tracking-[0.35em]"
                style={{ color: INK, opacity: 0.22 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.22 }}
                transition={{ delay: 2.2, duration: 1.2, ease: EXPO }}
              >
                Move cursor to explore
              </motion.div>
            )}

          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════
          BOTTOM-LEFT: CTA button
      ═══════════════════════════════════════════════════ */}
      <motion.div
        className="absolute bottom-10 z-[6]"
        style={{
          left:          "clamp(48px, 5vw, 80px)",
          pointerEvents: "auto",
        }}
        initial={reducedMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reducedMotion ? 0 : 1.7, duration: 0.6, ease: EXPO }}
      >
        <BrutButton
          label="Start a project"
          onClick={() => scrollTo("#contact")}
          data-testid="button-lets-work-together"
        />
      </motion.div>

      {/* ═══════════════════════════════════════════════════
          BOTTOM-RIGHT: Scroll prompt
      ═══════════════════════════════════════════════════ */}
      <motion.div
        className="absolute bottom-10 right-6 z-[6] flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em]"
        style={{ opacity: 0.35, color: INK }}
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 0.35, y: 0 }}
        transition={{ delay: reducedMotion ? 0 : 1.9, duration: 0.6, ease: EXPO }}
        aria-hidden
      >
        <span style={{ color: ACCENT }}>↑↓</span>
        <span>Scroll to explore</span>
      </motion.div>

      {/* ── bottom thin rule ── */}
      <div
        aria-hidden
        className="absolute bottom-0 inset-x-0 z-[4]"
        style={{ height: 1, background: "rgba(242,239,230,0.07)" }}
      />

      {/* ── CSS for pulsing status dot ── */}
      <style>{`
        @keyframes status-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
      `}</style>
    </section>
  );
}

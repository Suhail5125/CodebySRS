import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Github, Linkedin, Mail, Twitter, Instagram, ArrowUpRight,
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
    objectFit: "contain",
    objectPosition: "right center",
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

      {/* Contrast overlay — stronger on the left where copy lives,
          softer on the right where the portrait should breathe. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.55) 45%, rgba(10,10,10,0.15) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-32"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.85) 100%)",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   LETTER — one character with a CSS 3D flip entrance + live
   mouse-tracking that fans each letter outward from center.
════════════════════════════════════════════════════════════════ */
interface LetterProps {
  char: string;
  index: number;
  total: number;
  delay: number;
  fromX: number;
  fromY: number;
  mouseRef: React.RefObject<{ x: number; y: number }>;
  paused: boolean;
  color?: string;
}

function AnimLetter({ char, index, total, delay, fromX, fromY, mouseRef, paused, color = INK }: LetterProps) {
  const divRef = useRef<HTMLDivElement>(null);

  /* Apply mouse-driven 3D rotation via rAF to avoid React re-renders */
  useEffect(() => {
    if (paused) return;
    let raf = 0;
    const factor = ((index / Math.max(total - 1, 1)) - 0.5) * 2; // -1 … +1

    const tick = () => {
      if (divRef.current) {
        const mx = mouseRef.current?.x ?? 0;
        const my = mouseRef.current?.y ?? 0;
        divRef.current.style.transform =
          `perspective(700px) rotateY(${factor * mx * 9}deg) rotateX(${my * -4}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [paused, index, total, mouseRef]);

  if (char === " ") {
    return <span style={{ display: "inline-block", width: "0.22em" }} aria-hidden />;
  }

  return (
    <div
      ref={divRef}
      style={{ display: "inline-block", transformStyle: "preserve-3d", willChange: "transform" }}
    >
      <motion.span
        style={{ display: "inline-block", color }}
        initial={paused ? false : { opacity: 0, x: fromX, y: fromY, rotateX: -80 }}
        animate={{ opacity: 1, x: 0, y: 0, rotateX: 0 }}
        transition={{ delay, duration: 0.85, ease: EXPO }}
      >
        {char}
      </motion.span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   HERO SECTION
════════════════════════════════════════════════════════════════ */
export function HeroSection({ aboutInfo, isLoading }: HeroSectionProps) {
  const reducedMotion = !!useReducedMotion();

  const firstName = (aboutInfo?.name?.split(" ")[0] ?? "DEVELOPER").toUpperCase();
  const lastName  = (aboutInfo?.name?.split(" ").slice(1).join(" ") ?? "ENGINEER").toUpperCase() || "ENGINEER";
  const fullName  = `${firstName} ${lastName}`;
  const bio       = aboutInfo?.bio ?? "Building modern web experiences — interfaces, interactions, and the systems that hold them together.";
  const location  = (aboutInfo?.location ?? "GLOBAL").toUpperCase();
  const available = aboutInfo?.availableForWork ?? true;

  /* Mouse — stored in a ref so Canvas 2D + AnimLetter rAF loops
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

  /* Pre-generate per-letter entrance vectors */
  const firstLetterData = useMemo(() =>
    firstName.split("").map(() => ({
      fromX: (Math.random() - 0.5) * 280,
      fromY: Math.random() < 0.5 ? -(160 + Math.random() * 120) : (160 + Math.random() * 120),
    })), [firstName]);

  const lastLetterData = useMemo(() =>
    lastName.split("").map(() => ({
      fromX: (Math.random() - 0.5) * 280,
      fromY: Math.random() < 0.5 ? -(160 + Math.random() * 120) : (160 + Math.random() * 120),
    })), [lastName]);

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
    { Icon: Github,    href: aboutInfo?.githubUrl    || FALLBACK.github,    label: "GitHub"    },
    { Icon: Linkedin,  href: aboutInfo?.linkedinUrl  || FALLBACK.linkedin,  label: "LinkedIn"  },
    { Icon: Twitter,   href: aboutInfo?.twitterUrl   || FALLBACK.twitter,   label: "Twitter"   },
    { Icon: Instagram, href: aboutInfo?.instagramUrl || FALLBACK.instagram, label: "Instagram" },
    { Icon: Mail,      href: aboutInfo?.email        ? `mailto:${aboutInfo.email}` : `mailto:${FALLBACK.email}`, label: "Email" },
  ];

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  /* Total letter counts for perspective fanning */
  const fn = firstName.split("");
  const ln = lastName.split("");

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: "calc(100svh - 4.5rem)", height: "calc(100svh - 4.5rem)", background: BG, color: INK }}
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
          ABSOLUTE SATELLITE ELEMENTS
      ═══════════════════════════════════════════════════ */}

      {/* TOP-LEFT: brand mark + availability badge */}
      <motion.div
        className="absolute left-5 top-5 z-[8] flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em]"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <span style={{ opacity: 0.5 }}>
          <span style={{ color: ACCENT }}>◆</span>{" "}CODEBYSRS
        </span>
        <span className="hidden sm:inline opacity-25">/</span>
        <span className="hidden sm:inline-flex items-center gap-1.5" style={{ opacity: 0.6 }}>
          <span
            className="inline-block h-1.5 w-1.5 brut-blink"
            style={{ background: available ? ACCENT : "#666" }}
            aria-hidden
          />
          {available ? "AVAILABLE" : "BOOKED"} · {location}
        </span>
      </motion.div>

      {/* TOP-RIGHT: section ID + live clock */}
      <motion.div
        className="absolute right-5 top-5 z-[5] flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em]"
        initial={reducedMotion ? false : { opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.9, duration: 0.6, ease: EXPO }}
      >
        <span style={{ color: ACCENT }}>[ SECTION 01 ]</span>
        <span className="opacity-30">/</span>
        <span className="opacity-50">HERO</span>
        <span className="hidden tabular-nums opacity-30 md:inline">{clock}</span>
      </motion.div>

      {/* ═══════════════════════════════════════════════════
          CENTER STAGE: THE NAME
          Absolutely centered — this is the gravitational
          core of the entire composition.
      ═══════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-[5] flex flex-col items-start justify-center px-5 lg:px-10"
        style={{ pointerEvents: "none" }}
      >
        {isLoading ? (
          <div className="w-full max-w-[58%] space-y-6">
            <Skeleton className="h-24 w-3/4 bg-white/10" />
            <Skeleton className="h-24 w-full bg-white/10" />
          </div>
        ) : (
          <div className="w-full max-w-full sm:max-w-[70%] lg:max-w-[55%]">
            {/* tiny annotation above the name */}
            <motion.p
              className="mb-3 font-mono text-[10px] uppercase tracking-[0.45em]"
              style={{ color: ACCENT, opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              // PORTFOLIO · {new Date().getFullYear()}
            </motion.p>

            <h1
              data-testid="hero-name"
              className="select-none uppercase"
              style={{
                fontWeight:    900,
                fontSize:      "clamp(2.8rem, 7.5vw, 8.5rem)",
                lineHeight:    0.88,
                letterSpacing: "-0.04em",
                width:         "100%",
              }}
            >
              {/* ── FIRST NAME ── */}
              <span className="block" aria-label={firstName}>
                {fn.map((ch, i) => (
                  <AnimLetter
                    key={`fn-${i}`}
                    char={ch}
                    index={i}
                    total={fn.length}
                    delay={reducedMotion ? 0 : 0.42 + i * 0.07}
                    fromX={firstLetterData[i]?.fromX ?? 0}
                    fromY={firstLetterData[i]?.fromY ?? -120}
                    mouseRef={mouseRef}
                    paused={reducedMotion}
                    color={INK}
                  />
                ))}
              </span>

              {/* ── LAST NAME with short orange underline beneath ── */}
              <span className="block" aria-label={lastName}>
                {ln.map((ch, i) => (
                  <AnimLetter
                    key={`ln-${i}`}
                    char={ch}
                    index={i}
                    total={ln.length}
                    delay={reducedMotion ? 0 : 0.65 + fn.length * 0.07 + i * 0.07}
                    fromX={lastLetterData[i]?.fromX ?? 0}
                    fromY={lastLetterData[i]?.fromY ?? 120}
                    mouseRef={mouseRef}
                    paused={reducedMotion}
                    color={INK}
                  />
                ))}
              </span>
              <motion.span
                aria-hidden
                className="mt-2 block"
                style={{
                  width:           "clamp(80px, 18%, 200px)",
                  height:          "clamp(4px, 0.45vw, 8px)",
                  background:      ACCENT,
                  transformOrigin: "left center",
                }}
                initial={reducedMotion ? false : { scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.9 }}
                transition={{ delay: 0.55 + fn.length * 0.07, duration: 0.9, ease: EXPO }}
              />
            </h1>

            {/* hidden bio for screen readers */}
            <p data-testid="hero-bio" className="sr-only">{bio}</p>

            {/* ── annotation strip below name ── */}
            <motion.div
              className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.25em]"
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reducedMotion ? 0 : 1.6 + fn.length * 0.07, duration: 0.7, ease: EXPO }}
            >
              <span style={{ color: ACCENT }}>//</span>
              <span className="opacity-45">NOW BUILDING</span>
              <span className="opacity-20">·</span>
              <span
                className="lg:hidden font-mono text-[11px]"
                style={{ opacity: 0.55 }}
              >
                <ScrambleText text={ROLES[roleIdx]} runKey={roleIdx} durationMs={480} paused={reducedMotion} />
              </span>
              <span className="hidden lg:inline opacity-55">
                <ScrambleText text={ROLES[roleIdx]} runKey={roleIdx} durationMs={480} paused={reducedMotion} />
              </span>
            </motion.div>

            {/* ── CTAs (left-anchored, pointer-events on so clickable) ── */}
            <motion.div
              className="mt-8 flex flex-wrap items-center gap-3"
              style={{ pointerEvents: "auto" }}
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.1, duration: 0.6, ease: EXPO }}
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
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════
          BOTTOM SATELLITES — social + CTAs — absolutely
          anchored to the bottom edge, NOT in a strip row.
      ═══════════════════════════════════════════════════ */}

      {/* BOTTOM-LEFT: social links */}
      <motion.div
        className="absolute bottom-6 left-5 z-[8] flex flex-wrap items-center gap-3"
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 0.6, ease: EXPO }}
      >
        {socials.map(({ Icon, href, label }) => (
          <SocialLink key={label} Icon={Icon} href={href} label={label} />
        ))}
      </motion.div>

    </section>
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

function Scanline() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
      <div
        className="absolute inset-x-0 h-px brut-scan"
        style={{ background: ACCENT, opacity: 0.45, boxShadow: `0 0 6px ${ACCENT}` }}
      />
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
        background:  solid ? (hov ? ACCENT  : INK)         : (hov ? INK  : "transparent"),
        color:       solid ? (hov ? INK     : BG)           : (hov ? BG   : INK),
        border:      `2px solid ${INK}`,
        transition:  "none",
      }}
    >
      {label}
      <ArrowUpRight className="h-3.5 w-3.5" />
    </button>
  );
}

function SocialLink({ Icon, href, label }: { Icon: typeof Github; href: string; label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-testid={`link-${label.toLowerCase()}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onFocus={() => setHov(true)}
      onBlur={() => setHov(false)}
      className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] outline-none focus-visible:underline"
      style={{
        color:   hov ? ACCENT : INK,
        opacity: hov ? 1 : 0.5,
        transition: "none",
      }}
    >
      <Icon className="h-3 w-3 shrink-0" />
      <span className="hidden sm:inline">{label}</span>
    </a>
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

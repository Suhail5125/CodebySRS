import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Github, Linkedin, Mail, Twitter, Instagram,
} from "lucide-react";
import type { AboutInfo } from "@shared";
import { Skeleton } from "@/components/ui/skeleton";

/* ─── palette ─────────────────────────────────────────────────── */
const INK    = "#F2EFE6";
const BG     = "#0A0A0A";
const ACCENT = "#FF3D00";

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const ROLES = [
  "CREATIVE DEVELOPER", "3D GENERALIST", "UI / UX DESIGNER",
  "FRONTEND ARCHITECT", "WEBGL SPECIALIST", "SYSTEMS DESIGNER",
  "GENERATIVE ARTIST", "PERFORMANCE ENGINEER",
];

const FALLBACK = {
  github:    "https://github.com",
  linkedin:  "https://linkedin.com",
  twitter:   "https://twitter.com",
  instagram: "https://instagram.com",
  email:     "hello@codebysrs.dev",
};

/* ═══════════════════════════════════════════════════════════════
   COMBINED HERO BACKGROUND — single Canvas 2D draw loop:

   PASS 1 — Magnetic dot grid
     Dots spring away from cursor, glow orange when near.

   PASS 2 — Oscilloscope waveform channels
     Five sine channels (cream + orange), drawn ON TOP of the
     dots with edge-fade gradients. Mouse Y amplifies nearby
     channels, mouse X warps their local frequency.

   Both effects share one rAF loop — zero GPU, works everywhere.
═══════════════════════════════════════════════════════════════ */
interface Dot { rx: number; ry: number; cx: number; cy: number; vx: number; vy: number; }

const WAVE_CHANNELS = [
  { y: 0.22, r: 242, g: 239, b: 230, a: 0.09, freq: 2.8, amp: 0.030, spd: 0.50, ph: 0.0 },
  { y: 0.38, r: 255, g:  61, b:   0, a: 0.16, freq: 4.5, amp: 0.020, spd: 0.95, ph: 1.4 },
  { y: 0.52, r: 242, g: 239, b: 230, a: 0.07, freq: 1.9, amp: 0.045, spd: 0.38, ph: 2.8 },
  { y: 0.66, r: 255, g:  61, b:   0, a: 0.11, freq: 6.1, amp: 0.016, spd: 1.65, ph: 0.7 },
  { y: 0.80, r: 242, g: 239, b: 230, a: 0.06, freq: 3.3, amp: 0.026, spd: 0.62, ph: 4.2 },
];

function HeroBG({
  mousePxRef,
  mouseRef,
  paused,
}: {
  mousePxRef: React.RefObject<{ x: number; y: number }>;
  mouseRef:   React.RefObject<{ x: number; y: number }>;
  paused: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef   = useRef<Dot[]>([]);

  useEffect(() => {
    if (paused) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t   = 0;

    /* ── dot grid constants ── */
    const SPACING  = 38;
    const RADIUS   = 120;
    const STRENGTH = 0.52;
    const SPRING   = 0.08;
    const DAMP     = 0.75;

    const buildGrid = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const dots: Dot[] = [];
      for (let r = 0; r <= Math.ceil(H / SPACING); r++) {
        for (let c = 0; c <= Math.ceil(W / SPACING); c++) {
          const rx = c * SPACING;
          const ry = r * SPACING;
          dots.push({ rx, ry, cx: rx, cy: ry, vx: 0, vy: 0 });
        }
      }
      dotsRef.current = dots;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      buildGrid();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const draw = () => {
      t += 0.007;
      const W  = canvas.offsetWidth;
      const H  = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const mx  = mousePxRef.current?.x ?? -9999;
      const my  = mousePxRef.current?.y ?? -9999;
      const mnx = mouseRef.current?.x   ?? 0;   /* −1…+1 */
      const mny = mouseRef.current?.y   ?? 0;

      /* ── PASS 1: dots ── */
      for (const d of dotsRef.current) {
        const dx  = mx - d.rx;
        const dy  = my - d.ry;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const inf  = Math.max(0, 1 - dist / RADIUS);

        const tx = d.rx - dx * inf * STRENGTH;
        const ty = d.ry - dy * inf * STRENGTH;
        d.vx = (d.vx + (tx - d.cx) * SPRING) * DAMP;
        d.vy = (d.vy + (ty - d.cy) * SPRING) * DAMP;
        d.cx += d.vx;
        d.cy += d.vy;

        const size    = 1.4 + inf * 2.4;
        const opacity = 0.05 + inf * 0.30;
        const dr = inf > 0.1 ? 255 : 242;
        const dg = inf > 0.1 ?  61 : 239;
        const db = inf > 0.1 ?   0 : 230;

        ctx.beginPath();
        ctx.arc(d.cx, d.cy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dr},${dg},${db},${opacity})`;
        ctx.fill();
      }

      /* ── PASS 2: waveform channels ── */
      const step = Math.max(2, Math.floor(W / 480));
      for (const ch of WAVE_CHANNELS) {
        const cy       = H * ch.y;
        const yInf     = Math.max(0, 1 - Math.abs(mny - (ch.y * 2 - 1)) * 1.3);
        const eAmp     = H * ch.amp * (1 + yInf * 2.6);

        ctx.beginPath();
        for (let x = 0; x <= W; x += step) {
          const nx   = x / W;
          const xInf = Math.max(0, 1 - Math.abs(nx - (mnx * 0.5 + 0.5)) * 3.5);
          const fMod = 1 + xInf * 0.85;
          const y = cy
            + Math.sin(nx * Math.PI * 2 * ch.freq * fMod  + t * ch.spd         + ch.ph) * eAmp
            + Math.sin(nx * Math.PI * 2 * ch.freq * 1.618 + t * ch.spd * 0.7   + ch.ph) * eAmp * 0.30
            + Math.sin(nx * Math.PI * 2 * ch.freq * 0.5   + t * ch.spd * 1.4   + ch.ph) * eAmp * 0.16;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }

        /* edge-fade gradient */
        const g  = ctx.createLinearGradient(0, 0, W, 0);
        const cb = `rgba(${ch.r},${ch.g},${ch.b},`;
        g.addColorStop(0,    cb + "0)");
        g.addColorStop(0.06, cb + ch.a       + ")");
        g.addColorStop(0.5,  cb + ch.a * 1.8 + ")");
        g.addColorStop(0.94, cb + ch.a       + ")");
        g.addColorStop(1,    cb + "0)");
        ctx.strokeStyle = g;
        ctx.lineWidth   = 1.5;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [paused, mousePxRef, mouseRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATED LETTER — precise upward snap entrance
   + per-letter CSS 3D mouse tracking
   + hover → orange glow
═══════════════════════════════════════════════════════════════ */
interface LetterProps {
  char: string;
  index: number;
  total: number;
  delay: number;
  mouseRef: React.RefObject<{ x: number; y: number }>;
  paused: boolean;
}

function AnimLetter({ char, index, total, delay, mouseRef, paused }: LetterProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hov, setHov] = useState(false);

  /* rAF-driven 3D tilt — no React re-renders, silky smooth */
  useEffect(() => {
    if (paused) return;
    let raf = 0;
    const f = ((index / Math.max(total - 1, 1)) - 0.5) * 2; // -1 … +1

    const tick = () => {
      if (wrapRef.current) {
        const mx = mouseRef.current?.x ?? 0;
        const my = mouseRef.current?.y ?? 0;
        wrapRef.current.style.transform =
          `perspective(600px) rotateY(${f * mx * 7}deg) rotateX(${my * -3}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [paused, index, total, mouseRef]);

  if (char === " ") return <span style={{ display: "inline-block", width: "0.2em" }} />;

  return (
    <div
      ref={wrapRef}
      style={{ display: "inline-block", transformStyle: "preserve-3d", willChange: "transform" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <motion.span
        style={{
          display:  "inline-block",
          color:    hov ? ACCENT : INK,
          textShadow: hov ? `0 0 40px ${ACCENT}88` : "none",
          transition: "color 0.12s, text-shadow 0.12s",
        }}
        initial={paused ? false : { opacity: 0, y: 70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.7, ease: EXPO }}
      >
        {char}
      </motion.span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════════════════ */
interface HeroSectionProps {
  aboutInfo: AboutInfo | null;
  isLoading: boolean;
}

export function HeroSection({ aboutInfo, isLoading }: HeroSectionProps) {
  const reducedMotion = !!useReducedMotion();

  const firstName = (aboutInfo?.name?.split(" ")[0] ?? "DEVELOPER").toUpperCase();
  const lastName  = (aboutInfo?.name?.split(" ").slice(1).join(" ") ?? "ENGINEER").toUpperCase() || "ENGINEER";
  const bio       = aboutInfo?.bio ?? "Building modern web experiences — interfaces, interactions, and the systems that hold them together.";
  const location  = (aboutInfo?.location ?? "GLOBAL").toUpperCase();
  const available = aboutInfo?.availableForWork ?? true;

  /* ── mouse tracking ── */
  const sectionRef  = useRef<HTMLElement>(null);
  const mouseRef    = useRef({ x: 0, y: 0 });      /* normalised -1…+1 */
  const mousePxRef  = useRef({ x: -9999, y: -9999 }); /* canvas pixels */
  const [mousePct, setMousePct] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (reducedMotion) return;
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r  = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top)  / r.height;
      mouseRef.current   = { x: (nx - 0.5) * 2, y: (ny - 0.5) * 2 };
      mousePxRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      setMousePct({ x: nx, y: ny });
    };
    const onLeave = () => {
      mouseRef.current   = { x: 0, y: 0 };
      mousePxRef.current = { x: -9999, y: -9999 };
    };
    el.addEventListener("mousemove",  onMove,  { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove",  onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reducedMotion]);

  /* ── role cycling ── */
  const [roleIdx, setRoleIdx] = useState(0);
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setRoleIdx(i => (i + 1) % ROLES.length), 2200);
    return () => clearInterval(id);
  }, [reducedMotion]);

  const clock = useNowEverySecond();

  const socials = [
    { Icon: Github,    href: aboutInfo?.githubUrl    || FALLBACK.github,    label: "GitHub"    },
    { Icon: Linkedin,  href: aboutInfo?.linkedinUrl  || FALLBACK.linkedin,  label: "LinkedIn"  },
    { Icon: Twitter,   href: aboutInfo?.twitterUrl   || FALLBACK.twitter,   label: "Twitter"   },
    { Icon: Instagram, href: aboutInfo?.instagramUrl || FALLBACK.instagram, label: "Instagram" },
    { Icon: Mail,      href: aboutInfo?.email ? `mailto:${aboutInfo.email}` : `mailto:${FALLBACK.email}`, label: "Email" },
  ];

  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  const fn = firstName.split("");
  const ln = lastName.split("");
  const nameTotalLen = fn.length + ln.length;

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100svh", background: BG, color: INK }}
    >
      {/* ── dots + waveform canvas ── */}
      <HeroBG mousePxRef={mousePxRef} mouseRef={mouseRef} paused={reducedMotion} />

      {/* ── grain ── */}
      <NoiseOverlay />

      {/* ── scanning line ── */}
      {!reducedMotion && <Scanline />}

      {/* ── crosshair cursor ── */}
      {!reducedMotion && <HeroCursor container={sectionRef} />}

      {/* ═════════════════════════════════════════════════════
          TOP BAR — minimal system metadata
      ═════════════════════════════════════════════════════ */}
      <motion.div
        className="absolute inset-x-0 top-0 z-[5] flex items-center justify-between px-5 py-4 font-mono text-[10px] uppercase tracking-[0.28em] lg:px-8"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }}
      >
        <div className="flex items-center gap-3 opacity-40">
          <span
            className="inline-block h-1.5 w-1.5 brut-blink"
            style={{ background: available ? ACCENT : "#555" }}
            aria-hidden
          />
          <span>CODEBYSRS</span>
          <span className="opacity-40">·</span>
          <span className="opacity-60">{available ? "OPEN" : "BOOKED"}</span>
        </div>

        <div className="flex items-center gap-4 opacity-40">
          <span style={{ color: ACCENT }}>SYS:01</span>
          <span className="opacity-50">/</span>
          <span>HERO</span>
          <span className="hidden tabular-nums opacity-50 md:inline">{clock}</span>
        </div>
      </motion.div>

      {/* ═════════════════════════════════════════════════════
          CENTER STAGE — the name
      ═════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-[5] flex flex-col items-start justify-center px-5 lg:px-8"
        style={{ pointerEvents: "none" }}
      >
        {isLoading ? (
          <div className="w-full space-y-5">
            <Skeleton className="h-32 w-3/4 bg-white/10" />
            <Skeleton className="h-32 w-full bg-white/10" />
          </div>
        ) : (
          /* name + bracket wrapper */
          <div className="relative w-full" style={{ pointerEvents: "auto" }}>

            {/* ── engineering corner brackets ── */}
            <CornerBrackets />

            {/* ── ghost "01" behind name ── */}
            <span
              aria-hidden
              className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none font-mono"
              style={{
                fontSize: "clamp(8rem, 28vw, 32rem)",
                fontWeight: 900,
                lineHeight: 1,
                color: INK,
                opacity: 0.025,
                letterSpacing: "-0.06em",
              }}
            >01</span>

            {/* ── name heading ── */}
            <h1
              data-testid="hero-name"
              className="select-none uppercase"
              style={{
                fontWeight:    900,
                fontSize:      "clamp(3.5rem, 12vw, 15rem)",
                lineHeight:    0.86,
                letterSpacing: "-0.04em",
                padding:       "clamp(1rem, 2vw, 2.5rem)",
              }}
            >
              {/* FIRST NAME — letters snap up from below */}
              <span className="block" aria-label={firstName}>
                {fn.map((ch, i) => (
                  <AnimLetter
                    key={`fn-${i}`}
                    char={ch}
                    index={i}
                    total={nameTotalLen}
                    delay={reducedMotion ? 0 : 0.35 + i * 0.055}
                    mouseRef={mouseRef}
                    paused={reducedMotion}
                  />
                ))}
              </span>

              {/* LAST NAME — orange slash rule then letters */}
              <span className="flex w-full items-center gap-[0.2em]" aria-label={lastName}>
                <motion.span
                  aria-hidden
                  style={{
                    flex:            1,
                    height:          "clamp(3px, 0.45vw, 8px)",
                    background:      ACCENT,
                    display:         "block",
                    transformOrigin: "left center",
                  }}
                  initial={reducedMotion ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    delay:    reducedMotion ? 0 : 0.35 + fn.length * 0.055,
                    duration: 0.9,
                    ease:     EXPO,
                  }}
                />
                {ln.map((ch, i) => (
                  <AnimLetter
                    key={`ln-${i}`}
                    char={ch}
                    index={fn.length + i}
                    total={nameTotalLen}
                    delay={reducedMotion ? 0 : 0.45 + (fn.length + i) * 0.055}
                    mouseRef={mouseRef}
                    paused={reducedMotion}
                  />
                ))}
              </span>
            </h1>

            {/* ── role annotation below name ── */}
            <motion.div
              className="flex items-center gap-3 px-[clamp(1rem,2vw,2.5rem)] pb-[clamp(1rem,2vw,2.5rem)] font-mono text-[10px] uppercase tracking-[0.32em]"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reducedMotion ? 0 : 0.4 + nameTotalLen * 0.055, duration: 0.6 }}
            >
              <span style={{ color: ACCENT, opacity: 0.7 }}>ROLE</span>
              <span className="opacity-20">{"//"}</span>
              <span className="opacity-55" style={{ minWidth: "22ch" }}>
                <ScrambleText
                  text={ROLES[roleIdx]}
                  runKey={roleIdx}
                  durationMs={500}
                  paused={reducedMotion}
                />
              </span>
              <span className="hidden tabular-nums opacity-25 sm:inline">
                {String(roleIdx + 1).padStart(2, "0")}/{String(ROLES.length).padStart(2, "0")}
              </span>
            </motion.div>
          </div>
        )}
      </div>

      {/* hidden bio for a11y */}
      {!isLoading && (
        <p data-testid="hero-bio" className="sr-only">{bio}</p>
      )}

      {/* ═════════════════════════════════════════════════════
          BOTTOM STRIP — social · coordinates · CLI CTAs
      ═════════════════════════════════════════════════════ */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-[5] flex items-end justify-between gap-4 px-5 py-4 lg:px-8"
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reducedMotion ? 0 : 0.5 + nameTotalLen * 0.055, duration: 0.6, ease: EXPO }}
      >
        {/* BOTTOM-LEFT: social icons */}
        <div className="flex items-center gap-3">
          {socials.map(({ Icon, href, label }) => (
            <SocialIcon key={label} Icon={Icon} href={href} label={label} />
          ))}
        </div>

        {/* BOTTOM-CENTER: live cursor coordinates */}
        {!reducedMotion && (
          <div
            className="hidden flex-col items-center gap-0.5 font-mono text-[9px] tabular-nums tracking-[0.2em] md:flex"
            style={{ opacity: 0.25 }}
          >
            <span style={{ color: ACCENT }}>X {mousePct.x.toFixed(3)}</span>
            <span>Y {mousePct.y.toFixed(3)}</span>
          </div>
        )}

        {/* BOTTOM-RIGHT: CLI-style CTA buttons */}
        <div className="flex items-center gap-2">
          <CliButton
            cmd="START_PROJECT"
            onClick={() => scrollTo("#contact")}
            data-testid="button-lets-work-together"
            accent
          />
          <CliButton
            cmd="VIEW_WORK"
            onClick={() => scrollTo("#projects")}
            data-testid="button-view-work"
          />
        </div>
      </motion.div>

      {/* ── location / availability sidebar (right edge, desktop) ── */}
      <motion.div
        className="absolute right-3 top-1/2 z-[5] hidden origin-center -translate-y-1/2 translate-x-[calc(50%-4px)] rotate-90 select-none lg:flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.32em]"
        style={{ whiteSpace: "nowrap", opacity: 0.28 }}
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 0.28 }}
        transition={{ delay: 2.0, duration: 0.6 }}
      >
        <span>{location}</span>
        <span style={{ color: ACCENT }}>·</span>
        <span>{available ? "AVAILABLE" : "BOOKED"}</span>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ENGINEERING CORNER BRACKETS
═══════════════════════════════════════════════════════════════ */
function CornerBrackets() {
  const style: React.CSSProperties = { borderColor: `${ACCENT}55`, position: "absolute" };
  const size = "clamp(10px, 1.5vw, 20px)";
  return (
    <>
      <motion.span
        aria-hidden
        style={{ ...style, top: 0, left: 0, width: size, height: size, borderTopWidth: 2, borderLeftWidth: 2 }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, duration: 0.4, ease: EXPO }}
      />
      <motion.span
        aria-hidden
        style={{ ...style, top: 0, right: 0, width: size, height: size, borderTopWidth: 2, borderRightWidth: 2 }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.45, duration: 0.4, ease: EXPO }}
      />
      <motion.span
        aria-hidden
        style={{ ...style, bottom: 0, left: 0, width: size, height: size, borderBottomWidth: 2, borderLeftWidth: 2 }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.4, ease: EXPO }}
      />
      <motion.span
        aria-hidden
        style={{ ...style, bottom: 0, right: 0, width: size, height: size, borderBottomWidth: 2, borderRightWidth: 2 }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.55, duration: 0.4, ease: EXPO }}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CLI BUTTON  ">  CMD ↵"
═══════════════════════════════════════════════════════════════ */
interface CliBtnProps {
  cmd: string;
  onClick?: () => void;
  accent?: boolean;
  "data-testid"?: string;
}
function CliButton({ cmd, onClick, accent = false, "data-testid": tid }: CliBtnProps) {
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
      className="inline-flex items-center gap-2 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] outline-none focus-visible:ring-1"
      style={{
        background:  hov ? (accent ? ACCENT : INK)       : "transparent",
        color:       hov ? BG                              : (accent ? ACCENT : INK),
        border:      `1px solid ${accent ? ACCENT : INK}${hov ? "ff" : "66"}`,
        transition:  "none",
        opacity:     accent ? 1 : 0.65,
      }}
    >
      <span style={{ color: accent && !hov ? ACCENT : "inherit", opacity: 0.6 }}>{">"}</span>
      {cmd}
      <span style={{ opacity: 0.45 }}>↵</span>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SOCIAL ICON LINK
═══════════════════════════════════════════════════════════════ */
function SocialIcon({ Icon, href, label }: { Icon: typeof Github; href: string; label: string }) {
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
      className="outline-none focus-visible:ring-1"
      style={{
        color:      hov ? ACCENT : INK,
        opacity:    hov ? 1 : 0.4,
        transition: "none",
      }}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AMBIENT OVERLAYS
═══════════════════════════════════════════════════════════════ */
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

function Scanline() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
      <div
        className="absolute inset-x-0 h-px brut-scan"
        style={{ background: ACCENT, opacity: 0.4, boxShadow: `0 0 5px ${ACCENT}` }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CROSSHAIR CURSOR
═══════════════════════════════════════════════════════════════ */
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
    root.addEventListener("mousemove",  onMove,  { passive: true });
    root.addEventListener("mouseenter", () => setVis(true));
    root.addEventListener("mouseleave", () => setVis(false));
    return () => {
      if (raf) cancelAnimationFrame(raf);
      root.removeEventListener("mousemove", onMove);
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

/* ═══════════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════════ */
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

function useScramble(target: string, ms: number, key: number | string, paused: boolean) {
  const [out, setOut] = useState(target);
  useEffect(() => {
    if (paused) { setOut(target); return; }
    const G = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░<>/\\";
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t    = Math.min(1, (now - t0) / ms);
      const head = Math.floor(t * (target.length + 4));
      let s = "";
      for (let i = 0; i < target.length; i++) {
        const c = target[i];
        if (i < head - 4) s += c;
        else if (c === " ") s += " ";
        else s += G[Math.floor(Math.random() * G.length)];
      }
      setOut(s);
      if (t < 1) raf = requestAnimationFrame(tick);
      else        setOut(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, ms, key, paused]);
  return out;
}

interface ScrambleTextProps { text: string; runKey?: number | string; durationMs?: number; paused?: boolean; }
function ScrambleText({ text, runKey = 0, durationMs = 700, paused = false }: ScrambleTextProps) {
  const out = useScramble(text, durationMs, runKey, paused);
  return <span style={{ display: "inline-block", whiteSpace: "pre" }}>{out || "\u00A0"}</span>;
}

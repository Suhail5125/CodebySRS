import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  Github, Linkedin, Mail, Twitter, Instagram, ArrowUpRight, MoveRight
} from "lucide-react";
import type { AboutInfo } from "@shared";

/* ─── Brand palette ───────────────────────────────────────────── */
const INK = "#F2EFE6";
const BG = "#0A0A0A";
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
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  instagram: "https://instagram.com",
  email: "hello@codebysrs.dev",
};

interface HeroSectionProps {
  aboutInfo: AboutInfo | null;
  isLoading: boolean;
}

/* ════════════════════════════════════════════════════════════════
   HERO NAVIGATION LINK (Header replica)
════════════════════════════════════════════════════════════════ */
function HeroNavLink({ label, id, href }: { label: string; id: string; href: string }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative inline-flex items-center gap-2 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] outline-none transition-colors"
      style={{ color: INK }}
    >
      <span
        className="absolute left-0 top-0 h-[2px] bg-[#FF3D00]"
        style={{
          width: hover ? "100%" : "0%",
          transition: "width 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      />
      <span
        style={{
          color: hover ? ACCENT : `${INK}55`,
          transition: "color 0.18s",
        }}
      >
        [{id}]
      </span>
      <span className="relative">
        {label}
        <span
          className="absolute -bottom-1 left-0 h-[2px] bg-white"
          style={{
            width: hover ? "100%" : "0%",
            transition: "width 0.24s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        />
      </span>
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════
   HERO HEADER
════════════════════════════════════════════════════════════════ */
function HeroHeader({ headlineFlown }: { headlineFlown: boolean }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const navItems = [
    { label: "Projects", href: "#projects", id: "01" },
    { label: "Services", href: "#services", id: "02" },
    { label: "About", href: "#about", id: "03" },
  ];

  return (
    <motion.header
      className="absolute left-0 top-0 z-[15] flex w-full items-center px-4 sm:px-6 md:px-10 lg:px-16 flex-wrap gap-2 sm:gap-4"
      style={{ minHeight: "clamp(60px, 10vh, 120px)", paddingTop: "clamp(8px, 2vh, 16px)", paddingBottom: "clamp(8px, 2vh, 16px)" }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EXPO }}
    >
      <div className="hidden sm:flex flex-col font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.18em]">
        <span style={{ color: "rgba(242,239,230,0.45)" }}>Location / Time</span>
        <span style={{ color: ACCENT }}>INDIA (IST) / {time}</span>
      </div>

      <div className="hidden md:flex flex-1 justify-center">
        <div className="flex items-center gap-4 lg:gap-8">
          {navItems.map((item) => (
            <HeroNavLink key={item.label} {...item} />
          ))}
        </div>
      </div>

      <div className="relative h-full flex items-center justify-end flex-1 md:flex-initial md:min-w-[200px]">
        <motion.div
          className="font-sans font-black uppercase tracking-[-0.05em]"
          style={{
            fontSize: "clamp(32px, 10vw, 72px)",
            lineHeight: 0.8,
            color: INK,
          }}
          initial={{ scale: 1.2, x: "-40vw", y: "35vh", opacity: 0 }}
          animate={{
            scale: headlineFlown ? 1 : 1.2,
            x: headlineFlown ? 0 : "-40vw",
            y: headlineFlown ? 0 : "35vh",
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            ease: EXPO,
          }}
        >
          CODEBY<span style={{ color: ACCENT }}>SRS</span>
        </motion.div>
      </div>
    </motion.header>
  );
}

/* ════════════════════════════════════════════════════════════════
   SPOTLIGHT DUAL-PORTRAIT MASK
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

  const RADIUS = 260;
  const FEATHER = 70;
  const maskValue = `radial-gradient(circle ${RADIUS}px at var(--mx, -9999px) var(--my, -9999px), rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${((RADIUS - FEATHER) / RADIUS) * 100
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
   NOISE OVERLAY
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
   GRID LINES
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
   PREMIUM CTA BUTTON
════════════════════════════════════════════════════════════════ */
function CTAButton({ label, onClick, variant = "primary" }: { label: string; onClick?: () => void; variant?: "primary" | "secondary" }) {
  const [hov, setHov] = useState(false);
  const isPrimary = variant === "primary";

  const sharedStyles: React.CSSProperties = {
    height: 52,
    minWidth: 180,
    paddingLeft: 24,
    paddingRight: 24,
    fontSize: "11px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.22em",
    fontFamily: "'JetBrains Mono', monospace",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    border: `2px solid ${INK}`,
    outline: "none",
  };

  if (isPrimary) {
    return (
      <button
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={onClick}
        style={{
          ...sharedStyles,
          background: INK,
          color: BG,
        }}
      >
        <span
          className="absolute inset-0 bg-[#FF3D00]"
          style={{
            transform: hov ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        />
        <span className="relative overflow-hidden" style={{ height: "1em", lineHeight: "1em" }}>
          <span
            className="block"
            style={{
              transform: hov ? "translateY(-100%)" : "translateY(0%)",
              transition: "transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            {label}
          </span>
          <span
            aria-hidden="true"
            className="block"
            style={{
              transform: hov ? "translateY(-100%)" : "translateY(0%)",
              transition: "transform 0.28s 0.04s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            {label}
          </span>
        </span>
        <ArrowUpRight
          size={16}
          className="relative transition-transform duration-300"
          style={{ transform: hov ? "translate(2px, -2px)" : "none" }}
        />
      </button>
    );
  }

  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        ...sharedStyles,
        background: hov ? ACCENT : "transparent",
        color: hov ? BG : INK,
        borderColor: hov ? ACCENT : INK,
      }}
    >
      <span className="relative">{label}</span>
      <MoveRight
        size={16}
        className="relative transition-transform duration-300"
        style={{ transform: hov ? "translateX(4px)" : "none" }}
      />
    </button>
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
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2" style={{ background: ACCENT, opacity: 0.7 }} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   VERTICAL LEFT MARQUEE
════════════════════════════════════════════════════════════════ */


/* ════════════════════════════════════════════════════════════════
   SCRAMBLE TEXT
════════════════════════════════════════════════════════════════ */
function useScramble(target: string, durationMs: number, runKey: number | string, paused: boolean) {
  const [out, setOut] = useState(target);
  useEffect(() => {
    if (paused) { setOut(target); return; }
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░<>/\\!@#";
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const head = Math.floor(t * (target.length + 6));
      let s = "";
      for (let i = 0; i < target.length; i++) {
        const ch = target[i];
        if (i < head - 6) s += ch;
        else if (ch === " ") s += " ";
        else s += glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      setOut(s);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setOut(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
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
  const available = aboutInfo?.availableForWork ?? true;

  const sectionRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const sl = spotlightRef.current;
      if (sl) {
        sl.style.setProperty("--mx", `${e.clientX - r.left}px`);
        sl.style.setProperty("--my", `${e.clientY - r.top}px`);
        sl.style.opacity = "1";
      }
    };
    const onLeave = () => {
      if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
    };
    const onEnter = () => {
      if (spotlightRef.current) spotlightRef.current.style.opacity = "1";
    };
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reducedMotion]);

  const [headlineFlown, setHeadlineFlown] = useState(false);
  useEffect(() => {
    if (reducedMotion) { setHeadlineFlown(true); return; }
    const t = setTimeout(() => setHeadlineFlown(true), 500);
    return () => clearTimeout(t);
  }, [reducedMotion]);

  const [roleIdx, setRoleIdx] = useState(0);
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setRoleIdx(i => (i + 1) % ROLES.length), 2800);
    return () => clearInterval(id);
  }, [reducedMotion]);

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  /* Social links */
  const socials = [
    { href: aboutInfo?.githubUrl || FALLBACK.github, label: "GitHub", Icon: Github },
    { href: aboutInfo?.linkedinUrl || FALLBACK.linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: aboutInfo?.twitterUrl || FALLBACK.twitter, label: "Twitter", Icon: Twitter },
    { href: aboutInfo?.instagramUrl || FALLBACK.instagram, label: "Instagram", Icon: Instagram },
    { href: aboutInfo?.email ? `mailto:${aboutInfo.email}` : `mailto:${FALLBACK.email}`, label: "Email", Icon: Mail },
  ];

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100svh", background: BG, color: INK, cursor: "crosshair" }}
    >
      <SpotlightPortraits spotlightRef={spotlightRef} reducedMotion={reducedMotion} />
      <NoiseOverlay />
      <GridLines />

      {/* Custom crosshair cursor */}
      {!reducedMotion && <HeroCursor container={sectionRef} />}

      {/* Vertical Status Label */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-[5] hidden sm:flex h-full w-12 items-center justify-center"
      >
        <div
          className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.35em]"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            color: "rgba(242,239,230,0.6)",
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: available ? ACCENT : "#666",
              boxShadow: available ? `0 0 8px ${ACCENT}` : "none",
              animation: available ? "status-pulse 2s infinite" : "none",
            }}
          />
          <span>
            {available ? "Available for work" : "Currently booked"}
          </span>
        </div>
      </div>

      {/* Hero Header (Integrated branding and nav) */}
      <HeroHeader headlineFlown={headlineFlown} />

      <div
        className="absolute inset-0 z-[10] flex flex-col justify-center px-4 sm:px-6 md:px-8"
        style={{ 
          pointerEvents: "none", 
          paddingLeft: "clamp(16px, 5vw, 80px)", 
          paddingRight: "clamp(16px, 5vw, 80px)",
          paddingTop: "clamp(100px, 20vh, 140px)",
          paddingBottom: "clamp(120px, 20vh, 160px)"
        }}
      >
        {isLoading ? (
          <div className="ml-4 space-y-6">
            <div className="h-4 w-36 rounded-sm bg-white/10 animate-pulse" />
            <div className="h-24 w-full max-w-[420px] rounded-sm bg-white/10 animate-pulse" />
          </div>
        ) : (
          <div className="max-w-[800px]">
            <motion.h1
              className="font-sans font-black uppercase leading-[0.85] tracking-[-0.04em]"
              style={{ fontSize: "clamp(1.5rem, 6vw, 2.8rem)", color: INK }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8, ease: EXPO }}
            >
              <ScrambleText
                text={ROLES[roleIdx]}
                runKey={roleIdx}
                durationMs={850}
                paused={reducedMotion}
              />
            </motion.h1>

            {/* ACTION ROW: CONNECT LABEL + SOCIALS */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <motion.div
                className="font-mono text-[11px] sm:text-[13px] uppercase tracking-[0.25em]"
                style={{ color: ACCENT }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                Connect
              </motion.div>

              <motion.div
                className="flex items-center gap-2 sm:gap-3 flex-wrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5, ease: EXPO }}
                style={{ pointerEvents: "auto" }}
              >
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "clamp(36px, 10vw, 44px)",
                      height: "clamp(36px, 10vw, 44px)",
                      border: `1px solid rgba(242,239,230,0.16)`,
                      color: INK,
                      opacity: 0.5,
                      transition: "opacity 0.18s, color 0.18s, border-color 0.18s",
                      outline: "none",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.opacity = "1"; el.style.color = ACCENT; el.style.borderColor = ACCENT;
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.opacity = "0.5"; el.style.color = INK; el.style.borderColor = "rgba(242,239,230,0.16)";
                    }}
                  >
                    <Icon size={16} strokeWidth={1.5} />
                  </a>
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM-LEFT CORNER CTAs */}
      <motion.div
        className="absolute bottom-6 sm:bottom-10 left-4 sm:left-[clamp(48px,5vw,80px)] z-[10] flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease: EXPO }}
        style={{ pointerEvents: "auto" }}
      >
        <CTAButton label="LET'S WORK" onClick={() => scrollTo("#contact")} />
        <CTAButton label="View work" onClick={() => scrollTo("#projects")} variant="secondary" />
      </motion.div>


      {/* Vertical Instructional Label (Right) */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 z-[5] hidden lg:flex h-full w-12 items-center justify-center"
      >
        <div
          className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.35em]"
          style={{
            writingMode: "vertical-rl",
            color: "rgba(242,239,230,0.45)",
          }}
        >
          Hover over to uncover
        </div>
      </div>

      <motion.div
        className="absolute bottom-6 sm:bottom-10 right-4 sm:right-10 z-[6] flex items-center gap-2 font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.28em]"
        style={{ color: "rgba(242,239,230,0.45)" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6, ease: EXPO }}
      >
        <span>↑↓</span>
        <span>Scroll</span>
      </motion.div>

      <style>{`
        @keyframes status-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
      `}</style>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Twitter,
  Instagram,
  ArrowUpRight,
  ArrowDown,
} from "lucide-react";
import type { AboutInfo } from "@shared";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/reveal";

interface HeroSectionProps {
  aboutInfo: AboutInfo | null;
  isLoading: boolean;
}

const INK    = "#F2EFE6";
const BG     = "#0A0A0A";
const ACCENT = "#FF3D00";

const ROLES = [
  "Creative Developer",
  "3D Generalist",
  "UI / UX Designer",
  "Full-Stack Engineer",
  "Motion Designer",
  "Product Engineer",
  "Frontend Architect",
  "Interaction Designer",
  "WebGL Specialist",
  "Brand Engineer",
  "Systems Designer",
  "Generative Artist",
  "Prototyper",
  "React Specialist",
  "Type-Safe Builder",
  "Performance Nerd",
];

const FOCUS_KEYWORDS = [
  "INTERFACES",
  "MOTION",
  "3D / WEBGL",
  "DESIGN SYSTEMS",
  "DX",
];

const FALLBACK_SOCIAL = {
  github:    "https://github.com",
  linkedin:  "https://linkedin.com",
  twitter:   "https://twitter.com",
  instagram: "https://instagram.com",
  email:     "hello@codebysrs.dev",
};

const STATEMENTS = [
  "DESIGN SYSTEMS",
  "MOTION FIRST",
  "PIXEL PERFECT",
  "PERFORMANCE BUDGET",
  "SHIP > PERFECT",
  "ACCESSIBILITY",
  "TYPE-SAFE",
  "EDGE-NATIVE",
];

const DATA_FEED = [
  "BUILD #1024",
  "UPTIME 99.98%",
  "NODE v22",
  "RESPONSE <24H",
  "TZ UTC+05",
  "STACK TS+RS",
];

export function HeroSection({ aboutInfo, isLoading }: HeroSectionProps) {
  const reducedMotion = !!useReducedMotion();

  const fullName  = aboutInfo?.name ?? "DEVELOPER";
  const firstName = (aboutInfo?.name?.split(" ")[0] ?? "DEVELOPER").toUpperCase();
  const lastName  = (aboutInfo?.name?.split(" ").slice(1).join(" ") ?? "ENGINEER").toUpperCase() || "ENGINEER";
  const bio       = aboutInfo?.bio ?? "I design and build modern web experiences — interfaces, interactions, and the systems that hold them together.";
  const location  = (aboutInfo?.location ?? "EARTH / GLOBAL").toUpperCase();
  const available = aboutInfo?.availableForWork ?? true;

  // Role cycling
  const [roleIndex, setRoleIndex] = useState(0);
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % ROLES.length), 1600);
    return () => clearInterval(id);
  }, [reducedMotion]);
  const roleSlotCh = Math.max(...ROLES.map((r) => r.length));

  const socialLinks: { Icon: typeof Github; href: string; label: string }[] = [
    { Icon: Github,    href: aboutInfo?.githubUrl    || FALLBACK_SOCIAL.github,    label: "GitHub"    },
    { Icon: Linkedin,  href: aboutInfo?.linkedinUrl  || FALLBACK_SOCIAL.linkedin,  label: "LinkedIn"  },
    { Icon: Twitter,   href: aboutInfo?.twitterUrl   || FALLBACK_SOCIAL.twitter,   label: "Twitter"   },
    { Icon: Instagram, href: aboutInfo?.instagramUrl || FALLBACK_SOCIAL.instagram, label: "Instagram" },
    { Icon: Mail,      href: aboutInfo?.email ? `mailto:${aboutInfo.email}` : `mailto:${FALLBACK_SOCIAL.email}`, label: "Email" },
  ];

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  const now         = useNowEverySecond();
  const feedItem    = useRotator(DATA_FEED,    2400, reducedMotion);
  const nowStatement = useRotator(STATEMENTS, 2200, reducedMotion);

  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: BG, color: INK, fontFamily: "var(--font-sans)" }}
    >
      {/* Background layers */}
      <NoiseOverlay />
      <GridLines />
      {!reducedMotion && <Scanline />}
      {!reducedMotion && <HeroCursor container={sectionRef} />}

      {/* ══════════════════════════════════════════════════
          TOP STATUS BAR
          Section label lives here — right side annotation
          ══════════════════════════════════════════════════ */}
      <div
        className="relative z-[3] flex w-full items-center justify-between px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] lg:px-10"
        style={{ borderBottom: `2px solid ${INK}`, color: INK }}
      >
        {/* Left: availability + live feed */}
        <div className="flex items-center gap-3">
          <span
            className="inline-block h-2 w-2 brut-blink"
            style={{ background: available ? ACCENT : "#666" }}
            aria-hidden
          />
          <span className="opacity-80">{available ? "LIVE" : "OFFLINE"}</span>
          <span className="opacity-20">·</span>
          <span className="tabular-nums opacity-55 hidden sm:inline-block" style={{ minWidth: "16ch" }}>
            <ScrambleText text={feedItem} runKey={feedItem} durationMs={420} paused={reducedMotion} />
          </span>
        </div>

        {/* Right: section index annotation + clock */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span style={{ color: ACCENT }}>[ SECTION 01 ]</span>
            <span className="opacity-40">/</span>
            <span className="opacity-70">HERO</span>
          </div>
          <span className="hidden tabular-nums opacity-50 md:inline-block" style={{ minWidth: "8ch" }}>
            {now}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          MAIN CONTENT
          ══════════════════════════════════════════════════ */}
      <main className="relative z-[3] mx-auto w-full max-w-[1600px] px-6 pb-8 pt-6 lg:px-10">

        {/* Single outer bordered frame */}
        <div style={{ border: `2px solid ${INK}` }}>
          <div className="grid grid-cols-12">

            {/* ── NAME ZONE — left 9 cols ──────────────────────── */}
            <div
              className="col-span-12 lg:col-span-9"
              style={{ borderRight: `2px solid ${INK}` }}
            >
              {/* Identity kicker */}
              <div className="px-6 pt-6 pb-2 lg:px-8">
                {isLoading ? (
                  <Skeleton className="h-4 w-64 bg-white/10" />
                ) : (
                  <Reveal variant="clip" delay={0}>
                    <p className="font-mono text-[11px] uppercase tracking-[0.32em] opacity-60">
                      <span style={{ color: ACCENT }}>{"//"}</span>{" "}
                      identity = <span style={{ color: INK }}>"{fullName}"</span>
                    </p>
                  </Reveal>
                )}
              </div>

              {/* THE NAME — absolute focal point */}
              <div className="px-6 pb-0 lg:px-8">
                {isLoading ? (
                  <div className="space-y-4 py-4">
                    <Skeleton className="h-28 w-3/4 bg-white/10" />
                    <Skeleton className="h-28 w-2/3 bg-white/10" />
                  </div>
                ) : (
                  <h1
                    data-testid="hero-name"
                    className="uppercase"
                    style={{
                      fontFamily:   "'Inter', 'Helvetica Neue', Arial, sans-serif",
                      fontSize:     "clamp(3.5rem, 11vw, 11rem)",
                      fontWeight:   800,
                      lineHeight:   0.88,
                      letterSpacing: "-0.03em",
                      color:        INK,
                    }}
                  >
                    <Reveal variant="clip" delay={30}>
                      <span className="block">
                        <ScrambleText text={firstName} paused={reducedMotion} durationMs={950} />
                      </span>
                    </Reveal>
                    <Reveal variant="clip" delay={110}>
                      <span className="block">
                        <span className="inline-flex items-baseline gap-[0.18em]">
                          {/* accent square — a visual punch mark before the last name */}
                          <span
                            aria-hidden
                            className="inline-block translate-y-[-0.04em]"
                            style={{
                              width:      "0.42em",
                              height:     "0.42em",
                              background: ACCENT,
                              flexShrink: 0,
                            }}
                          />
                          <ScrambleText text={lastName} paused={reducedMotion} durationMs={1100} />
                        </span>
                      </span>
                    </Reveal>
                  </h1>
                )}
              </div>

              {/* Bio — screen-reader only, test-id preserved */}
              {!isLoading && (
                <p data-testid="hero-bio" className="sr-only">{bio}</p>
              )}

              {/* ── BOTTOM SUB-ROW — role / social / CTAs ──────── */}
              {/* Horizontal band separated by a full-width 2px top border */}
              <div style={{ borderTop: `2px solid ${INK}` }} className="grid grid-cols-1 lg:grid-cols-2">

                {/* Left half: role cycler + focus keywords */}
                <div className="px-6 py-5 lg:px-8 lg:border-r-2 lg:border-[#F2EFE6]">
                  {!isLoading && (
                    <Reveal variant="rise" delay={170}>
                      {/* Role cycler */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.22em]">
                        <span className="opacity-40">ROLE</span>
                        <span className="opacity-20">[</span>
                        <span
                          className="inline-block"
                          style={{ minWidth: `${roleSlotCh}ch`, color: INK }}
                        >
                          <ScrambleText
                            text={ROLES[roleIndex].toUpperCase()}
                            runKey={roleIndex}
                            paused={reducedMotion}
                            durationMs={520}
                          />
                        </span>
                        <span className="opacity-20">]</span>
                        <span className="opacity-20">·</span>
                        <span className="tabular-nums opacity-35">
                          {String(roleIndex + 1).padStart(2, "0")}/{String(ROLES.length).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Focus strip */}
                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.22em]">
                        <span className="opacity-40">FOCUS</span>
                        <span className="opacity-20">·</span>
                        {FOCUS_KEYWORDS.map((kw, i) => (
                          <span key={kw} className="inline-flex items-center gap-1.5">
                            <span className="opacity-85">{kw}</span>
                            {i < FOCUS_KEYWORDS.length - 1 && (
                              <span style={{ color: ACCENT }} className="opacity-60">/</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </Reveal>
                  )}
                </div>

                {/* Right half: social row + CTAs */}
                <div className="flex flex-col justify-between gap-4 px-6 py-5 lg:px-8">
                  {/* Social channels — compact horizontal mono row */}
                  <Reveal variant="rise" delay={210}>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[10px] uppercase tracking-[0.18em]">
                      {socialLinks.map(({ Icon, href, label }, i) => (
                        <span key={label} className="inline-flex items-center gap-1.5">
                          <SocialLink Icon={Icon} href={href} label={label} />
                          {i < socialLinks.length - 1 && (
                            <span className="opacity-20" aria-hidden>·</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </Reveal>

                  {/* CTAs */}
                  <Reveal variant="rise" delay={250}>
                    <div className="flex flex-wrap items-center gap-3">
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
                    </div>
                  </Reveal>
                </div>

              </div>
            </div>

            {/* ── NOW CARD — right 3 cols, tall accent column ──── */}
            {/* border-t always (mobile stacks below name); on desktop the outer
                container top-border handles it, but border-t-2 re-draws it which
                is fine since it sits flush — use border-t only on mobile */}
            <div className="col-span-12 flex flex-col lg:col-span-3 border-t-2 border-[#F2EFE6] lg:border-t-0">
              {/* Zone label */}
              <Reveal variant="rise" delay={300}>
                <div
                  className="flex items-center justify-between px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em]"
                  style={{ borderBottom: `2px solid ${INK}` }}
                >
                  <span className="opacity-50">
                    <span style={{ color: ACCENT }}>{"//"}</span>
                    <span className="ml-2">NOW</span>
                  </span>
                  <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 brut-blink"
                    style={{ background: ACCENT }}
                  />
                </div>
              </Reveal>

              {/* Rotating statement — large, fills the column */}
              <div className="flex flex-1 items-center px-5 py-8">
                {!isLoading && (
                  <Reveal variant="clip" delay={340}>
                    <div
                      className="font-bold uppercase tracking-tight"
                      style={{
                        fontFamily:   "'Inter', 'Helvetica Neue', Arial, sans-serif",
                        fontSize:     "clamp(1.1rem, 2vw, 1.6rem)",
                        lineHeight:   1.0,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      <ScrambleText
                        text={nowStatement}
                        runKey={nowStatement}
                        paused={reducedMotion}
                        durationMs={420}
                      />
                    </div>
                  </Reveal>
                )}
              </div>

              {/* Accent rule at the bottom of the NOW column */}
              <div style={{ height: 3, background: ACCENT }} />
            </div>

          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            BOTTOM STRIP — availability + scroll
            ══════════════════════════════════════════════════ */}
        <div
          className="mt-0 flex flex-wrap items-center justify-between gap-4 px-1 py-4 font-mono text-[11px] uppercase tracking-[0.22em]"
          style={{ borderTop: `2px solid ${INK}` }}
        >
          <div className="flex items-center gap-3">
            <span
              className="inline-block h-2 w-2 brut-blink"
              style={{ background: available ? ACCENT : "#666" }}
              aria-hidden
            />
            <span className="opacity-80">
              {available ? "AVAILABLE FOR WORK" : "BOOKED — JOIN WAITLIST"}
            </span>
            <span className="opacity-20">·</span>
            <span className="opacity-45">{location}</span>
          </div>
          <button
            type="button"
            onClick={() => scrollTo("#about")}
            className="flex items-center gap-2 opacity-60 hover:opacity-100"
            style={{ transition: "none" }}
          >
            <span>SCROLL</span>
            <ArrowDown className={`h-3 w-3 ${reducedMotion ? "" : "motion-safe:animate-bounce"}`} />
          </button>
        </div>

      </main>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════════════════ */

interface BrutButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "solid" | "ghost";
  "data-testid"?: string;
}
function BrutButton({ label, onClick, variant = "solid", "data-testid": testid }: BrutButtonProps) {
  const [hover, setHover] = useState(false);
  const isSolid = variant === "solid";
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testid}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="inline-flex items-center gap-3 px-5 py-3 font-mono text-[12px] font-bold uppercase tracking-[0.22em] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
      style={{
        background:  isSolid ? (hover ? ACCENT : INK)           : (hover ? INK : "transparent"),
        color:       isSolid ? (hover ? INK   : BG)             : (hover ? BG  : INK),
        border:      `2px solid ${INK}`,
        transition:  "none",
      }}
    >
      <span>{label}</span>
      <ArrowUpRight className="h-4 w-4" />
    </button>
  );
}

interface SocialLinkProps { Icon: typeof Github; href: string; label: string; }
function SocialLink({ Icon, href, label }: SocialLinkProps) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-testid={`link-${label.toLowerCase()}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="inline-flex items-center gap-1.5 outline-none focus-visible:underline"
      style={{
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        color:      hover ? ACCENT : INK,
        transition: "none",
      }}
    >
      <Icon className="h-3 w-3 shrink-0" />
      <span>{label}</span>
    </a>
  );
}

function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] opacity-[0.08]"
      style={{
        backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
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
          style={{ left: `${x}%`, background: "rgba(242,239,230,0.04)" }}
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
        style={{ background: ACCENT, opacity: 0.55, boxShadow: `0 0 6px ${ACCENT}` }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HOOKS
══════════════════════════════════════════════════════════════ */

function useNowEverySecond() {
  const [s, setS] = useState(() => fmtClock(new Date()));
  useEffect(() => {
    const id = setInterval(() => setS(fmtClock(new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  return s;
}

function fmtClock(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function useScramble(target: string, durationMs: number, runKey: number | string, paused: boolean) {
  const [out, setOut] = useState<string>(target);
  useEffect(() => {
    if (paused) { setOut(target); return; }
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░<>/\\\\";
    const start  = performance.now();
    let raf      = 0;
    const tick   = (now: number) => {
      const t          = Math.min(1, (now - start) / durationMs);
      const revealHead = Math.floor(t * (target.length + 4));
      let s = "";
      for (let i = 0; i < target.length; i++) {
        const ch = target[i];
        if (i < revealHead - 4) s += ch;
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
  }, [target, durationMs, runKey, paused]);
  return out;
}

interface ScrambleTextProps {
  text: string;
  runKey?: number | string;
  durationMs?: number;
  paused?: boolean;
}
function ScrambleText({ text, runKey = 0, durationMs = 900, paused = false }: ScrambleTextProps) {
  const out = useScramble(text, durationMs, runKey, paused);
  return <span style={{ display: "inline-block", whiteSpace: "pre" }}>{out || "\u00A0"}</span>;
}

function useRotator<T>(items: T[], intervalMs: number, paused: boolean) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (paused || items.length <= 1) return;
    const id = setInterval(() => setI((n) => (n + 1) % items.length), intervalMs);
    return () => clearInterval(id);
  }, [items.length, intervalMs, paused]);
  return items[i];
}

interface HeroCursorProps { container: React.RefObject<HTMLElement | null>; }
function HeroCursor({ container }: HeroCursorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const root = container.current;
    if (!root) return;
    let raf     = 0;
    let pending = { x: 0, y: 0 };
    const apply = () => {
      raf = 0;
      if (!ref.current) return;
      ref.current.style.transform = `translate(${pending.x - 14}px, ${pending.y - 14}px)`;
    };
    const onMove  = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect();
      pending    = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);
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
        opacity:    visible ? 1 : 0,
        transition: "opacity 0.2s ease-out",
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

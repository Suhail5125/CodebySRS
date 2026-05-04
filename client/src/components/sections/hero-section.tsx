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

const INK = "#F2EFE6";
const BG = "#0A0A0A";
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

/** Fallback social channels — used when `aboutInfo` is empty so the
 *  hero never collapses to "no socials". Real URLs from the admin
 *  override the matching label. */
const FALLBACK_SOCIAL = {
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  instagram: "https://instagram.com",
  email: "hello@codebysrs.dev",
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

  const fullName = aboutInfo?.name ?? "DEVELOPER";
  const firstName = (aboutInfo?.name?.split(" ")[0] ?? "DEVELOPER").toUpperCase();
  const lastName = (aboutInfo?.name?.split(" ").slice(1).join(" ") ?? "ENGINEER").toUpperCase() || "ENGINEER";
  const bio =
    aboutInfo?.bio ??
    "I design and build modern web experiences — interfaces, interactions, and the systems that hold them together.";
  const location = (aboutInfo?.location ?? "EARTH / GLOBAL").toUpperCase();
  const available = aboutInfo?.availableForWork ?? true;

  // Role cycling — fixed-width slot prevents the layout from shifting.
  const [roleIndex, setRoleIndex] = useState(0);
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % ROLES.length), 1600);
    return () => clearInterval(id);
  }, [reducedMotion]);
  const roleSlotCh = Math.max(...ROLES.map((r) => r.length));

  // Five core channels with fallbacks.
  const socialLinks: { Icon: typeof Github; href: string; label: string }[] = [
    { Icon: Github, href: aboutInfo?.githubUrl || FALLBACK_SOCIAL.github, label: "GitHub" },
    { Icon: Linkedin, href: aboutInfo?.linkedinUrl || FALLBACK_SOCIAL.linkedin, label: "LinkedIn" },
    { Icon: Twitter, href: aboutInfo?.twitterUrl || FALLBACK_SOCIAL.twitter, label: "Twitter" },
    { Icon: Instagram, href: aboutInfo?.instagramUrl || FALLBACK_SOCIAL.instagram, label: "Instagram" },
    { Icon: Mail, href: aboutInfo?.email ? `mailto:${aboutInfo.email}` : `mailto:${FALLBACK_SOCIAL.email}`, label: "Email" },
  ];

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  // Live clock for the top status bar (1Hz).
  const now = useNowEverySecond();

  // Live data-feed item rotates every 2.4s.
  const feedItem = useRotator(DATA_FEED, 2400, reducedMotion);

  // Rotating statement for the NOW card.
  const nowStatement = useRotator(STATEMENTS, 2200, reducedMotion);

  // Scoped cursor crosshair tracks the mouse only inside this section.
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: BG, color: INK, fontFamily: "var(--font-sans)" }}
    >
      {/* ==========  Background layers ========== */}
      <NoiseOverlay />
      <GridLines />
      {!reducedMotion && <Scanline />}
      {!reducedMotion && <HeroCursor container={sectionRef} />}

      {/* ==========  TOP STATUS BAR ========== */}
      {/* 2px solid border — matches how other panel headers are styled */}
      <div
        className="relative z-[3] flex w-full items-center justify-between px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] lg:px-10"
        style={{ borderBottom: `2px solid ${INK}`, color: INK }}
      >
        <div className="flex items-center gap-3">
          <span
            className="inline-block h-2 w-2 brut-blink"
            style={{ background: available ? ACCENT : "#666" }}
            aria-hidden
          />
          <span className="opacity-80">{available ? "LIVE" : "OFFLINE"}</span>
          <span className="opacity-30">/</span>
          <span
            className="tabular-nums opacity-60"
            style={{ minWidth: "16ch", display: "inline-block" }}
          >
            <ScrambleText
              text={feedItem}
              runKey={feedItem}
              durationMs={420}
              paused={reducedMotion}
            />
          </span>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <span
            className="tabular-nums opacity-80"
            style={{ minWidth: "8ch", display: "inline-block", textAlign: "right" }}
          >
            {now}
          </span>
        </div>
      </div>

      {/* ==========  MAIN CONTENT ========== */}
      <main className="relative z-[3] mx-auto w-full max-w-[1600px] px-6 pt-4 pb-8 lg:px-10 lg:pt-6">

        {/* Outer bordered panel — matches About / Projects panel language */}
        <div style={{ border: `2px solid ${INK}` }}>
          <div className="grid grid-cols-12">

            {/* ── LEFT ZONE: Section label (2 cols) ── */}
            <aside
              className="col-span-12 lg:col-span-2"
              style={{ borderRight: `2px solid ${INK}`, borderBottom: `2px solid ${INK}` }}
            >
              {/* Section index — matches SectionHeader typographic pattern exactly */}
              <div className="p-5 font-mono text-[11px] uppercase tracking-[0.22em]">
                <div style={{ color: ACCENT }}>[ SECTION 01 ]</div>
                <div className="mt-1 opacity-70">/ HERO</div>
                <div className="mt-3 h-[2px] w-12" style={{ background: ACCENT }} />
              </div>

              {/* Manifesto — desktop only */}
              <div className="hidden p-5 pt-0 lg:block">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-50">MANIFESTO</div>
                <p className="mt-2 font-mono text-[11px] max-w-[160px] leading-snug opacity-70">
                  Build sharp.<br />
                  Ship loud.<br />
                  Cut the fluff.
                </p>
              </div>
            </aside>

            {/* ── CENTER ZONE: Identity, headline, role, CTAs (7 cols) ── */}
            <div
              className="col-span-12 lg:col-span-7 p-5 lg:p-8"
              style={{ borderRight: `2px solid ${INK}` }}
            >
              {/* Identity kicker — label → headline → role → CTAs */}
              {isLoading ? (
                <Skeleton className="mb-6 h-4 w-72 bg-white/10" />
              ) : (
                <Reveal variant="clip" delay={0}>
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.32em] opacity-70">
                    <span style={{ color: ACCENT }}>{"//"}</span> identity ={" "}
                    <span style={{ color: INK }}>"{fullName}"</span>
                  </p>
                </Reveal>
              )}

              {/* Headline — name as primary visual anchor */}
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-3/4 bg-white/10" />
                  <Skeleton className="h-20 w-2/3 bg-white/10" />
                </div>
              ) : (
                <h1
                  data-testid="hero-name"
                  className="uppercase tracking-[-0.03em]"
                  style={{
                    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: "clamp(2.5rem, 8vw, 8rem)",
                    fontWeight: 800,
                    lineHeight: 0.9,
                    color: INK,
                  }}
                >
                  <Reveal variant="clip" delay={40}>
                    <span className="block">
                      <ScrambleText
                        text={firstName}
                        paused={reducedMotion}
                        durationMs={950}
                      />
                    </span>
                  </Reveal>
                  <Reveal variant="clip" delay={120}>
                    <span className="block">
                      <span className="inline-flex items-baseline gap-[0.2em]">
                        <span
                          aria-hidden
                          className="inline-block h-[0.5em] w-[0.5em] translate-y-[-0.05em]"
                          style={{ background: ACCENT }}
                        />
                        <ScrambleText
                          text={lastName}
                          paused={reducedMotion}
                          durationMs={1100}
                        />
                      </span>
                    </span>
                  </Reveal>
                </h1>
              )}

              {/* Role cycler */}
              {!isLoading && (
                <Reveal variant="rise" delay={180}>
                  <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-[12px] uppercase tracking-[0.22em]">
                    <span className="opacity-50">ROLE</span>
                    <span className="opacity-30">[</span>
                    <span
                      className="inline-block uppercase"
                      style={{ minWidth: `${roleSlotCh}ch`, color: INK }}
                    >
                      <ScrambleText
                        text={ROLES[roleIndex].toUpperCase()}
                        runKey={roleIndex}
                        paused={reducedMotion}
                        durationMs={520}
                      />
                    </span>
                    <span className="opacity-30">]</span>
                    <span className="opacity-30">·</span>
                    <span className="tabular-nums opacity-50">
                      {String(roleIndex + 1).padStart(2, "0")}/
                      {String(ROLES.length).padStart(2, "0")}
                    </span>
                  </div>
                </Reveal>
              )}

              {/* FOCUS keywords */}
              {!isLoading && (
                <Reveal variant="rise" delay={220}>
                  <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.22em]">
                    <span className="opacity-50">FOCUS</span>
                    <span className="opacity-30">·</span>
                    {FOCUS_KEYWORDS.map((kw, i) => (
                      <span key={kw} className="inline-flex items-center gap-2">
                        <span style={{ color: INK }} className="opacity-90">{kw}</span>
                        {i < FOCUS_KEYWORDS.length - 1 && (
                          <span style={{ color: ACCENT }} className="opacity-70">/</span>
                        )}
                      </span>
                    ))}
                  </div>
                </Reveal>
              )}

              {/* Bio — visually hidden, test-id preserved */}
              {!isLoading && (
                <p data-testid="hero-bio" className="sr-only">{bio}</p>
              )}

              {/* CTAs */}
              <Reveal variant="rise" delay={280}>
                <div className="mt-6 flex flex-wrap items-stretch gap-3">
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

            {/* ── RIGHT ZONE: Channels + NOW card (3 cols) ── */}
            <div className="col-span-12 lg:col-span-3 flex flex-col">

              {/* CHANNELS — compact horizontal mono row */}
              <Reveal variant="rise" delay={320}>
                <div
                  className="p-5"
                  style={{ borderBottom: `2px solid ${INK}` }}
                >
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.32em] opacity-60">
                    <span style={{ color: ACCENT }}>{"//"}</span>
                    <span className="ml-2">CHANNELS</span>
                  </div>
                  {/* Horizontal social link row — icon + label, separated by · */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    {socialLinks.map(({ Icon, href, label }, i) => (
                      <span key={label} className="inline-flex items-center gap-1.5">
                        <SocialLink Icon={Icon} href={href} label={label} />
                        {i < socialLinks.length - 1 && (
                          <span
                            className="font-mono text-[10px] opacity-30"
                            aria-hidden
                          >
                            ·
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* NOW card — rotating statement */}
              {!isLoading && (
                <Reveal variant="rise" delay={380}>
                  <div className="p-5" style={{ borderBottom: `2px solid ${INK}` }}>
                    <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.32em] opacity-60">
                      <span>
                        <span style={{ color: ACCENT }}>{"//"}</span>
                        <span className="ml-2">NOW</span>
                      </span>
                      <span
                        aria-hidden
                        className="inline-block h-1.5 w-1.5 brut-blink"
                        style={{ background: ACCENT }}
                      />
                    </div>
                    <div
                      className="font-bold uppercase tracking-tight"
                      style={{
                        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                        fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
                        lineHeight: 1.05,
                      }}
                    >
                      <ScrambleText
                        text={nowStatement}
                        runKey={nowStatement}
                        paused={reducedMotion}
                        durationMs={420}
                      />
                    </div>
                  </div>
                </Reveal>
              )}
            </div>

          </div>
        </div>

        {/* ==========  BOTTOM STRIP ========== */}
        <div
          className="mt-4 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.22em]"
          style={{ borderTop: `2px solid ${INK}`, paddingTop: "1rem" }}
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
            <span className="opacity-30">·</span>
            <span className="opacity-50">{location}</span>
          </div>
          <button
            type="button"
            onClick={() => scrollTo("#about")}
            className="group flex items-center gap-2 opacity-70 hover:opacity-100"
          >
            <span>SCROLL</span>
            <ArrowDown
              className={`h-3 w-3 ${reducedMotion ? "" : "motion-safe:animate-bounce"}`}
            />
          </button>
        </div>
      </main>
    </section>
  );
}

/* ==================== Sub-components ==================== */

interface BrutButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "solid" | "ghost";
  "data-testid"?: string;
}
/**
 * Brutalist primary CTA — hard-bordered block, no animation,
 * instant color invert on hover (transition: none).
 */
function BrutButton({
  label,
  onClick,
  variant = "solid",
  "data-testid": testid,
}: BrutButtonProps) {
  const [hover, setHover] = useState(false);
  const isSolid = variant === "solid";
  const bg = isSolid
    ? hover ? ACCENT : INK
    : hover ? INK : "transparent";
  const fg = isSolid
    ? hover ? INK : BG
    : hover ? BG : INK;
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
        background: bg,
        color: fg,
        border: `2px solid ${INK}`,
        transition: "none",
      }}
    >
      <span>{label}</span>
      <ArrowUpRight className="h-4 w-4" />
    </button>
  );
}

/** Compact horizontal social link — icon + label, used in the channel row. */
interface SocialLinkProps {
  Icon: typeof Github;
  href: string;
  label: string;
}
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
      className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] outline-none focus-visible:underline"
      style={{
        color: hover ? ACCENT : INK,
        transition: "none",
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      }}
    >
      <Icon className="h-3 w-3 shrink-0" />
      <span>{label}</span>
    </a>
  );
}

/** Subtle SVG noise — gives the bg the brutalist grain feel. */
function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] opacity-[0.08]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        backgroundRepeat: "repeat",
      }}
    />
  );
}

/** Static hairline grid — divides the viewport into brutalist columns. */
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

/** A single horizontal hairline that slowly travels the section. */
function Scanline() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      <div
        className="absolute inset-x-0 h-px brut-scan"
        style={{
          background: ACCENT,
          opacity: 0.55,
          boxShadow: `0 0 6px ${ACCENT}`,
        }}
      />
    </div>
  );
}

/* ==================== Hooks ==================== */

/** HH:MM:SS string ticking once per second. */
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

/** Character-scramble decoder. */
function useScramble(
  target: string,
  durationMs: number,
  runKey: number | string,
  paused: boolean,
) {
  const [out, setOut] = useState<string>(target);
  useEffect(() => {
    if (paused) {
      setOut(target);
      return;
    }
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░<>/\\\\";
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
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
function ScrambleText({
  text,
  runKey = 0,
  durationMs = 900,
  paused = false,
}: ScrambleTextProps) {
  const out = useScramble(text, durationMs, runKey, paused);
  return (
    <span style={{ display: "inline-block", whiteSpace: "pre" }}>
      {out || "\u00A0"}
    </span>
  );
}

/** Cycles through `items` every `intervalMs`. */
function useRotator<T>(items: T[], intervalMs: number, paused: boolean) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (paused || items.length <= 1) return;
    const id = setInterval(() => setI((n) => (n + 1) % items.length), intervalMs);
    return () => clearInterval(id);
  }, [items.length, intervalMs, paused]);
  return items[i];
}

interface HeroCursorProps {
  container: React.RefObject<HTMLElement | null>;
}
/** Brutalist square crosshair that tracks the mouse — only inside the hero. */
function HeroCursor({ container }: HeroCursorProps) {
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
      <span
        className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
        style={{ background: ACCENT, opacity: 0.7 }}
      />
      <span
        className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2"
        style={{ background: ACCENT, opacity: 0.7 }}
      />
    </div>
  );
}

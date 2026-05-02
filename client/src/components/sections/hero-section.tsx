import { useEffect, useMemo, useRef, useState } from "react";
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
];

const TECH = [
  "REACT",
  "TYPESCRIPT",
  "THREE.JS",
  "NODE",
  "POSTGRES",
  "TAILWIND",
  "WEBGL",
  "FRAMER",
];

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

  const stats = useMemo(
    () => [
      { value: aboutInfo?.yearsExperience ?? 0, label: "YEARS" },
      { value: aboutInfo?.completedProjects ?? 0, label: "PROJECTS" },
      { value: aboutInfo?.totalClients ?? 0, label: "CLIENTS" },
      { value: aboutInfo?.technologiesCount ?? 0, label: "STACK" },
    ],
    [aboutInfo],
  );

  // Role cycling — fixed-width slot prevents the layout from shifting.
  const [roleIndex, setRoleIndex] = useState(0);
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % ROLES.length), 2800);
    return () => clearInterval(id);
  }, [reducedMotion]);
  // Width of the longest role string in characters — locks the slot.
  const roleSlotCh = Math.max(...ROLES.map((r) => r.length));

  const socialLinks = aboutInfo
    ? [
        aboutInfo.githubUrl && { Icon: Github, href: aboutInfo.githubUrl, label: "GitHub" },
        aboutInfo.linkedinUrl && { Icon: Linkedin, href: aboutInfo.linkedinUrl, label: "LinkedIn" },
        aboutInfo.twitterUrl && { Icon: Twitter, href: aboutInfo.twitterUrl, label: "Twitter" },
        aboutInfo.instagramUrl && { Icon: Instagram, href: aboutInfo.instagramUrl, label: "Instagram" },
        aboutInfo.email && { Icon: Mail, href: `mailto:${aboutInfo.email}`, label: "Email" },
      ].filter(
        (l): l is { Icon: typeof Github; href: string; label: string } => Boolean(l),
      )
    : [];

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  // Live clock for the top status bar (1Hz, fixed-width slot).
  const now = useNowEverySecond();

  // Live data-feed item rotates every 2.4s in the top status bar.
  const feedItem = useRotator(DATA_FEED, 2400, reducedMotion);

  // Scoped cursor crosshair tracks the mouse only inside this section.
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: BG, color: INK, fontFamily: "var(--font-sans)" }}
    >
      {/* ==========  Background layers (no gradients, brutalist) ========== */}
      <NoiseOverlay />
      <GridLines />
      {!reducedMotion && <Scanline />}
      {!reducedMotion && <HeroCursor container={sectionRef} />}

      {/* ==========  TOP STATUS BAR ========== */}
      <div
        className="relative z-[3] flex w-full items-center justify-between border-b border-[#F2EFE6]/15 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] lg:px-10"
        style={{ color: INK }}
      >
        <div className="flex items-center gap-3">
          <span
            className="inline-block h-2 w-2 brut-blink"
            style={{ background: available ? ACCENT : "#666" }}
            aria-hidden
          />
          <span className="opacity-80">{available ? "LIVE" : "OFFLINE"}</span>
          <span className="opacity-30">/</span>
          <span className="opacity-80">CodebySRS · DEV-OS</span>
          <span className="opacity-30">/</span>
          <span
            className="tabular-nums opacity-60"
            style={{ minWidth: "16ch", display: "inline-block" }}
          >
            <ScrambleText text={feedItem} runKey={feedItem} durationMs={420} />
          </span>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <span className="opacity-50">{location}</span>
          <span className="opacity-30">·</span>
          <span className="tabular-nums opacity-80" style={{ minWidth: "8ch", display: "inline-block", textAlign: "right" }}>
            {now}
          </span>
        </div>
      </div>

      {/* ==========  MAIN GRID ========== */}
      <main className="relative z-[3] mx-auto w-full max-w-[1600px] px-6 pt-16 pb-12 lg:px-10 lg:pt-24">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          {/* Left aside — section index + manifesto */}
          <aside className="col-span-12 lg:col-span-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em]">
              <div className="opacity-50">SECTION</div>
              <div
                className="mt-1 text-[28px] font-bold leading-none tabular-nums"
                style={{ color: ACCENT }}
              >
                01
              </div>
              <div className="mt-1 opacity-50">/ HERO</div>

              <div className="mt-10 hidden h-px w-12 bg-[#F2EFE6]/30 lg:block" />

              <div className="mt-6 hidden lg:block">
                <div className="opacity-50">MANIFESTO</div>
                <p className="mt-2 max-w-[160px] leading-snug opacity-75">
                  Build sharp.
                  <br />
                  Ship loud.
                  <br />
                  Cut the fluff.
                </p>
              </div>
            </div>
          </aside>

          {/* Main column */}
          <div className="col-span-12 lg:col-span-10">
            {/* Tag */}
            {isLoading ? (
              <Skeleton className="mb-6 h-4 w-72 bg-white/10" />
            ) : (
              <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.32em] opacity-70 brut-fade">
                <span style={{ color: ACCENT }}>{"//"}</span> identity ={" "}
                <span className="text-[#F2EFE6]">"{fullName}"</span>
              </p>
            )}

            {/* Headline — shutter rise per line */}
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
                  fontFamily:
                    "'Inter', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: "clamp(3.5rem, 11vw, 11rem)",
                  fontWeight: 800,
                  lineHeight: 0.9,
                  color: INK,
                }}
              >
                <span
                  className={
                    reducedMotion ? "block" : "block brut-fade"
                  }
                  style={
                    reducedMotion
                      ? undefined
                      : { animationDelay: "0.05s" }
                  }
                >
                  <ScrambleText
                    text={firstName}
                    paused={reducedMotion}
                    durationMs={950}
                  />
                </span>
                <span
                  className={
                    reducedMotion
                      ? "block"
                      : "block brut-fade"
                  }
                  style={
                    reducedMotion
                      ? undefined
                      : { animationDelay: "0.18s" }
                  }
                >
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
              </h1>
            )}

            {/* Role cycler — FIXED-WIDTH SLOT, no layout shift */}
            {!isLoading && (
              <div
                className="mt-8 flex flex-wrap items-center gap-3 font-mono text-[12px] uppercase tracking-[0.22em] brut-fade"
                style={{ animationDelay: "0.2s" }}
              >
                <span className="opacity-50">ROLE</span>
                <span className="opacity-30">[</span>
                <span
                  className="inline-block uppercase"
                  style={{
                    minWidth: `${roleSlotCh}ch`,
                    color: INK,
                  }}
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
            )}

            {/* Bio */}
            {isLoading ? (
              <div className="mt-10 space-y-2">
                <Skeleton className="h-4 w-full max-w-2xl bg-white/10" />
                <Skeleton className="h-4 w-4/5 max-w-2xl bg-white/10" />
              </div>
            ) : (
              <div
                className="mt-10 flex max-w-2xl gap-4 brut-fade"
                style={{ animationDelay: "0.3s" }}
              >
                <span
                  className="mt-1 inline-block h-[1.6em] w-[3px] flex-none"
                  style={{ background: ACCENT }}
                  aria-hidden
                />
                <p
                  data-testid="hero-bio"
                  className="text-base leading-relaxed sm:text-lg"
                  style={{ color: "rgba(242,239,230,0.82)" }}
                >
                  {bio}
                </p>
              </div>
            )}

            {/* CTAs — hard borders, hover inverts, magnetic-pull on cursor proximity */}
            <div
              className="mt-10 flex flex-wrap items-stretch gap-3 brut-fade"
              style={{ animationDelay: "0.4s" }}
            >
              <Magnetic strength={0.35} disabled={reducedMotion}>
                <BrutButton
                  onClick={() => scrollTo("#contact")}
                  data-testid="button-lets-work-together"
                  variant="solid"
                >
                  START PROJECT
                  <ArrowUpRight className="h-4 w-4" />
                </BrutButton>
              </Magnetic>
              <Magnetic strength={0.35} disabled={reducedMotion}>
                <BrutButton
                  onClick={() => scrollTo("#projects")}
                  data-testid="button-view-work"
                  variant="ghost"
                >
                  VIEW WORK
                  <ArrowUpRight className="h-4 w-4" />
                </BrutButton>
              </Magnetic>
            </div>

            {/* Social row */}
            {socialLinks.length > 0 && (
              <div
                className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.22em] brut-fade"
                style={{ animationDelay: "0.5s" }}
              >
                <span className="opacity-50">CHANNELS</span>
                <span className="opacity-30">/</span>
                {socialLinks.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    data-testid={`link-${label.toLowerCase()}`}
                    className="group inline-flex items-center gap-1.5 underline-offset-4 transition-none hover:underline"
                    style={{ color: INK }}
                  >
                    <Icon className="h-[14px] w-[14px]" />
                    <span>{label.toUpperCase()}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ==========  DUAL-LANE MARQUEE — opposite directions, brutalist tape-deck feel ========== */}
        <div className="relative mt-20 border-y-2 border-[#F2EFE6] lg:mt-28">
          <div className="py-3">
            <Marquee items={TECH} reducedMotion={reducedMotion} />
          </div>
          <div className="h-px w-full bg-[#F2EFE6]/30" />
          <div className="py-3 opacity-80">
            <Marquee
              items={STATEMENTS}
              reducedMotion={reducedMotion}
              reverse
              accentColor={INK}
            />
          </div>
        </div>

        {/* ==========  STATS ROW (with normalized progress bars) ========== */}
        <div className="mt-10 grid grid-cols-2 gap-px border border-[#F2EFE6]/20 bg-[#F2EFE6]/20 sm:grid-cols-4">
          {stats.map((s) => (
            <Stat
              key={s.label}
              value={s.value}
              label={s.label}
              maxValue={Math.max(1, ...stats.map((x) => x.value))}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        {/* ==========  BOTTOM STRIP ========== */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.22em]">
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
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "solid" | "ghost";
  "data-testid"?: string;
}
/** Hard-bordered button. Hover = instant color invert (no transition). */
function BrutButton({
  children,
  onClick,
  variant = "solid",
  "data-testid": testid,
}: BrutButtonProps) {
  const [hover, setHover] = useState(false);
  const isSolid = variant === "solid";
  // Solid: cream bg + black text → invert on hover to accent bg + cream text.
  // Ghost: transparent bg + cream border → invert to cream bg + black text.
  const bg = isSolid
    ? hover
      ? ACCENT
      : INK
    : hover
      ? INK
      : "transparent";
  const fg = isSolid ? (hover ? INK : BG) : hover ? BG : INK;
  const border = isSolid ? bg : INK;
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testid}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="group inline-flex items-center gap-3 px-5 py-3 font-mono text-[12px] font-bold uppercase tracking-[0.22em] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
      style={{
        background: bg,
        color: fg,
        border: `2px solid ${border}`,
        transition: "none",
      }}
    >
      {children}
    </button>
  );
}

interface StatProps {
  value: number;
  label: string;
  reducedMotion?: boolean;
}
/** Big number + label cell with count-up animation in a fixed-width slot. */
function Stat({ value, label, reducedMotion }: StatProps) {
  const display = useCountUp(value, 1200, reducedMotion);
  // Fixed slot: always 3 digits — prevents layout shift during count-up.
  const padded = String(display).padStart(3, "0");
  return (
    <div
      data-testid={`hero-stat-${label.toLowerCase()}`}
      className="flex flex-col gap-2 bg-[#0A0A0A] p-5 lg:p-6"
    >
      <div
        className="tabular-nums leading-none"
        style={{
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
          fontWeight: 800,
          color: INK,
        }}
      >
        {padded}
        <span style={{ color: ACCENT }}>+</span>
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.28em] opacity-60">
        {label}
      </div>
    </div>
  );
}

interface MarqueeProps {
  items: string[];
  reducedMotion?: boolean;
  reverse?: boolean;
  /** Color for the bullet/divider between items. Defaults to ACCENT. */
  accentColor?: string;
}
/** Continuous horizontal ticker. Duplicates content for seamless loop.
 *  When `reverse`, scrolls right→left's mirror (left→right) using a
 *  separate keyframe so the two stacked lanes move in opposite directions. */
function Marquee({ items, reducedMotion, reverse, accentColor }: MarqueeProps) {
  const dot = accentColor ?? ACCENT;
  const content = (
    <div
      className="flex shrink-0 items-center gap-10 pr-10 text-2xl uppercase sm:text-3xl lg:text-5xl"
      style={{
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        fontWeight: reverse ? 600 : 800,
        letterSpacing: "-0.02em",
      }}
    >
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="inline-flex items-center gap-10">
          <span>{item}</span>
          <span style={{ color: dot }} aria-hidden>
            {reverse ? "◆" : "●"}
          </span>
        </span>
      ))}
    </div>
  );

  if (reducedMotion) {
    return (
      <div className="flex w-full overflow-hidden whitespace-nowrap">
        {content}
      </div>
    );
  }

  return (
    <div className="flex w-full overflow-hidden whitespace-nowrap">
      <div className={`flex ${reverse ? "brut-marquee-rev" : "brut-marquee"}`}>
        {content}
        <div aria-hidden>{content}</div>
      </div>
    </div>
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

/** Animates 0 → target with easeOutCubic. Honors reduced-motion. */
function useCountUp(target: number, duration = 1200, reducedMotion = false) {
  const [v, setV] = useState(reducedMotion ? target : 0);
  const startedFor = useRef<number | null>(null);
  useEffect(() => {
    if (reducedMotion) {
      setV(target);
      return;
    }
    if (startedFor.current === target) return;
    startedFor.current = target;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reducedMotion]);
  return v;
}

/** HH:MM:SS string ticking once per second — shared across remounts cheaply. */
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

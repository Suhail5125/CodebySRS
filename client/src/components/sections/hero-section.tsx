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
 *  override the matching label. Trimmed to the five core channels
 *  by user request (Dribbble / Codepen / YouTube removed). */
const FALLBACK_SOCIAL = {
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  instagram: "https://instagram.com",
  email: "hello@codebysrs.dev",
};

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
    // Faster cycle (1.6s) so the role keyword visibly changes
    // multiple times even within the first hero glance.
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % ROLES.length), 1600);
    return () => clearInterval(id);
  }, [reducedMotion]);
  // Width of the longest role string in characters — locks the slot.
  const roleSlotCh = Math.max(...ROLES.map((r) => r.length));

  // Five core channels — real URLs override the brand fallbacks so the
  // visual never collapses while data loads. (Dribbble/Codepen/YouTube
  // removed per user request to keep the row clean.)
  const socialLinks: { Icon: typeof Github; href: string; label: string }[] = [
    { Icon: Github, href: aboutInfo?.githubUrl || FALLBACK_SOCIAL.github, label: "GitHub" },
    { Icon: Linkedin, href: aboutInfo?.linkedinUrl || FALLBACK_SOCIAL.linkedin, label: "LinkedIn" },
    { Icon: Twitter, href: aboutInfo?.twitterUrl || FALLBACK_SOCIAL.twitter, label: "Twitter" },
    { Icon: Instagram, href: aboutInfo?.instagramUrl || FALLBACK_SOCIAL.instagram, label: "Instagram" },
    { Icon: Mail, href: aboutInfo?.email ? `mailto:${aboutInfo.email}` : `mailto:${FALLBACK_SOCIAL.email}`, label: "Email" },
  ];

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  // Live clock for the top status bar (1Hz, fixed-width slot).
  const now = useNowEverySecond();

  // Live data-feed item rotates every 2.4s in the top status bar.
  const feedItem = useRotator(DATA_FEED, 2400, reducedMotion);

  // Rotating headline for the right-rail "NOW" card. Reuses the
  // STATEMENTS array so we don't introduce a parallel data source.
  const nowStatement = useRotator(STATEMENTS, 2200, reducedMotion);

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
            <ScrambleText
              text={feedItem}
              runKey={feedItem}
              durationMs={420}
              paused={reducedMotion}
            />
          </span>
        </div>
        {/* Right side: just the live clock — location was removed
            because it already appears next to AVAILABLE FOR WORK
            in the bottom strip below the hero. */}
        <div className="hidden items-center gap-3 md:flex">
          <span className="tabular-nums opacity-80" style={{ minWidth: "8ch", display: "inline-block", textAlign: "right" }}>
            {now}
          </span>
        </div>
      </div>

      {/* ==========  MAIN GRID ========== */}
      <main className="relative z-[3] mx-auto w-full max-w-[1600px] px-6 pt-4 pb-8 lg:px-10 lg:pt-6">
        <div className="grid grid-cols-12 gap-x-6 gap-y-6">
          {/* Left aside — section index + manifesto + coords.
              Trimmed to remove duplication with the top status bar
              (clock) and the bottom strip (status / version), so the
              hero reads as one organized column instead of a noisy
              telemetry dump. */}
          <aside className="col-span-12 lg:col-span-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em]">
              {/* Section index */}
              <div className="opacity-50">SECTION</div>
              <div
                className="mt-1 text-[28px] font-bold leading-none tabular-nums"
                style={{ color: ACCENT }}
              >
                01
              </div>
              <div className="mt-1 opacity-50">/ HERO</div>

              <div className="mt-8 hidden h-px w-12 bg-[#F2EFE6]/30 lg:block" />

              {/* Manifesto */}
              <div className="mt-5 hidden lg:block">
                <div className="opacity-50">MANIFESTO</div>
                <p className="mt-2 max-w-[160px] leading-snug opacity-80">
                  Build sharp.
                  <br />
                  Ship loud.
                  <br />
                  Cut the fluff.
                </p>
              </div>

              <div className="mt-8 hidden h-px w-12 bg-[#F2EFE6]/30 lg:block" />

              {/* Coords — non-duplicative with the bottom-strip
                  location label (which shows "EARTH / GLOBAL"). */}
              <div className="mt-5 hidden lg:block">
                <div className="opacity-50">COORDS</div>
                <div className="mt-2 leading-snug opacity-90">
                  <div className="tabular-nums">13.0827° N</div>
                  <div className="tabular-nums">80.2707° E</div>
                </div>
              </div>
            </div>
          </aside>

          {/* Center column — identity, headline, role, FOCUS, CTAs.
              Trimmed from `col-span-10` to `col-span-7` so the
              right rail can carry CHANNELS + NOW, distributing
              hero content across the full screen. */}
          <div className="col-span-12 lg:col-span-7">
            {/* Tag */}
            {isLoading ? (
              <Skeleton className="mb-6 h-4 w-72 bg-white/10" />
            ) : (
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.32em] opacity-70 brut-fade">
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
                  // Reduced from `clamp(3.5rem, 11vw, 11rem)` so the
                  // header + hero + CTAs + socials + AVAILABLE FOR WORK
                  // + scroll indicator all fit a 1080p viewport.
                  fontSize: "clamp(2.5rem, 8vw, 8rem)",
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
                className="mt-4 flex flex-wrap items-center gap-3 font-mono text-[12px] uppercase tracking-[0.22em] brut-fade"
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

            {/* FOCUS keywords — secondary tagline below the role cycler */}
            {!isLoading && (
              <div
                className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.22em] brut-fade"
                style={{ animationDelay: "0.28s" }}
              >
                <span className="opacity-50">FOCUS</span>
                <span className="opacity-30">·</span>
                {FOCUS_KEYWORDS.map((kw, i) => (
                  <span key={kw} className="inline-flex items-center gap-2">
                    <span style={{ color: INK }} className="opacity-90">
                      {kw}
                    </span>
                    {i < FOCUS_KEYWORDS.length - 1 && (
                      <span style={{ color: ACCENT }} className="opacity-70">
                        /
                      </span>
                    )}
                  </span>
                ))}
              </div>
            )}

            {/* Bio — visually hidden by user request (the About section
                below already carries this copy), but the `hero-bio`
                test-id is preserved for the data-testid contract. */}
            {!isLoading && (
              <p data-testid="hero-bio" className="sr-only">
                {bio}
              </p>
            )}

            {/* CTAs — fully STATIC by user request: no entrance fade,
                no magnetic cursor pull. Buttons themselves use
                `transition: none` (see BrutButton). */}
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

          </div>

          {/* Right rail — CHANNELS + NOW card. On mobile it stacks
              under the center column so reading order stays
              top-to-bottom. */}
          <div className="col-span-12 lg:col-span-3">
            {/* ============ CHANNELS panel ============ */}
            {socialLinks.length > 0 && (
              <div
                className="brut-fade"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] opacity-60">
                  <span style={{ color: ACCENT }}>{"//"}</span>
                  <span>CHANNELS</span>
                  <span className="opacity-30">·</span>
                  <span className="tabular-nums opacity-50">
                    {String(socialLinks.length).padStart(2, "0")}
                  </span>
                  <div className="ml-2 h-px flex-1 bg-[#F2EFE6]/15" />
                </div>
                {/* 3-col grid keeps 5 tiles in two clean rows
                    (3 + 2) with no orphan row of 1. */}
                <div className="grid grid-cols-3 gap-3">
                  {socialLinks.map(({ Icon, href, label }, i) => (
                    <SocialTile
                      key={label}
                      Icon={Icon}
                      href={href}
                      label={label}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ============ NOW card — rotating statement ============ */}
            {!isLoading && (
              <div
                className="mt-6 brut-fade"
                style={{
                  animationDelay: "0.5s",
                  border: `2px solid ${INK}`,
                }}
              >
                <div
                  className="flex items-center justify-between border-b border-[#F2EFE6]/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.32em] opacity-60"
                >
                  <span>
                    <span style={{ color: ACCENT }}>{"//"}</span> NOW
                  </span>
                  <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 brut-blink"
                    style={{ background: ACCENT }}
                  />
                </div>
                <div
                  className="px-4 py-4 font-bold uppercase tracking-tight"
                  style={{
                    fontFamily:
                      "'Inter', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: "clamp(1rem, 1.6vw, 1.35rem)",
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
            )}
          </div>
        </div>

        {/* ==========  DUAL-LANE MARQUEE — opposite directions, brutalist tape-deck feel ========== */}
        <div className="relative mt-8 border-y-2 border-[#F2EFE6] lg:mt-10">
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
        <div className="mt-6 grid grid-cols-2 gap-px border border-[#F2EFE6]/20 bg-[#F2EFE6]/20 sm:grid-cols-4">
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
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.22em]">
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
 * Brutalist primary CTA — STATIC by request: hard-bordered block,
 * no animation, instant color invert on hover (transition: none).
 *
 * Solid variant = cream BG → accent BG on hover.
 * Ghost variant = transparent BG → cream BG on hover (inverse).
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

interface StatProps {
  value: number;
  label: string;
  /** Max value across the row — used to normalize the progress bar width. */
  maxValue?: number;
  reducedMotion?: boolean;
}
/** Big number + label cell with count-up + a normalized progress bar
 * that fills from 0 → (value / maxValue) over the same duration. */
function Stat({ value, label, maxValue = 100, reducedMotion }: StatProps) {
  const display = useCountUp(value, 1200, reducedMotion);
  // Fixed slot: always 3 digits — prevents layout shift during count-up.
  const padded = String(display).padStart(3, "0");
  const pct = Math.min(100, (display / Math.max(1, maxValue)) * 100);
  return (
    <div
      data-testid={`hero-stat-${label.toLowerCase()}`}
      className="flex flex-col gap-3 bg-[#0A0A0A] p-5 lg:p-6"
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
      {/* normalized progress bar */}
      <div
        className="relative h-[3px] w-full overflow-hidden bg-[#F2EFE6]/15"
        aria-hidden
      >
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: `${pct}%`,
            background: ACCENT,
            transition: reducedMotion
              ? "none"
              : "width 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        />
      </div>
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.28em] opacity-60">
        <span>{label}</span>
        <span className="tabular-nums opacity-60">
          {String(Math.round(pct)).padStart(2, "0")}%
        </span>
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

/* ============================================================
 * SocialTile — bold brutalist square channel button.
 *  - 64-px square, 2-px cream border, label below the icon
 *  - Hover: accent block sweeps up from bottom (color invert),
 *    icon scales + the corner ARROW pings out, top tick fills
 *  - Staggered fade-in via `animationDelay` keyed by `index`
 * ============================================================ */
interface SocialTileProps {
  Icon: typeof Github;
  href: string;
  label: string;
  index: number;
}
function SocialTile({ Icon, href, label, index }: SocialTileProps) {
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
      className="group relative inline-flex h-16 w-16 shrink-0 flex-col items-center justify-center overflow-hidden text-[9px] font-bold uppercase tracking-[0.18em] outline-none brut-fade focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] sm:h-20 sm:w-20 sm:text-[10px]"
      style={{
        color: INK,
        background: "transparent",
        border: `2px solid ${INK}`,
        animationDelay: `${0.55 + index * 0.06}s`,
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      }}
    >
      {/* Sweep block — bottom → top */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0"
        style={{
          height: "100%",
          background: ACCENT,
          transform: hover ? "translateY(0%)" : "translateY(101%)",
          transition: "transform 0.32s cubic-bezier(0.2,0.8,0.2,1)",
        }}
      />
      {/* Top tick */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-[2px]"
        style={{
          width: hover ? "100%" : "0%",
          background: INK,
          transition: "width 0.24s cubic-bezier(0.2,0.8,0.2,1)",
        }}
      />
      {/* Corner ping arrow — top-right */}
      <ArrowUpRight
        aria-hidden
        className="absolute right-1 top-1 h-3 w-3"
        style={{
          color: hover ? INK : `${INK}55`,
          opacity: hover ? 1 : 0.5,
          transform: hover ? "translate(2px,-2px)" : "translate(0,0)",
          transition:
            "transform 0.22s cubic-bezier(0.2,0.8,0.2,1), opacity 0.18s, color 0.05s 0.14s linear",
        }}
      />
      {/* Icon */}
      <Icon
        className="relative h-5 w-5 sm:h-6 sm:w-6"
        style={{
          color: hover ? INK : INK,
          transform: hover ? "scale(1.12)" : "scale(1)",
          transition: "transform 0.22s cubic-bezier(0.2,0.8,0.2,1)",
        }}
      />
      {/* Label */}
      <span
        className="relative mt-1.5"
        style={{
          color: hover ? INK : INK,
          transition: "color 0.05s 0.14s linear",
        }}
      >
        {label.toUpperCase()}
      </span>
    </a>
  );
}

/* ==================== Advanced animation helpers ==================== */

/** Character-scramble decoder — cycles random glyphs into the target string,
 *  revealing characters left-to-right. The natural fallback (paused / done)
 *  is always the full target string, so content is never invisible. */
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
      // Reveal slightly past the end so the trailing chars settle smoothly.
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
  /** Change to re-trigger the scramble. */
  runKey?: number | string;
  durationMs?: number;
  paused?: boolean;
}
/** Renders a string with a character-scramble decode-in effect. */
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

interface MagneticProps {
  children: React.ReactNode;
  /** 0..1 — how strongly the wrapper drifts toward the cursor. */
  strength?: number;
  /** Activation radius multiplier × the wrapper's max dimension. */
  radiusMul?: number;
  disabled?: boolean;
}
/** Magnetic wrapper — drifts toward the cursor when nearby, snaps back on leave. */
function Magnetic({
  children,
  strength = 0.35,
  radiusMul = 1.6,
  disabled = false,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let lastEvent: MouseEvent | null = null;
    const apply = () => {
      raf = 0;
      if (!lastEvent) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = lastEvent.clientX - cx;
      const dy = lastEvent.clientY - cy;
      const radius = Math.max(rect.width, rect.height) * radiusMul;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      } else {
        el.style.transform = "translate(0,0)";
      }
    };
    const onMove = (e: MouseEvent) => {
      lastEvent = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      el.style.transform = "translate(0,0)";
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength, radiusMul, disabled]);
  return (
    <div ref={ref} className={disabled ? "inline-flex" : "inline-flex brut-magnet"}>
      {children}
    </div>
  );
}

/** Cycles through `items` every `intervalMs` — used by the live data feed. */
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
      {/* Square ring */}
      <span
        className="absolute inset-0 border"
        style={{ borderColor: ACCENT }}
      />
      {/* Crosshair lines */}
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

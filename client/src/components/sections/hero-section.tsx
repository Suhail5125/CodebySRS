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

/* ---------- Engineering / instrument constants ---------- */

const FAKE_FILE = "~/codebysrs/src/components/sections/hero-section.tsx";

const KEYS: { k: string; action: string; target: string | null }[] = [
  { k: "J", action: "PROJECTS", target: "#projects" },
  { k: "K", action: "SERVICES", target: "#services" },
  { k: "L", action: "CONTACT", target: "#contact" },
  { k: "/", action: "SEARCH", target: null },
];

const COMMITS: { hash: string; msg: string; time: string }[] = [
  { hash: "a8f3b1c", msg: "feat(hero): brutalist instruments", time: "32m" },
  { hash: "f4e92d1", msg: "perf: drop 3d-vendor chunk -255kB", time: "1h" },
  { hash: "c1b7a40", msg: "chore: tighten reveal delays", time: "2h" },
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

  // ============== Engineering telemetry (live, but stable under reduced-motion) ==============
  const uptime = useUptime();
  const latency = useFakeMetric(28, 12, 48, 1400, reducedMotion);
  const latencyHistory = useHistory(latency, 32);
  const memPct = useFakeMetric(58, 32, 82, 1800, reducedMotion);

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: BG, color: INK, fontFamily: "var(--font-sans)" }}
    >
      {/* ==========  Background layers (no gradients, brutalist) ========== */}
      <NoiseOverlay />
      <GridLines />
      {!reducedMotion && <Scanline />}

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
          <span className="opacity-50">v2.0</span>
          <span className="hidden opacity-30 lg:inline">/</span>
          <span className="hidden items-center gap-1.5 lg:inline-flex">
            <span
              className="inline-block h-2 w-2"
              style={{ background: "#3FFF7A" }}
              aria-hidden
            />
            <span className="opacity-80">BUILD</span>
            <span className="opacity-30">·</span>
            <span className="tabular-nums" style={{ color: ACCENT }}>
              a8f3b1c
            </span>
            <span className="opacity-30">·</span>
            <span className="opacity-50">1.8s</span>
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

              {/* Engineering: SYS panel — live uptime + git/env/node */}
              <div className="mt-10 hidden lg:block">
                <div className="opacity-50">SYS</div>
                <dl className="mt-2 space-y-1 leading-snug">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="opacity-50">UPTIME</dt>
                    <dd
                      className="tabular-nums"
                      style={{ color: INK, minWidth: "8ch", textAlign: "right" }}
                    >
                      {uptime}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="opacity-50">GIT</dt>
                    <dd className="opacity-80">main</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="opacity-50">ENV</dt>
                    <dd className="opacity-80">prod</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="opacity-50">NODE</dt>
                    <dd className="opacity-80">20.x</dd>
                  </div>
                </dl>
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
                  {firstName}
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
                    {lastName}
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
                  key={roleIndex}
                  className="inline-block uppercase brut-fade"
                  style={{
                    minWidth: `${roleSlotCh}ch`,
                    color: INK,
                    animationDuration: "0.45s",
                  }}
                >
                  {ROLES[roleIndex].toUpperCase()}
                </span>
                <span className="opacity-30">]</span>
                <span className="opacity-30">·</span>
                <span className="tabular-nums opacity-50">
                  {String(roleIndex + 1).padStart(2, "0")}/
                  {String(ROLES.length).padStart(2, "0")}
                </span>
              </div>
            )}

            {/* Engineering: NOW EDITING — file path + line:col + INSERT pill + cursor */}
            {!isLoading && (
              <NowEditingLine file={FAKE_FILE} line={142} col={8} />
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

            {/* CTAs — hard borders, hover inverts */}
            <div
              className="mt-10 flex flex-wrap items-stretch gap-3 brut-fade"
              style={{ animationDelay: "0.4s" }}
            >
              <BrutButton
                onClick={() => scrollTo("#contact")}
                data-testid="button-lets-work-together"
                variant="solid"
              >
                START PROJECT
                <ArrowUpRight className="h-4 w-4" />
              </BrutButton>
              <BrutButton
                onClick={() => scrollTo("#projects")}
                data-testid="button-view-work"
                variant="ghost"
              >
                VIEW WORK
                <ArrowUpRight className="h-4 w-4" />
              </BrutButton>
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

            {/* Engineering: keyboard shortcut hints */}
            {!isLoading && (
              <div
                className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-[10px] uppercase tracking-[0.22em] brut-fade"
                style={{ animationDelay: "0.6s" }}
              >
                <span className="opacity-50">SHORTCUTS</span>
                <span className="opacity-30">/</span>
                {KEYS.map(({ k, action, target }) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => target && scrollTo(target)}
                    className="group inline-flex items-center gap-1.5"
                  >
                    <KeyCap>{k}</KeyCap>
                    <span className="opacity-70 group-hover:opacity-100">
                      {action}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ==========  ENGINEERING TELEMETRY ========== */}
        {!isLoading && (
          <div
            className="mt-12 grid grid-cols-2 gap-px border border-[#F2EFE6]/20 bg-[#F2EFE6]/20 brut-fade lg:grid-cols-4"
            style={{ animationDelay: "0.55s" }}
          >
            {/* LATENCY with live SVG sparkline */}
            <TelemetryCell label="LATENCY">
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className="text-[22px] font-bold tabular-nums"
                  style={{ color: INK }}
                >
                  {Math.round(latency)}
                  <span className="ml-0.5 text-[10px] opacity-60">ms</span>
                </span>
                <span className="opacity-50">P50</span>
              </div>
              <div className="mt-2">
                <Sparkline data={latencyHistory} />
              </div>
            </TelemetryCell>

            {/* MEMORY ASCII bar */}
            <TelemetryCell label="MEMORY">
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className="text-[22px] font-bold tabular-nums"
                  style={{ color: INK }}
                >
                  {Math.round(memPct)}
                  <span className="ml-0.5 text-[10px] opacity-60">%</span>
                </span>
                <span className="opacity-50">v8 heap</span>
              </div>
              <div className="mt-2 text-[11px]">
                <AsciiBar value={memPct} />
              </div>
            </TelemetryCell>

            {/* DEPLOY status */}
            <TelemetryCell label="DEPLOY">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 brut-blink"
                  style={{ background: "#3FFF7A" }}
                  aria-hidden
                />
                <span style={{ color: INK }}>LIVE</span>
                <span className="opacity-30">·</span>
                <span className="opacity-70">prod</span>
              </div>
              <div className="mt-2 opacity-60">edge · iad1 · 32 ms</div>
            </TelemetryCell>

            {/* LAST COMMIT */}
            <TelemetryCell label="LAST COMMIT">
              <div className="flex items-center gap-2">
                <span
                  className="tabular-nums"
                  style={{ color: ACCENT }}
                >
                  {COMMITS[0].hash}
                </span>
                <span className="opacity-30">·</span>
                <span className="tabular-nums opacity-50">
                  {COMMITS[0].time} ago
                </span>
              </div>
              <div className="mt-2 truncate opacity-80">
                {COMMITS[0].msg}
              </div>
            </TelemetryCell>
          </div>
        )}

        {/* ==========  TECH MARQUEE ========== */}
        <div className="relative mt-20 border-y-2 border-[#F2EFE6] py-4 lg:mt-28">
          <Marquee items={TECH} reducedMotion={reducedMotion} />
        </div>

        {/* ==========  STATS ROW ========== */}
        <div className="mt-10 grid grid-cols-2 gap-px border border-[#F2EFE6]/20 bg-[#F2EFE6]/20 sm:grid-cols-4">
          {stats.map((s) => (
            <Stat
              key={s.label}
              value={s.value}
              label={s.label}
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
}
/** Continuous horizontal ticker. Duplicates content for seamless loop. */
function Marquee({ items, reducedMotion }: MarqueeProps) {
  const content = (
    <div
      className="flex shrink-0 items-center gap-10 pr-10 text-2xl uppercase sm:text-3xl lg:text-5xl"
      style={{
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        fontWeight: 800,
        letterSpacing: "-0.02em",
      }}
    >
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="inline-flex items-center gap-10">
          <span>{item}</span>
          <span style={{ color: ACCENT }} aria-hidden>
            ●
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
      <div className="flex brut-marquee">
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

/* ==================== Engineering instruments ==================== */

/** Counts seconds since mount, returns a fixed-width "HH:MM:SS" string. */
function useUptime() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setS((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

/** Random-walk fake metric clamped to [min,max]. Locked to seed under reduced motion. */
function useFakeMetric(
  seed: number,
  min: number,
  max: number,
  intervalMs = 1500,
  reducedMotion = false,
) {
  const [v, setV] = useState(seed);
  useEffect(() => {
    if (reducedMotion) {
      setV(seed);
      return;
    }
    const id = setInterval(() => {
      setV((prev) => {
        const delta = (Math.random() - 0.5) * (max - min) * 0.18;
        return Math.max(min, Math.min(max, prev + delta));
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [seed, min, max, intervalMs, reducedMotion]);
  return v;
}

/** Rolling buffer of the last `len` values of `current`. */
function useHistory(current: number, len = 32) {
  const [hist, setHist] = useState<number[]>(() => Array(len).fill(current));
  useEffect(() => {
    setHist((prev) => {
      const next = prev.slice(1);
      next.push(current);
      return next;
    });
  }, [current]);
  return hist;
}

/* ---------- Instrument sub-components ---------- */

/** Brutalist SVG sparkline: 1px polyline, no fill, no smoothing. */
function Sparkline({ data, height = 24 }: { data: number[]; height?: number }) {
  const w = 100;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / Math.max(1, data.length - 1)) * w;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      preserveAspectRatio="none"
      className="block h-6 w-full"
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke={INK}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** ASCII-style horizontal bar: [██████░░░░] */
function AsciiBar({
  value,
  max = 100,
  cells = 14,
}: {
  value: number;
  max?: number;
  cells?: number;
}) {
  const filled = Math.max(0, Math.min(cells, Math.round((value / max) * cells)));
  return (
    <span className="font-mono">
      <span className="opacity-50">[</span>
      <span style={{ color: ACCENT }}>{"\u2588".repeat(filled)}</span>
      <span className="opacity-30">{"\u2591".repeat(cells - filled)}</span>
      <span className="opacity-50">]</span>
    </span>
  );
}

/** Hard-bordered keycap. */
function KeyCap({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex h-6 min-w-[24px] items-center justify-center border px-1.5 font-mono text-[10px] font-bold tabular-nums"
      style={{ borderColor: INK, color: INK }}
    >
      {children}
    </span>
  );
}

/** "NOW EDITING" line: file path + line:col + INSERT pill + blinking caret. */
function NowEditingLine({
  file,
  line,
  col,
}: {
  file: string;
  line: number;
  col: number;
}) {
  return (
    <div
      className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] brut-fade"
      style={{ animationDelay: "0.25s" }}
    >
      <span className="opacity-50">EDITING</span>
      <span className="opacity-30">/</span>
      <span className="truncate" style={{ color: INK }}>
        {file}
      </span>
      <span className="opacity-30">:</span>
      <span className="tabular-nums" style={{ color: ACCENT }}>
        {line}
      </span>
      <span className="opacity-30">:</span>
      <span className="tabular-nums" style={{ color: ACCENT }}>
        {col}
      </span>
      <span
        className="inline-flex h-4 items-center border px-1.5 text-[9px] tracking-[0.22em]"
        style={{ borderColor: INK, color: INK }}
      >
        INSERT
      </span>
      <span
        className="brut-blink inline-block h-3 w-2"
        style={{ background: INK }}
        aria-hidden
      />
    </div>
  );
}

/** Hard-bordered telemetry cell, used in the 4-up engineering strip. */
function TelemetryCell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 bg-[#0A0A0A] p-4 lg:p-5">
      <div className="font-mono text-[9px] uppercase tracking-[0.28em] opacity-50">
        {label}
      </div>
      <div className="font-mono text-[11px] uppercase tracking-[0.16em]">
        {children}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import type { AboutInfo, Experience } from "@shared";
import { Github, Linkedin, Twitter, Instagram, Download, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { useQuery } from "@tanstack/react-query";
import { DUMMY_EXPERIENCE } from "@/lib/dummy-data";

const BG     = "#0A0A0A";
const INK    = "#F2EFE6";
const ACCENT = "#FF3D00";

/* ─── noise + grid overlays (same as projects/skills) ───────────────────── */
function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] opacity-[0.055]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
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
          style={{ left: `${x}%`, background: "rgba(242,239,230,0.03)" }}
        />
      ))}
    </div>
  );
}

/* ─── scramble hook ─────────────────────────────────────────────────────── */
function useScramble(target: string, ms: number, active: boolean) {
  const [out, setOut] = useState(target);
  useEffect(() => {
    if (!active) { setOut(target); return; }
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░<>/\\";
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const head = Math.floor(t * (target.length + 4));
      let s = "";
      for (let i = 0; i < target.length; i++) {
        const ch = target[i];
        if (i < head - 4) s += ch;
        else if (ch === " " || ch === "." || ch === "-") s += ch;
        else s += glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      setOut(s);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setOut(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, ms, active]);
  return out;
}

/* ─── props ─────────────────────────────────────────────────────────────── */
interface AboutSectionProps {
  aboutInfo: AboutInfo;
  isLoading: boolean;
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════════════════════ */
export function AboutSection({ aboutInfo, isLoading }: AboutSectionProps) {
  const { data: rawExperience = [] } = useQuery<Experience[]>({
    queryKey: ["/api/experience"],
  });

  const experienceEntries = [...(rawExperience.length > 0 ? rawExperience : DUMMY_EXPERIENCE)].sort(
    (a, b) => {
      const aEnd = a.endYear ?? 9999;
      const bEnd = b.endYear ?? 9999;
      if (bEnd !== aEnd) return bEnd - aEnd;
      return b.startYear - a.startYear;
    }
  );

  if (isLoading || !aboutInfo) {
    return (
      <section
        id="about"
        className="snap-screen flex min-h-screen items-center px-6 lg:px-10"
        style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-40">
          LOADING PROFILE…
        </span>
      </section>
    );
  }

  const initials = aboutInfo.name
    .split(" ").filter(Boolean).slice(0, 2)
    .map((n) => n[0]?.toUpperCase()).join("");

  const socials = [
    { url: aboutInfo.githubUrl,    Icon: Github,    name: "github",    testId: "link-about-github"    },
    { url: aboutInfo.linkedinUrl,  Icon: Linkedin,  name: "linkedin",  testId: "link-about-linkedin"  },
    { url: aboutInfo.twitterUrl,   Icon: Twitter,   name: "twitter",   testId: "link-about-twitter"   },
    { url: aboutInfo.instagramUrl, Icon: Instagram, name: "instagram", testId: "link-about-instagram" },
  ].filter((s) => Boolean(s.url));

  const stats = [
    { label: "PROJECTS",   value: aboutInfo.completedProjects ?? 0,  suffix: "+" },
    { label: "CLIENTS",    value: aboutInfo.totalClients      ?? 0,  suffix: "+" },
    { label: "YEARS EXP",  value: aboutInfo.yearsExperience   ?? 0,  suffix: "+" },
    { label: "TECH STACK", value: aboutInfo.technologiesCount ?? 0,  suffix: "+" },
  ];

  return (
    <section
      id="about"
      className="snap-screen relative min-h-screen overflow-hidden px-6 py-20 lg:px-10"
      style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
    >
      <NoiseOverlay />
      <GridLines />

      {/* Ghost watermark */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          right: -20,
          zIndex: 0,
          fontFamily: "Inter, sans-serif",
          fontWeight: 900,
          fontSize: "clamp(120px, 22vw, 340px)",
          lineHeight: 0.82,
          letterSpacing: "-0.06em",
          textTransform: "uppercase",
          color: INK,
          opacity: 0.025,
          userSelect: "none",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        ABOUT
      </div>

      <div className="relative z-[3] mx-auto w-full max-w-[1400px]">

        {/* ── Section header — consistent with all other sections ── */}
        <Reveal>
          <SectionHeader
            num="06"
            name="ABOUT"
            kicker="// OPERATOR PROFILE"
            headline="THE PERSON BEHIND THE COMMITS"
          />
        </Reveal>

        {/* ── Identity band ── */}
        <Reveal delay={160}>
          <div
            className="mt-10 flex flex-col lg:flex-row"
            style={{ border: `2px solid ${INK}` }}
          >
            {/* ── LEFT: Avatar accent block (~25% on desktop, full width on mobile) ── */}
            <div
              className="relative flex shrink-0 items-center justify-center w-full lg:w-[25%]"
              style={{
                minHeight: 280,
                background: ACCENT,
                color: BG,
              }}
            >
              {aboutInfo.avatarUrl ? (
                <img
                  src={aboutInfo.avatarUrl}
                  alt={aboutInfo.name}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ filter: "grayscale(100%) contrast(1.15)" }}
                />
              ) : (
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 900,
                    fontSize: "clamp(36px, 5vw, 80px)",
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                    userSelect: "none",
                  }}
                >
                  {initials}
                </span>
              )}

              {/* Availability badge */}
              <div
                className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.2em]"
                style={{ color: BG, display: "flex", alignItems: "center", gap: 6 }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: aboutInfo.availableForWork ? BG : "rgba(0,0,0,0.4)",
                    display: "inline-block",
                  }}
                />
                {aboutInfo.availableForWork ? "AVAILABLE FOR WORK" : "NOT AVAILABLE"}
              </div>

              <div
                className="absolute right-4 top-4 font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color: BG, opacity: 0.7 }}
              >
                [ ID_001 ]
              </div>
            </div>

            {/* ── MIDDLE: Bio / name / socials ── */}
            <div
              className="flex flex-1 flex-col justify-between gap-6 px-6 sm:px-8 py-8 sm:py-10"
              style={{ borderTop: `2px solid ${INK}`, borderLeft: "none" }}
            >
              {/* Engineer label */}
              <div
                className="font-mono text-[11px] uppercase tracking-[0.25em]"
                style={{ color: ACCENT }}
              >
                // FULL_STACK_ENGINEER
              </div>

              {/* Name */}
              <h3
                data-testid="text-about-name"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(20px, 2.5vw, 36px)",
                  lineHeight: 0.92,
                  letterSpacing: "-0.04em",
                  textTransform: "uppercase",
                }}
              >
                {aboutInfo.name}
              </h3>

              {/* Title subtitle */}
              <div
                className="font-mono text-[11px] uppercase tracking-[0.22em]"
                style={{ opacity: 0.5 }}
              >
                {aboutInfo.title}
              </div>

              {/* Bio */}
              <p
                data-testid="text-about-bio"
                style={{
                  fontSize: "clamp(14px, 1.4vw, 18px)",
                  lineHeight: 1.65,
                  opacity: 0.85,
                  flexGrow: 1,
                }}
              >
                {aboutInfo.bio}
              </p>

              {/* CTA + socials - stacked on mobile, row on desktop */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 pt-2">
                {aboutInfo.resumeUrl && (
                  <a
                    href={aboutInfo.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    data-testid="button-download-resume"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.22em] w-full sm:w-auto"
                    style={{ background: INK, color: BG, border: `2px solid ${INK}`, transition: "none" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = ACCENT;
                      e.currentTarget.style.color = INK;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = INK;
                      e.currentTarget.style.color = BG;
                    }}
                  >
                    <Download className="h-3.5 w-3.5" />
                    RESUME.PDF
                  </a>
                )}
                {/* Social links grid - 4 columns on mobile, inline on desktop */}
                <div className="grid grid-cols-4 gap-3 sm:flex sm:flex-wrap w-full sm:w-auto">
                  {socials.map(({ url, Icon, name, testId }, i) => (
                    <AboutSocialTile
                      key={name}
                      href={url ?? "#"}
                      Icon={Icon}
                      label={name}
                      testId={testId}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </Reveal>

        {/* ── Stat strip — bordered left/right/bottom, dividers between cells ── */}
        <Reveal delay={220}>
          <div
            className="grid grid-cols-2 sm:grid-cols-4 items-stretch"
            style={{
              borderLeft: `2px solid ${INK}`,
              borderRight: `2px solid ${INK}`,
              borderBottom: `2px solid ${INK}`,
            }}
          >
            {stats.map((s, i) => (
              <StatNumber key={s.label} stat={s} index={i} total={stats.length} />
            ))}
          </div>
        </Reveal>

        {/* ── Career log — editorial layout ── */}
        {experienceEntries.length > 0 && (
          <Reveal delay={300}>
            <div>
              {/* Career header */}
              <div
                className="flex items-center justify-between py-4"
                style={{ borderBottom: `2px solid ${INK}` }}
              >
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.26em]"
                  style={{ color: ACCENT }}
                >
                  // CAREER_LOG
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-45">
                  {experienceEntries.length}&nbsp;ENTRIES
                </span>
              </div>

              {/* Entries */}
              {experienceEntries.map((entry, i) => (
                <CareerEntry
                  key={entry.id}
                  entry={entry}
                  index={experienceEntries.length - 1 - i}
                  isLast={i === experienceEntries.length - 1}
                />
              ))}
            </div>
          </Reveal>
        )}

      </div>
    </section>
  );
}

/* ─── AboutSocialTile — instant hard invert matching hero BrutButton ─────── */
function AboutSocialTile({
  href, Icon, label, testId,
}: {
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  testId: string;
  index: number;
}) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={testId}
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center outline-none"
      style={{
        background: hover ? ACCENT : "transparent",
        color: hover ? INK : INK,
        border: `2px solid ${INK}`,
        transition: "none",
      }}
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

/* ─── StatNumber — big free-flowing number, no grid cell box ────────────── */
function StatNumber({
  stat, index, total,
}: {
  stat: { label: string; value: number; suffix: string };
  index: number;
  total: number;
}) {
  const [hover, setHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Determine if we should show right border
  const showRightBorder = isMobile 
    ? (index % 2 === 0 && index < total - 1)
    : (index < total - 1);

  // Determine if we should show bottom border (only on mobile for first 2 items)
  const showBottomBorder = isMobile && index < 2;

  return (
    <div
      className="relative flex flex-1 flex-col justify-center px-4 sm:px-6 py-6 sm:py-8"
      style={{
        borderRight: showRightBorder ? `2px solid ${INK}` : "none",
        borderBottom: showBottomBorder ? `2px solid ${INK}` : "none",
        minWidth: 120,
        cursor: "default",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Subtle hover fill */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: ACCENT,
          opacity: hover ? 1 : 0,
          pointerEvents: "none",
        }}
      />
      <div className="relative z-[1]">
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(28px, 3.5vw, 52px)",
            lineHeight: 0.9,
            letterSpacing: "-0.045em",
            color: hover ? BG : INK,
          }}
        >
          {stat.value}
          <span
            style={{
              fontSize: "0.38em",
              fontWeight: 700,
              opacity: 0.6,
              letterSpacing: "-0.01em",
            }}
          >
            {stat.suffix}
          </span>
        </div>
        <div
          className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em]"
          style={{ color: hover ? BG : ACCENT, opacity: hover ? 0.8 : 1 }}
        >
          {stat.label}
        </div>
      </div>
    </div>
  );
}

/* ─── CareerEntry — editorial, not tabular ──────────────────────────────── */
function CareerEntry({
  entry, index, isLast,
}: {
  entry: Experience;
  index: number;
  isLast: boolean;
}) {
  const [hover, setHover] = useState(false);
  const roleText = entry.role.toUpperCase();
  const scrambled = useScramble(roleText, 480, hover);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderBottom: isLast ? "none" : `1px solid ${INK}18`,
        paddingTop: 24,
        paddingBottom: isLast ? 0 : 24,
        cursor: "default",
      }}
    >
      <div
        className="flex flex-col lg:flex-row gap-4 lg:gap-10"
        style={{ alignItems: "flex-start" }}
      >
        {/* ── Year column — editorial anchor ── */}
        <div
          className="shrink-0 lg:w-[160px]"
          style={{ userSelect: "none" }}
        >
          {/* Years in single line on mobile, stacked on desktop */}
          <div className="flex lg:flex-col items-center lg:items-start gap-2 lg:gap-0">
            {/* End year / PRESENT */}
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(16px, 2vw, 36px)",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: hover ? ACCENT : INK,
              }}
            >
              {entry.endYear ?? "NOW"}
            </div>

            {/* Connecting spine - horizontal on mobile, vertical on desktop */}
            <div
              className="lg:hidden"
              style={{
                width: 20,
                height: 2,
                background: hover ? ACCENT : INK,
                opacity: hover ? 0.6 : 0.2,
              }}
            />
            <div
              className="hidden lg:block"
              style={{
                width: 2,
                height: 28,
                background: hover ? ACCENT : INK,
                opacity: hover ? 0.6 : 0.2,
                margin: "8px 0 8px 4px",
              }}
            />

            {/* Start year */}
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(14px, 1.5vw, 28px)",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                opacity: hover ? 0.7 : 0.35,
                color: hover ? ACCENT : INK,
              }}
            >
              {entry.startYear}
            </div>
          </div>

          {/* Index tag */}
          <div
            className="mt-2 lg:mt-4 font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{ opacity: 0.3, color: INK }}
          >
            E-{String(index + 1).padStart(3, "0")}
          </div>
        </div>

        {/* ── Content column ── */}
        <div className="flex-1">
          {/* Role — massive, scrambles on hover */}
          <h3
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(18px, 2.5vw, 48px)",
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
              textTransform: "uppercase",
              color: hover ? ACCENT : INK,
            }}
          >
            {hover ? (
              <span style={{ display: "inline-block", whiteSpace: "pre-wrap" }}>
                {scrambled || "\u00A0"}
              </span>
            ) : (
              roleText
            )}
          </h3>

          {/* Company + type inline */}
          <div
            className="mt-3 flex flex-wrap items-center gap-3"
          >
            <span
              className="font-mono text-[12px] uppercase tracking-[0.2em]"
              style={{ color: hover ? INK : ACCENT }}
            >
              @ {entry.company}
            </span>
            <span
              className="px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em]"
              style={{
                border: `1.5px solid ${hover ? INK : ACCENT}`,
                color: hover ? INK : ACCENT,
              }}
            >
              {entry.type}
            </span>
          </div>

          {/* Description — always visible, dims when not hovered */}
          {entry.description && (
            <p
              className="mt-4 text-[14px] leading-relaxed"
              style={{
                opacity: hover ? 0.85 : 0.5,
                color: INK,
                maxWidth: 680,
              }}
            >
              {entry.description}
            </p>
          )}

          {/* Thin accent underline on hover */}
          <div
            style={{
              marginTop: 16,
              height: 2,
              background: ACCENT,
              width: hover ? "100%" : 0,
              maxWidth: 400,
              transition: "width 0.35s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

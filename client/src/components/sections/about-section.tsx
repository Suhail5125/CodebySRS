import { useState, useEffect, useRef } from "react";
import type { AboutInfo, Experience } from "@shared";
import { Github, Linkedin, Twitter, Instagram, Download } from "lucide-react";
import { Reveal } from "@/components/reveal";
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
      className="snap-screen relative min-h-screen overflow-hidden"
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

      <div className="relative z-[3] mx-auto w-full max-w-[1400px] px-6 lg:px-10">

        {/* ── Top label bar ── */}
        <Reveal>
          <div
            className="flex items-center justify-between py-5"
            style={{ borderBottom: `2px solid ${INK}` }}
          >
            <div className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.22em]">
              <span style={{ color: ACCENT }}>[ SECTION 06 ]</span>
              <span style={{ opacity: 0.4 }}>/</span>
              <span style={{ opacity: 0.7 }}>ABOUT</span>
              <span style={{ opacity: 0.4 }}>/</span>
              <span style={{ color: ACCENT }}>// OPERATOR_PROFILE</span>
            </div>
            {aboutInfo.location && (
              <span
                className="hidden font-mono text-[11px] uppercase tracking-[0.22em] lg:block"
                style={{ opacity: 0.5 }}
              >
                {aboutInfo.location}
              </span>
            )}
          </div>
        </Reveal>

        {/* ── Main headline ── */}
        <Reveal delay={80}>
          <div className="overflow-hidden py-6" style={{ borderBottom: `2px solid ${INK}` }}>
            <div
              className="font-mono text-[11px] uppercase tracking-[0.25em] mb-3"
              style={{ color: ACCENT }}
            >
              // THE PERSON BEHIND THE COMMITS
            </div>
            <h2
              data-testid="text-about-name"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(52px, 10vw, 148px)",
                lineHeight: 0.88,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {aboutInfo.name}
            </h2>
            <div
              className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em]"
              style={{ opacity: 0.45 }}
            >
              {aboutInfo.title}
            </div>
          </div>
        </Reveal>

        {/* ── Identity band — asymmetric ── */}
        <Reveal delay={160}>
          <div
            className="flex flex-col lg:flex-row"
            style={{ borderBottom: `2px solid ${INK}` }}
          >
            {/* Avatar — tall accent block */}
            <div
              className="relative flex shrink-0 items-center justify-center lg:w-[28%]"
              style={{
                minHeight: 340,
                background: ACCENT,
                color: BG,
                borderRight: `2px solid ${INK}`,
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
                    fontSize: "clamp(72px, 10vw, 152px)",
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

            {/* Bio + vitals */}
            <div className="flex flex-1 flex-col justify-between gap-8 px-8 py-10">

              {/* Bio */}
              <p
                data-testid="text-about-bio"
                style={{
                  fontSize: "clamp(15px, 1.6vw, 20px)",
                  lineHeight: 1.65,
                  opacity: 0.88,
                  maxWidth: 680,
                }}
              >
                {aboutInfo.bio}
              </p>

              {/* CTA + socials row */}
              <div className="flex flex-wrap items-center gap-3">
                {aboutInfo.resumeUrl && (
                  <a
                    href={aboutInfo.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    data-testid="button-download-resume"
                    className="inline-flex items-center gap-2 px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.22em]"
                    style={{ background: INK, color: BG, border: `2px solid ${INK}` }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = ACCENT;
                      e.currentTarget.style.borderColor = ACCENT;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = INK;
                      e.currentTarget.style.borderColor = INK;
                    }}
                  >
                    <Download className="h-3.5 w-3.5" />
                    RESUME.PDF
                  </a>
                )}
                {socials.map(({ url, Icon, name, testId }) => (
                  <a
                    key={name}
                    href={url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={testId}
                    aria-label={name}
                    className="inline-flex h-11 w-11 items-center justify-center"
                    style={{ border: `2px solid ${INK}`, color: INK }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = ACCENT;
                      e.currentTarget.style.borderColor = ACCENT;
                      e.currentTarget.style.color = BG;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = INK;
                      e.currentTarget.style.color = INK;
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>

              {/* Vitals — inline chips */}
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {[
                  { k: "EMAIL",    v: aboutInfo.email        },
                  { k: "PHONE",    v: aboutInfo.phone        },
                  { k: "REPLY",    v: aboutInfo.responseTime },
                  { k: "HOURS",    v: aboutInfo.workingHours },
                ].filter(({ v }) => Boolean(v)).map(({ k, v }) => (
                  <div key={k} className="font-mono text-[11px] uppercase tracking-[0.16em]">
                    <span style={{ color: ACCENT }}>{k}</span>
                    <span style={{ opacity: 0.35, margin: "0 6px" }}>·</span>
                    <span style={{ opacity: 0.75 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Stat strip — flowing numbers, no grid cells ── */}
        <Reveal delay={220}>
          <div
            className="flex flex-wrap items-stretch"
            style={{ borderBottom: `2px solid ${INK}` }}
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
                  index={i}
                  isLast={i === experienceEntries.length - 1}
                />
              ))}
            </div>
          </Reveal>
        )}

        {/* ── Bottom padding ── */}
        <div className="pb-16" />
      </div>
    </section>
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

  return (
    <div
      className="relative flex flex-1 flex-col justify-center px-6 py-8"
      style={{
        borderRight: index < total - 1 ? `2px solid ${INK}` : "none",
        minWidth: 140,
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
            fontSize: "clamp(44px, 5.5vw, 80px)",
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
        paddingTop: 40,
        paddingBottom: 40,
        cursor: "default",
      }}
    >
      <div
        className="flex flex-col gap-6 lg:flex-row lg:gap-10"
        style={{ alignItems: "flex-start" }}
      >
        {/* ── Year column — editorial anchor ── */}
        <div
          className="shrink-0 lg:w-[160px]"
          style={{ userSelect: "none" }}
        >
          {/* End year / PRESENT */}
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(28px, 3.5vw, 52px)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: hover ? ACCENT : INK,
            }}
          >
            {entry.endYear ?? "NOW"}
          </div>

          {/* Connecting spine */}
          <div
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
              fontSize: "clamp(22px, 2.5vw, 36px)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              opacity: hover ? 0.7 : 0.35,
              color: hover ? ACCENT : INK,
            }}
          >
            {entry.startYear}
          </div>

          {/* Index tag */}
          <div
            className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em]"
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
              fontSize: "clamp(24px, 4.5vw, 68px)",
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

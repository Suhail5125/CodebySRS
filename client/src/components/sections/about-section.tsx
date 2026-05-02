import { useState } from "react";
import type { AboutInfo } from "@shared";
import { Github, Linkedin, Twitter, Instagram, Download, ArrowUpRight } from "lucide-react";

const BG = "#0A0A0A";
const INK = "#F2EFE6";
const ACCENT = "#FF3D00";

interface AboutSectionProps {
  aboutInfo: AboutInfo;
  isLoading: boolean;
}

export function AboutSection({ aboutInfo, isLoading }: AboutSectionProps) {
  if (isLoading || !aboutInfo) {
    return (
      <section
        id="about"
        className="px-6 py-24 lg:px-10"
        style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
      >
        <div className="mx-auto max-w-[1400px] font-mono text-[11px] uppercase tracking-[0.2em] opacity-60">
          LOADING PROFILE…
        </div>
      </section>
    );
  }

  const stats = [
    { label: "PROJECTS", value: aboutInfo.completedProjects ?? 0, suffix: "+" },
    { label: "CLIENTS", value: aboutInfo.totalClients ?? 0, suffix: "+" },
    { label: "YEARS", value: aboutInfo.yearsExperience ?? 0, suffix: "+" },
    { label: "TECH", value: aboutInfo.technologiesCount ?? 0, suffix: "+" },
  ];

  const initials = aboutInfo.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

  const socials = [
    { url: aboutInfo.githubUrl, Icon: Github, name: "github", testId: "link-about-github" },
    { url: aboutInfo.linkedinUrl, Icon: Linkedin, name: "linkedin", testId: "link-about-linkedin" },
    { url: aboutInfo.twitterUrl, Icon: Twitter, name: "twitter", testId: "link-about-twitter" },
    { url: aboutInfo.instagramUrl, Icon: Instagram, name: "instagram", testId: "link-about-instagram" },
  ].filter((s) => Boolean(s.url));

  return (
    <section
      id="about"
      className="relative px-6 py-24 lg:px-10"
      style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader
          num="06"
          name="ABOUT"
          kicker="// OPERATOR PROFILE"
          headline="THE PERSON BEHIND THE COMMITS"
          right={aboutInfo.location ?? undefined}
        />

        {/* Identity strip */}
        <div
          className="mt-10 grid grid-cols-1 gap-0 lg:grid-cols-12"
          style={{ border: `2px solid ${INK}` }}
        >
          {/* Avatar block */}
          <div
            className="relative flex items-center justify-center lg:col-span-3"
            style={{
              borderRight: `2px solid ${INK}`,
              minHeight: 280,
              background: ACCENT,
              color: BG,
            }}
          >
            {aboutInfo.avatarUrl ? (
              <img
                src={aboutInfo.avatarUrl}
                alt={aboutInfo.name}
                className="h-full w-full object-cover"
                style={{ filter: "grayscale(100%) contrast(1.1)" }}
              />
            ) : (
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(80px, 10vw, 160px)",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                }}
              >
                {initials}
              </div>
            )}
            <div
              className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: BG }}
            >
              [ ID_001 ]
            </div>
            <div
              className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: BG }}
            >
              {aboutInfo.availableForWork ? "AVAILABLE" : "BOOKED"}
            </div>
          </div>

          {/* Name + title + bio */}
          <div className="px-6 py-8 lg:col-span-6" style={{ borderRight: `2px solid ${INK}` }}>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
              // FULL_STACK_ENGINEER
            </div>
            <h3
              data-testid="text-about-name"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(36px, 5vw, 64px)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
              }}
            >
              {aboutInfo.name}
            </h3>
            <div
              data-testid="text-about-title"
              className="mt-2 font-mono text-[12px] uppercase tracking-[0.22em]"
              style={{ opacity: 0.8 }}
            >
              {aboutInfo.title}
            </div>
            <div className="my-5 h-[2px] w-16" style={{ background: ACCENT }} />
            <p
              data-testid="text-about-bio"
              className="text-[14px] leading-relaxed"
              style={{ opacity: 0.9 }}
            >
              {aboutInfo.bio}
            </p>

            {/* CTA + socials */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {aboutInfo.resumeUrl && (
                <a
                  href={aboutInfo.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  data-testid="button-download-resume"
                  className="inline-flex items-center gap-3 px-5 py-3 font-mono text-[12px] font-bold uppercase tracking-[0.22em]"
                  style={{ background: INK, color: BG, border: `2px solid ${INK}`, transition: "none" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = ACCENT;
                    e.currentTarget.style.color = BG;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = INK;
                    e.currentTarget.style.color = BG;
                  }}
                >
                  <Download className="h-4 w-4" />
                  <span>RESUME.PDF</span>
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
                  style={{ border: `2px solid ${INK}`, transition: "none" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = ACCENT;
                    e.currentTarget.style.color = BG;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = INK;
                  }}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Vital signs */}
          <div className="lg:col-span-3">
            <Vital k="EMAIL" v={aboutInfo.email ?? "—"} />
            <Vital k="PHONE" v={aboutInfo.phone ?? "—"} />
            <Vital k="LOCATION" v={aboutInfo.location ?? "—"} />
            <Vital k="REPLY" v={aboutInfo.responseTime ?? "—"} />
            <Vital k="HOURS" v={aboutInfo.workingHours ?? "—"} last />
          </div>
        </div>

        {/* Stat grid */}
        <div
          className="grid grid-cols-2 gap-0 lg:grid-cols-4"
          style={{ border: `2px solid ${INK}`, borderTop: "none" }}
        >
          {stats.map((s, i) => (
            <StatCell key={s.label} stat={s} index={i} total={stats.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Vital({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em]"
      style={{ borderBottom: last ? "none" : `2px solid ${INK}` }}
    >
      <span style={{ color: ACCENT }}>{k}</span>
      <span className="truncate text-right" style={{ opacity: 0.85, marginLeft: 8 }}>{v}</span>
    </div>
  );
}

function StatCell({
  stat,
  index,
  total,
}: {
  stat: { label: string; value: number; suffix: string };
  index: number;
  total: number;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="px-5 py-6"
      style={{
        background: hover ? ACCENT : "transparent",
        color: hover ? BG : INK,
        borderRight: index < total - 1 ? `2px solid ${INK}` : "none",
        transition: "none",
      }}
    >
      <div
        className="font-mono text-[10px] uppercase tracking-[0.22em]"
        style={{ color: hover ? BG : ACCENT }}
      >
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
      <div
        className="mt-2 flex items-baseline gap-1"
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 800,
          fontSize: "clamp(40px, 5vw, 64px)",
          lineHeight: 1,
          letterSpacing: "-0.04em",
        }}
      >
        <span>{stat.value}</span>
        <span style={{ fontSize: "0.55em", opacity: 0.7 }}>{stat.suffix}</span>
      </div>
      <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em]" style={{ opacity: 0.85 }}>
        {stat.label}
      </div>
    </div>
  );
}

function SectionHeader({
  num,
  name,
  kicker,
  headline,
  right,
}: {
  num: string;
  name: string;
  kicker: string;
  headline: string;
  right?: string;
}) {
  return (
    <header className="grid grid-cols-12 gap-x-6">
      <aside className="col-span-12 mb-6 lg:col-span-2 lg:mb-0">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
          [ SECTION {num} ]
        </div>
        <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] opacity-70">
          / {name}
        </div>
        <div className="mt-3 h-[2px] w-12" style={{ background: ACCENT }} />
      </aside>
      <div className="col-span-12 lg:col-span-10">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
            {kicker}
          </span>
          {right && (
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-70">
              {right}
            </span>
          )}
        </div>
        <h2
          className="mt-2"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(40px, 7vw, 96px)",
            lineHeight: 0.92,
            letterSpacing: "-0.035em",
            textTransform: "uppercase",
          }}
        >
          {headline}
        </h2>
      </div>
    </header>
  );
}

import { Github, Linkedin, Twitter, Instagram, ArrowUpRight } from "lucide-react";
import type { AboutInfo } from "@shared";

const BG = "#0A0A0A";
const INK = "#F2EFE6";
const ACCENT = "#FF3D00";

interface FooterProps {
  aboutInfo?: AboutInfo | null;
}

const TICKER_ITEMS = [
  "FULL STACK ENGINEERING",
  "REACT // NEXT.JS // NODE",
  "3D // WEBGL // THREE.JS",
  "PERFORMANCE AUDITS",
  "DESIGN SYSTEMS",
  "TYPESCRIPT // TAILWIND",
  "POSTGRES // PRISMA",
  "MOBILE APPS // PWA",
  "API ARCHITECTURE",
  "UI // UX ENGINEERING",
];

const PROCESS_LOG = [
  { time: "12:04", tag: "OK",   tagColor: ACCENT,   msg: "DEPLOY build.2501 — production live" },
  { time: "11:59", tag: "OK",   tagColor: ACCENT,   msg: "LINT passed — 0 errors, 0 warnings" },
  { time: "11:52", tag: "OK",   tagColor: ACCENT,   msg: "TEST suite — 142 passed, 0 failed" },
  { time: "11:48", tag: "INFO", tagColor: "#A0A09A", msg: "BUILD types — tsc --noEmit clean" },
  { time: "11:31", tag: "OK",   tagColor: ACCENT,   msg: "MIGRATE schema — 3 tables updated" },
  { time: "11:20", tag: "WARN", tagColor: "#F5A623", msg: "BUNDLE size — +14KB vs threshold" },
  { time: "10:55", tag: "INFO", tagColor: "#A0A09A", msg: "ENV secrets — loaded 12 variables" },
  { time: "10:44", tag: "OK",   tagColor: ACCENT,   msg: "CI pipeline — all checks passed" },
];

export function Footer({ aboutInfo }: FooterProps) {
  const year = new Date().getFullYear();

  const socials = [
    ...(aboutInfo?.githubUrl    ? [{ Icon: Github,    href: aboutInfo.githubUrl,    name: "github"    }] : []),
    ...(aboutInfo?.linkedinUrl  ? [{ Icon: Linkedin,  href: aboutInfo.linkedinUrl,  name: "linkedin"  }] : []),
    ...(aboutInfo?.twitterUrl   ? [{ Icon: Twitter,   href: aboutInfo.twitterUrl,   name: "twitter"   }] : []),
    ...(aboutInfo?.instagramUrl ? [{ Icon: Instagram, href: aboutInfo.instagramUrl, name: "instagram" }] : []),
  ];

  const tickerItem = (item: string, prefix: string, i: number) => (
    <span key={`${prefix}-${i}`} className="inline-flex items-center gap-0 shrink-0">
      <span className="px-6 font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: INK }}>
        {item}
      </span>
      <span className="font-mono text-[11px] shrink-0" style={{ color: ACCENT }}>{"  //  "}</span>
    </span>
  );

  return (
    <footer
      id="footer"
      className="relative overflow-hidden"
      style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
    >
      {/* ── TICKER STRIP ─────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="overflow-hidden"
        style={{ borderBottom: `2px solid ${INK}`, background: BG }}
      >
        <div className="footer-ticker flex whitespace-nowrap py-3">
          {TICKER_ITEMS.map((item, i) => tickerItem(item, "a", i))}
          {TICKER_ITEMS.map((item, i) => tickerItem(item, "b", i))}
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">

        {/* ── EOF BLOCK ────────────────────────────────────────────────────── */}
        <div className="py-14 lg:py-20">
          <h2
            aria-label="SYSTEM_SHUTDOWN"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(80px, 14vw, 180px)",
              lineHeight: 0.88,
              letterSpacing: "-0.035em",
              textTransform: "uppercase",
              color: INK,
            }}
          >
            EOF
            <span className="eof-cursor" style={{ color: ACCENT }}>▋</span>
          </h2>
          <div
            className="mt-4 font-mono text-[11px] uppercase tracking-[0.28em]"
            style={{ color: ACCENT }}
          >
            // SYSTEM_SHUTDOWN · ALL PROCESSES TERMINATED
          </div>
        </div>

        {/* ── THREE-ZONE GRID ──────────────────────────────────────────────── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12"
          style={{ borderTop: `2px solid ${INK}`, borderBottom: `2px solid ${INK}` }}
        >

          {/* ZONE A — PROCESS LOG */}
          <div
            className="col-span-1 lg:col-span-4 px-5 py-8 border-b-2 border-[#F2EFE6] lg:border-b-0 lg:border-r-2"
          >
            <ZoneLabel index="A" label="PROCESS_LOG" />
            <ul className="mt-5 space-y-2.5" role="log" aria-label="Build process log">
              {PROCESS_LOG.map((entry, i) => (
                <li key={i} className="flex items-baseline gap-2 font-mono text-[11px]">
                  <span style={{ color: INK, opacity: 0.35, flexShrink: 0 }}>
                    [{entry.time}]
                  </span>
                  <span
                    className="font-bold shrink-0"
                    style={{ color: entry.tagColor, minWidth: 36 }}
                  >
                    {entry.tag}
                  </span>
                  <span style={{ opacity: 0.7 }}>{entry.msg}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ZONE B — BRAND SPINE */}
          <div
            className="col-span-1 lg:col-span-4 px-5 py-8 flex flex-col justify-between gap-8 border-b-2 border-[#F2EFE6] lg:border-b-0 lg:border-r-2"
          >
            <ZoneLabel index="B" label="BRAND_SPINE" />
            <div
              className="pl-5 flex flex-col gap-4"
              style={{ borderLeft: `4px solid ${ACCENT}` }}
            >
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(28px, 3.5vw, 48px)",
                  lineHeight: 0.92,
                  letterSpacing: "-0.03em",
                  textTransform: "uppercase",
                }}
              >
                CodeBy<span style={{ color: ACCENT }}>SRS</span>
              </div>
              <p className="font-mono text-[12px] leading-snug" style={{ opacity: 0.65, maxWidth: 280 }}>
                Brutalist engineering — no decoration, only signal. Every line ships or it dies.
              </p>
              <a
                href="#contact"
                className="mt-2 self-start inline-flex items-center gap-3 px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.22em]"
                style={{ background: INK, color: BG, border: `2px solid ${INK}`, transition: "none" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = ACCENT;
                  e.currentTarget.style.color = BG;
                  e.currentTarget.style.borderColor = ACCENT;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = INK;
                  e.currentTarget.style.color = BG;
                  e.currentTarget.style.borderColor = INK;
                }}
              >
                <span>OPEN A TICKET</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* ZONE C — SIGNAL DATA */}
          <div
            className="col-span-1 lg:col-span-4 px-5 py-8"
          >
            <ZoneLabel index="C" label="SIGNAL_DATA" />
            <dl className="mt-5 space-y-3">
              {aboutInfo?.email && (
                <SignalRow
                  label="EMAIL"
                  href={`mailto:${aboutInfo.email}`}
                  testId="link-footer-email"
                >
                  {aboutInfo.email}
                </SignalRow>
              )}
              {aboutInfo?.phone && (
                <SignalRow
                  label="PHONE"
                  href={`tel:${aboutInfo.phone}`}
                  testId="link-footer-phone"
                >
                  {aboutInfo.phone}
                </SignalRow>
              )}
              {aboutInfo?.location && (
                <SignalRow label="LOCATION">
                  {aboutInfo.location}
                </SignalRow>
              )}

              <SignalRow label="HOURS">09 AM – 06 PM EST</SignalRow>

              {/* Availability with pulse dot */}
              <div className="flex items-center gap-2 font-mono text-[11px] pt-1">
                <dt className="uppercase tracking-[0.2em]" style={{ color: INK, opacity: 0.45, flexShrink: 0 }}>
                  STATUS:
                </dt>
                <dd className="flex items-center gap-2 uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                  <span
                    className="status-pulse"
                    style={{
                      display: "inline-block",
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: ACCENT,
                      flexShrink: 0,
                    }}
                  />
                  {aboutInfo?.availableForWork ? "AVAILABLE" : "BOOKED"}
                </dd>
              </div>

              {aboutInfo?.responseTime && (
                <SignalRow label="RESPONSE">
                  {aboutInfo.responseTime}
                </SignalRow>
              )}

              {/* Social icon row */}
              {socials.length > 0 && (
                <div className="flex items-center gap-2 pt-2">
                  {socials.map(({ Icon, href, name }) => (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`link-footer-${name}`}
                      aria-label={name}
                      className="inline-flex h-10 w-10 items-center justify-center"
                      style={{ border: `2px solid ${INK}`, transition: "none", color: INK }}
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
                      <Icon className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* ── SITEMAP ────────────────────────────────────────────────────────── */}
        <div
          className="py-6"
          style={{ borderBottom: `2px solid ${INK}` }}
        >
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] mb-4">
            <span style={{ color: ACCENT }}>[NAV]</span>
            <span style={{ opacity: 0.5 }}>/ SITEMAP</span>
          </div>
          <nav aria-label="Sitemap" className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: "HOME",     href: "#hero"     },
              { label: "ABOUT",    href: "#about"    },
              { label: "PROJECTS", href: "#projects" },
              { label: "SKILLS",   href: "#skills"   },
              { label: "CONTACT",  href: "#contact"  },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="font-mono text-[11px] uppercase tracking-[0.2em] inline-flex items-center gap-1.5"
                style={{ color: INK, transition: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                onMouseLeave={(e) => (e.currentTarget.style.color = INK)}
              >
                <span style={{ color: ACCENT, opacity: 0.6 }}>▸</span>
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* ── BOTTOM STATUS BAR ──────────────────────────────────────────────── */}
        <div
          className="flex flex-col items-start justify-between gap-2 py-4 font-mono text-[10px] uppercase tracking-[0.22em] md:flex-row md:items-center"
        >
          <div className="flex flex-wrap items-center gap-3" style={{ opacity: 0.6 }}>
            <span style={{ color: ACCENT }}>▶</span>
            <span>© {year} · CodeBySRS · All rights reserved</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <a
              href="/privacy"
              style={{ color: INK, transition: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={(e) => (e.currentTarget.style.color = INK)}
            >
              Privacy Policy
            </a>
            <span style={{ opacity: 0.4 }}>|</span>
            <a
              href="/terms"
              style={{ color: INK, transition: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={(e) => (e.currentTarget.style.color = INK)}
            >
              Terms of Service
            </a>
          </div>
          <div className="flex items-center gap-3" style={{ opacity: 0.6 }}>
            <span style={{ color: ACCENT }}>v2.1.0</span>
            <span>
              BUILD #{String(year).slice(-2)}.{String(new Date().getMonth() + 1).padStart(2, "0")}
            </span>
            <span style={{ color: ACCENT }}>✓ SYSTEM OK</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

function ZoneLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
      <span style={{ color: ACCENT }}>[{index}]</span>
      <span style={{ opacity: 0.5 }}>/ {label}</span>
    </div>
  );
}

function SignalRow({
  label,
  children,
  href,
  testId,
}: {
  label: string;
  children: React.ReactNode;
  href?: string;
  testId?: string;
}) {
  const valueStyle: React.CSSProperties = {
    color: INK,
    transition: "none",
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "11px",
    textTransform: "none" as const,
    letterSpacing: "0.04em",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  };

  const value = href ? (
    <a
      href={href}
      target={href.startsWith("mailto:") || href.startsWith("tel:") ? undefined : "_blank"}
      rel="noopener noreferrer"
      data-testid={testId}
      style={valueStyle}
      onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
      onMouseLeave={(e) => (e.currentTarget.style.color = INK)}
    >
      {children}
    </a>
  ) : (
    <span style={valueStyle}>{children}</span>
  );

  return (
    <div className="flex items-baseline gap-2 font-mono text-[11px] min-w-0">
      <dt
        className="uppercase tracking-[0.2em] shrink-0"
        style={{ color: INK, opacity: 0.45 }}
      >
        {label}:
      </dt>
      <dd className="min-w-0 overflow-hidden">{value}</dd>
    </div>
  );
}

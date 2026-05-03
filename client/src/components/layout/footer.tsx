import { Github, Linkedin, Twitter, Mail, Phone, MapPin, Clock, Instagram, ArrowUpRight } from "lucide-react";
import type { AboutInfo } from "@shared";

const BG = "#0A0A0A";
const INK = "#F2EFE6";
const ACCENT = "#FF3D00";

interface FooterProps {
  aboutInfo?: AboutInfo | null;
}

export function Footer({ aboutInfo }: FooterProps) {
  const year = new Date().getFullYear();

  const socials = [
    ...(aboutInfo?.githubUrl ? [{ Icon: Github, href: aboutInfo.githubUrl, name: "github" }] : []),
    ...(aboutInfo?.linkedinUrl ? [{ Icon: Linkedin, href: aboutInfo.linkedinUrl, name: "linkedin" }] : []),
    ...(aboutInfo?.twitterUrl ? [{ Icon: Twitter, href: aboutInfo.twitterUrl, name: "twitter" }] : []),
    ...(aboutInfo?.instagramUrl ? [{ Icon: Instagram, href: aboutInfo.instagramUrl, name: "instagram" }] : []),
  ];

  const navLinks = [
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#services", label: "Services" },
    { href: "#process", label: "Process" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <footer
      id="footer"
      className="relative px-6 lg:px-10"
      style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Manifesto block */}
        <div className="grid grid-cols-12 gap-x-6 py-16">
          <aside className="col-span-12 mb-6 lg:col-span-2 lg:mb-0">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
              [ END OF FILE ]
            </div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] opacity-70">
              / FOOTER
            </div>
            <div className="mt-3 h-[2px] w-12" style={{ background: ACCENT }} />
          </aside>
          <div className="col-span-12 lg:col-span-10">
            <h2
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(40px, 6.5vw, 88px)",
                lineHeight: 0.92,
                letterSpacing: "-0.035em",
                textTransform: "uppercase",
              }}
            >
              READY TO SHIP?
              <br />
              <span style={{ color: ACCENT }}>LET'S TALK.</span>
            </h2>
            <a
              href="#contact"
              className="mt-6 inline-flex items-center gap-3 px-5 py-3 font-mono text-[12px] font-bold uppercase tracking-[0.22em]"
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
              <span>OPEN A TICKET</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* 4-column grid */}
        <div
          className="grid grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-4"
          style={{ borderTop: `2px solid ${INK}`, borderBottom: `2px solid ${INK}` }}
        >
          {/* Brand */}
          <div className="px-5 py-6" style={{ borderRight: `2px solid ${INK}` }}>
            <ColTitle k="01" label="BRAND" />
            <div
              className="mt-3"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "32px",
                lineHeight: 1,
                letterSpacing: "-0.025em",
                textTransform: "uppercase",
              }}
            >
              CodeBy<span style={{ color: ACCENT }}>SRS</span>
            </div>
            <p className="mt-3 text-[12px] leading-snug" style={{ opacity: 0.75 }}>
              Brutalist engineering — no decoration, only signal. Built in {year}.
            </p>
          </div>

          {/* Contact */}
          <div className="px-5 py-6" style={{ borderRight: `2px solid ${INK}` }}>
            <ColTitle k="02" label="CONTACT" />
            <div className="mt-3 space-y-2">
              {aboutInfo?.email && (
                <a
                  href={`mailto:${aboutInfo.email}`}
                  data-testid="link-footer-email"
                  className="flex items-center gap-2 font-mono text-[12px]"
                  style={{ color: INK, transition: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = INK)}
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{aboutInfo.email}</span>
                </a>
              )}
              {aboutInfo?.phone && (
                <a
                  href={`tel:${aboutInfo.phone}`}
                  data-testid="link-footer-phone"
                  className="flex items-center gap-2 font-mono text-[12px]"
                  style={{ color: INK, transition: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = INK)}
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>{aboutInfo.phone}</span>
                </a>
              )}
              {aboutInfo?.location && (
                <div className="flex items-center gap-2 font-mono text-[12px]" style={{ opacity: 0.85 }}>
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{aboutInfo.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Sitemap */}
          <div className="px-5 py-6" style={{ borderRight: `2px solid ${INK}` }}>
            <ColTitle k="03" label="SITEMAP" />
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="font-mono text-[12px] uppercase tracking-[0.16em]"
                    style={{ color: INK, transition: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = INK)}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Status / Socials */}
          <div className="px-5 py-6">
            <ColTitle k="04" label="CHANNELS" />
            <div className="mt-3 flex flex-wrap gap-2">
              {socials.map(({ Icon, href, name }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`link-footer-${name}`}
                  aria-label={name}
                  className="inline-flex h-10 w-10 items-center justify-center"
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
            <div className="mt-4 space-y-1.5 font-mono text-[11px] uppercase tracking-[0.18em]">
              <div className="flex items-center gap-2">
                <span style={{ color: ACCENT }}>●</span>
                <span>{aboutInfo?.availableForWork ? "AVAILABLE FOR WORK" : "CURRENTLY BOOKED"}</span>
              </div>
              {aboutInfo?.responseTime && (
                <div className="flex items-center gap-2" style={{ opacity: 0.75 }}>
                  <Clock className="h-3 w-3" />
                  <span>REPLY {aboutInfo.responseTime}</span>
                </div>
              )}
              {aboutInfo?.workingHours && (
                <div className="flex items-center gap-2" style={{ opacity: 0.75 }}>
                  <Clock className="h-3 w-3" />
                  <span>HRS {aboutInfo.workingHours}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="flex flex-col items-start justify-between gap-2 py-5 font-mono text-[10px] uppercase tracking-[0.22em] md:flex-row md:items-center">
          <div className="flex items-center gap-3 opacity-70">
            <span>© {year} · CodeBySRS · All rights reserved</span>
            <span>•</span>
            <a href="/privacy" className="hover:text-[#FF3D00] transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="/terms" className="hover:text-[#FF3D00] transition-colors">Terms of Service</a>
          </div>
          <div className="flex items-center gap-3 opacity-70">
            <span style={{ color: ACCENT }}>v2.1.0</span>
            <span>BUILD #{String(year).slice(-2)}.{String(new Date().getMonth() + 1).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ColTitle({ k, label }: { k: string; label: string }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
      <span style={{ color: ACCENT }}>{k}</span>
      <span className="opacity-60">/ {label}</span>
    </div>
  );
}

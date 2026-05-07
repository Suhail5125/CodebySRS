import React from "react";
import { Home, FileText, Shield, Scale } from "lucide-react";
import { Link } from "wouter";
import { Navigation } from "./navigation";

const BG = "#0A0A0A";
const INK = "#F2EFE6";
const ACCENT = "#FF3D00";

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

/* ─── Noise Overlay ─────────────────────────────────────────────────────── */
function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        backgroundRepeat: "repeat",
      }}
    />
  );
}



export function LegalLayout({ children, title, subtitle }: LegalLayoutProps) {
  const isTerms = title.includes("TERMS");
  const Icon = isTerms ? Scale : Shield;

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col relative" style={{ background: BG, color: INK }}>
      {/* Background layers */}
      <NoiseOverlay />

      <Navigation />
      
      <main className="relative z-[3] flex-grow pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1200px]">

          {/* Header section with icon */}
          <div className="mb-12 sm:mb-16 pb-8 sm:pb-12" style={{ borderBottom: `2px solid ${INK}` }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
              <div 
                className="flex items-center justify-center p-4 sm:p-5"
                style={{ border: `2px solid ${ACCENT}`, background: `${ACCENT}15` }}
              >
                <Icon size={32} style={{ color: ACCENT }} strokeWidth={2} />
              </div>
              
              <div className="flex-1">
                <h1 style={{ 
                  fontFamily: "Inter, sans-serif", 
                  fontWeight: 800, 
                  fontSize: "clamp(28px, 6vw, 56px)", 
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  textTransform: "uppercase",
                  color: INK
                }}>
                  {title}
                </h1>
                
                {subtitle && (
                  <p className="mt-3 sm:mt-4 font-mono text-[10px] sm:text-[12px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Legal notice banner */}
            <div 
              className="mt-6 sm:mt-8 p-4 sm:p-6 font-mono text-[11px] sm:text-[12px] leading-relaxed"
              style={{ 
                border: `2px solid ${INK}`,
                background: `${INK}05`
              }}
            >
              <p style={{ color: `${INK}cc` }}>
                <span style={{ color: ACCENT, fontWeight: 700 }}>LEGAL NOTICE:</span> This document constitutes a legally binding agreement. 
                By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by these terms. 
                Please read carefully before proceeding.
              </p>
            </div>
          </div>

          {/* Content with enhanced styling */}
          <div className="relative">
            {/* Section number indicator */}
            <div 
              className="hidden lg:block absolute -left-20 top-0 w-12 font-mono text-[10px] uppercase tracking-[0.3em] opacity-30"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              LEGAL DOCUMENT
            </div>

            <div className="prose prose-invert max-w-none 
              prose-headings:text-[#F2EFE6] 
              prose-headings:font-bold 
              prose-headings:uppercase 
              prose-headings:tracking-tight
              prose-h2:text-[18px] sm:prose-h2:text-[22px]
              prose-h2:mt-12 sm:prose-h2:mt-16
              prose-h2:mb-4 sm:prose-h2:mb-6
              prose-h2:pb-3 sm:prose-h2:pb-4
              prose-h2:border-b-2
              prose-h2:border-[#FF3D00]
              prose-h3:text-[15px] sm:prose-h3:text-[17px]
              prose-h3:mt-6 sm:prose-h3:mt-8
              prose-h3:mb-3 sm:prose-h3:mb-4
              prose-h3:text-[#FF3D00]
              prose-p:text-[#F2EFE6]/85
              prose-p:text-[14px] sm:prose-p:text-[16px]
              prose-p:leading-relaxed
              prose-li:text-[#F2EFE6]/85
              prose-li:text-[14px] sm:prose-li:text-[15px]
              prose-li:leading-relaxed
              prose-strong:text-[#FF3D00]
              prose-strong:font-bold
              prose-ul:space-y-2
              prose-ol:space-y-2
            ">
              {children}
            </div>
          </div>

          {/* Bottom CTA section with contextual links */}
          <div 
            className="mt-16 sm:mt-20 p-6 sm:p-8"
            style={{ border: `2px solid ${INK}` }}
          >
            <p className="font-mono text-[11px] sm:text-[13px] uppercase tracking-[0.25em] mb-6 text-center" style={{ color: `${INK}99` }}>
              NAVIGATE TO
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
              {/* Home CTA */}
              <Link href="/">
                <a 
                  className="flex items-center justify-center gap-2 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors"
                  style={{ 
                    border: `2px solid ${INK}`,
                    color: INK,
                    textDecoration: "none",
                    flex: "1"
                  }}
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
                  <Home size={14} strokeWidth={2.5} />
                  <span>HOME</span>
                </a>
              </Link>

              {/* Contextual CTA - Privacy for Terms, Terms for Privacy */}
              {isTerms ? (
                <Link href="/privacy">
                  <a 
                    className="flex items-center justify-center gap-2 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors"
                    style={{ 
                      border: `2px solid ${INK}`,
                      color: INK,
                      textDecoration: "none",
                      flex: "1"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = INK;
                      e.currentTarget.style.borderColor = INK;
                      e.currentTarget.style.color = BG;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = INK;
                      e.currentTarget.style.color = INK;
                    }}
                  >
                    <Shield size={14} strokeWidth={2.5} />
                    <span>PRIVACY POLICY</span>
                  </a>
                </Link>
              ) : (
                <Link href="/terms">
                  <a 
                    className="flex items-center justify-center gap-2 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors"
                    style={{ 
                      border: `2px solid ${INK}`,
                      color: INK,
                      textDecoration: "none",
                      flex: "1"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = INK;
                      e.currentTarget.style.borderColor = INK;
                      e.currentTarget.style.color = BG;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = INK;
                      e.currentTarget.style.color = INK;
                    }}
                  >
                    <Scale size={14} strokeWidth={2.5} />
                    <span>TERMS OF SERVICE</span>
                  </a>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

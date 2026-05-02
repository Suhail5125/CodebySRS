import { useState, useEffect } from "react";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@shared";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BG = "#0A0A0A";
const INK = "#F2EFE6";
const ACCENT = "#FF3D00";

interface ProjectsSectionProps {
  projects: Project[];
  isLoading: boolean;
}

export function ProjectsSection({ projects, isLoading }: ProjectsSectionProps) {
  const featured = projects.filter((p) => p.featured);
  const display = featured.length > 0 ? featured : projects;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [perView, setPerView] = useState(1);

  useEffect(() => {
    const r = () => {
      const w = window.innerWidth;
      setPerView(w < 768 ? 1 : w < 1024 ? 2 : 3);
    };
    r();
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  useEffect(() => {
    if (display.length === 0 || paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % display.length), 3500);
    return () => clearInterval(t);
  }, [display.length, paused]);

  const visible: Project[] = [];
  for (let i = 0; i < Math.min(perView, display.length); i++) {
    visible.push(display[(index + i) % display.length]);
  }

  const open = (p: Project) => {
    window.location.href = `/projects/${p.id}`;
  };

  return (
    <section
      id="projects"
      className="relative px-6 py-24 lg:px-10"
      style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader
          num="02"
          name="PROJECTS"
          kicker="// SHIPPED ARTIFACTS"
          headline="WORK THAT RUNS IN PRODUCTION"
          right={`${display.length} ENTRIES`}
        />

        {/* Controls bar */}
        <div
          className="mb-0 mt-10 flex items-center justify-between px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em]"
          style={{ border: `2px solid ${INK}`, borderBottom: "none" }}
        >
          <div className="flex items-center gap-4">
            <span style={{ color: ACCENT }}>●</span>
            <span>FEED://featured</span>
            <span className="hidden md:inline opacity-60">{paused ? "PAUSED" : "AUTO-ROTATE 3.5s"}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIndex((i) => (i - 1 + display.length) % display.length)}
              className="inline-flex h-7 w-7 items-center justify-center"
              style={{ border: `2px solid ${INK}`, transition: "none" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = ACCENT;
                e.currentTarget.style.color = BG;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = INK;
              }}
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % display.length)}
              className="inline-flex h-7 w-7 items-center justify-center"
              style={{ border: `2px solid ${INK}`, transition: "none" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = ACCENT;
                e.currentTarget.style.color = BG;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = INK;
              }}
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPaused((p) => !p)}
              className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]"
              style={{ border: `2px solid ${INK}`, transition: "none" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = INK;
                e.currentTarget.style.color = BG;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = INK;
              }}
            >
              {paused ? "PLAY" : "PAUSE"}
            </button>
          </div>
        </div>

        {/* Grid */}
        <div
          className="grid gap-0 p-0"
          style={{
            border: `2px solid ${INK}`,
            gridTemplateColumns: `repeat(${perView}, minmax(0, 1fr))`,
            background: BG,
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {isLoading
            ? Array.from({ length: perView }).map((_, i) => (
                <div
                  key={i}
                  className="h-[440px]"
                  style={{
                    borderRight: i < perView - 1 ? `2px solid ${INK}` : "none",
                    background: "transparent",
                  }}
                >
                  <div className="flex h-full items-center justify-center font-mono text-[11px] uppercase tracking-[0.2em] opacity-50">
                    LOADING…
                  </div>
                </div>
              ))
            : visible.map((p, i) => (
                <div
                  key={`${p.id}-${i}`}
                  style={{
                    borderRight: i < visible.length - 1 ? `2px solid ${INK}` : "none",
                  }}
                >
                  <ProjectCard project={p} index={(index + i) % display.length} onSelect={() => open(p)} />
                </div>
              ))}
        </div>

        {/* Index dots */}
        {display.length > 0 && (
          <div
            className="flex items-center justify-between px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em]"
            style={{ border: `2px solid ${INK}`, borderTop: "none" }}
          >
            <span>
              POS {String(index + 1).padStart(2, "0")} / {String(display.length).padStart(2, "0")}
            </span>
            <div className="flex gap-1.5">
              {display.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to project ${i + 1}`}
                  style={{
                    width: 18,
                    height: 6,
                    background: i === index ? ACCENT : "transparent",
                    border: `1.5px solid ${INK}`,
                    transition: "none",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
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

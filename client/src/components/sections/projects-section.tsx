import { useState, useRef, useCallback, forwardRef } from "react";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { Reveal, useReveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import type { Project } from "@shared";

const BG = "#0A0A0A";
const INK = "#F2EFE6";
const ACCENT = "#FF3D00";

interface ProjectsSectionProps {
  projects: Project[];
  isLoading: boolean;
}

function parseTech(raw: string): string[] {
  try { return JSON.parse(raw); } catch { return []; }
}

export function ProjectsSection({ projects, isLoading }: ProjectsSectionProps) {
  const display = [...projects].sort((a, b) => a.order - b.order);
  const [hovered, setHovered] = useState<number | null>(null);
  const [imgOffset, setImgOffset] = useState(0);
  const rowEls = useRef<(HTMLDivElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);

  const handleEnter = useCallback((i: number) => {
    setHovered(i);
    const row = rowEls.current[i];
    const list = listRef.current;
    if (row && list) {
      const rowRect = row.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      setImgOffset(rowRect.top - listRect.top + rowRect.height / 2 - 105);
    }
  }, []);

  const handleLeave = useCallback(() => setHovered(null), []);

  const activeProject = hovered !== null ? display[hovered] : null;

  return (
    <section
      id="projects"
      className="relative min-h-screen px-6 py-20 lg:px-10"
      style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <Reveal>
          <SectionHeader
            num="02"
            name="PROJECTS"
            kicker="// SHIPPED ARTIFACTS"
            headline="WORK THAT RUNS IN PRODUCTION"
            right={`${display.length} ENTRIES`}
          />
        </Reveal>

        {/* List + floating preview wrapper */}
        <div
          ref={listRef}
          className="relative mt-10"
          style={{ border: `2px solid ${INK}` }}
        >
          {isLoading ? (
            <LoadingSkeleton />
          ) : display.length === 0 ? (
            <EmptyState />
          ) : (
            display.map((p, i) => (
              <ProjectRow
                key={p.id}
                project={p}
                index={i}
                isActive={hovered === i}
                ref={(el) => { rowEls.current[i] = el; }}
                onEnter={() => handleEnter(i)}
                onLeave={handleLeave}
                delay={i * 70}
                isLast={i === display.length - 1}
              />
            ))
          )}

          {/* Floating image preview — desktop only */}
          {activeProject && (
            <div
              className="absolute hidden lg:block"
              style={{
                right: 160,
                top: imgOffset,
                zIndex: 30,
                width: 320,
                animation: "brut-preview-in 0.2s ease-out forwards",
                pointerEvents: "none",
              }}
            >
              <div style={{ border: `2px solid ${INK}`, background: BG }}>

                {/* Header bar: number + link/github if provided */}
                <div
                  className="flex items-center justify-between px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em]"
                  style={{ borderBottom: `2px solid ${INK}` }}
                >
                  <span style={{ color: ACCENT }}>
                    P-{String((hovered ?? 0) + 1).padStart(3, "0")}
                  </span>
                  <div className="flex items-center gap-2" style={{ pointerEvents: "auto" }}>
                    {activeProject.liveUrl && (
                      <a
                        href={activeProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1"
                        style={{
                          border: `1.5px solid ${INK}`,
                          color: INK,
                          transition: "none",
                          textDecoration: "none",
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
                        <ExternalLink className="h-3 w-3" strokeWidth={2.5} />
                        <span>LIVE</span>
                      </a>
                    )}
                    {activeProject.githubUrl && (
                      <a
                        href={activeProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1"
                        style={{
                          border: `1.5px solid ${INK}`,
                          color: INK,
                          transition: "none",
                          textDecoration: "none",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = INK;
                          e.currentTarget.style.color = BG;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = INK;
                        }}
                      >
                        <Github className="h-3 w-3" strokeWidth={2} />
                        <span>REPO</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Image with Ken-Burns drift */}
                <div style={{ overflow: "hidden", height: 210 }}>
                  {activeProject.imageUrl ? (
                    <img
                      src={activeProject.imageUrl}
                      alt={activeProject.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        filter: "grayscale(8%) contrast(1.05)",
                        animation: "brut-img-drift 7s ease-in-out infinite alternate",
                        transformOrigin: "center center",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: ACCENT,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 800,
                          fontSize: 100,
                          color: BG,
                          lineHeight: 1,
                          letterSpacing: "-0.04em",
                        }}
                      >
                        {String((hovered ?? 0) + 1).padStart(2, "0")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tech stack tags — only if admin added technologies */}
                {parseTech(activeProject.technologies).length > 0 && (
                  <div
                    className="flex flex-wrap gap-1.5 p-3"
                    style={{ borderTop: `2px solid ${INK}` }}
                  >
                    {parseTech(activeProject.technologies).slice(0, 6).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em]"
                        style={{ border: `1.5px solid ${INK}`, color: INK }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

              </div>
            </div>
          )}
        </div>

        {/* Bottom meta strip */}
        {display.length > 0 && (
          <div
            className="grid grid-cols-3 font-mono text-[11px] uppercase tracking-[0.2em]"
            style={{ border: `2px solid ${INK}`, borderTop: "none" }}
          >
            <div className="px-4 py-3" style={{ borderRight: `2px solid ${INK}` }}>
              {display.length} PROJECTS IN FEED
            </div>
            <div
              className="px-4 py-3 opacity-50"
              style={{ borderRight: `2px solid ${INK}` }}
            >
              HOVER TO PREVIEW
            </div>
            <div className="px-4 py-3" style={{ color: ACCENT }}>
              {hovered !== null
                ? `P-${String(hovered + 1).padStart(3, "0")} // ACTIVE`
                : "SELECT A PROJECT"}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

interface ProjectRowProps {
  project: Project;
  index: number;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
  delay: number;
  isLast: boolean;
}

const ProjectRow = forwardRef<HTMLDivElement, ProjectRowProps>(function ProjectRow(
  { project, index, isActive, onEnter, onLeave, delay, isLast },
  forwardedRef
) {
  const { ref: revealRef, style: revealStyle } = useReveal({ delay, variant: "slide-left" });

  const num = `P-${String(index + 1).padStart(3, "0")}`;
  const year = new Date(project.createdAt).getFullYear();
  const link = project.liveUrl ?? project.githubUrl ?? null;

  return (
    <div
      ref={(el) => {
        (revealRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        if (typeof forwardedRef === "function") forwardedRef(el);
        else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        ...revealStyle,
        background: isActive ? ACCENT : "transparent",
        borderBottom: isLast ? "none" : `2px solid ${INK}`,
        color: isActive ? BG : INK,
        transition: "none",
        cursor: "default",
      }}
    >
      <div className="flex items-center gap-5 px-5 py-6">
        {/* Number */}
        <span
          className="w-[68px] shrink-0 font-mono text-[10px] uppercase tracking-[0.22em]"
          style={{ opacity: isActive ? 0.55 : 0.4 }}
        >
          {num}
        </span>

        {/* Title + active circle dot */}
        <div className="flex min-w-0 flex-1 items-center gap-5">
          <h3
            className="min-w-0 flex-1 truncate"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(20px, 3vw, 46px)",
              lineHeight: 1,
              letterSpacing: "-0.025em",
              textTransform: "uppercase",
            }}
          >
            {project.title}
          </h3>
          {isActive && (
            <div
              className="shrink-0"
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                border: `2px solid ${BG}`,
              }}
            />
          )}
        </div>

        {/* Year */}
        <span
          className="hidden shrink-0 font-mono text-[12px] lg:block"
          style={{
            opacity: isActive ? 0.65 : 0.45,
            minWidth: 48,
            textAlign: "right",
            marginRight: "2.5rem",
          }}
        >
          {year}
        </span>

        {/* VIEW button */}
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto inline-flex shrink-0 items-center gap-2 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{
              border: `2px solid ${isActive ? BG : INK}`,
              color: isActive ? BG : INK,
              background: "transparent",
              transition: "none",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isActive ? BG : INK;
              e.currentTarget.style.color = isActive ? ACCENT : BG;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = isActive ? BG : INK;
            }}
          >
            VIEW <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
          </a>
        ) : (
          <span
            className="inline-flex shrink-0 items-center gap-2 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] opacity-25"
            style={{
              border: `2px solid ${isActive ? BG : INK}`,
              color: isActive ? BG : INK,
            }}
          >
            SOON <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
          </span>
        )}
      </div>
    </div>
  );
});

function LoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-5 px-5 py-6"
          style={{ borderBottom: `2px solid ${INK}`, opacity: 0.2 }}
        >
          <span className="w-[68px] font-mono text-[10px] uppercase tracking-[0.22em]">
            P-{String(i + 1).padStart(3, "0")}
          </span>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: 32,
              letterSpacing: "-0.025em",
              textTransform: "uppercase",
            }}
          >
            LOADING…
          </span>
        </div>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <div className="px-5 py-24 text-center font-mono text-[11px] uppercase tracking-[0.3em] opacity-35">
      NO PROJECTS IN FEED
    </div>
  );
}

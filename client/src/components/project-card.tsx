import { useState } from "react";
import { Link } from "wouter";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import type { Project } from "@shared";

const BG = "#0A0A0A";
const INK = "#F2EFE6";
const ACCENT = "#FF3D00";

interface ProjectCardProps {
  project: Project;
  index: number;
  onSelect?: () => void;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const technologies: string[] = Array.isArray(project.technologies)
    ? (project.technologies as string[])
    : typeof project.technologies === "string"
      ? JSON.parse(project.technologies)
      : [];

  const [hover, setHover] = useState(false);
  const num = String(index + 1).padStart(2, "0");

  const cardBg = hover ? INK : "transparent";
  const cardFg = hover ? BG : INK;

  return (
    <Link href={`/projects/${project.id}`}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        data-testid={`card-project-${project.id}`}
        className="group relative flex h-[440px] flex-col cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
        style={{
          background: cardBg,
          color: cardFg,
          border: `2px solid ${INK}`,
          transition: "none",
        }}
      >
      {/* Top telemetry */}
      <div
        className="flex items-center justify-between px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em]"
        style={{ borderBottom: `2px solid ${cardFg}` }}
      >
        <span>PROJECT_{num}</span>
        <span style={{ color: hover ? BG : ACCENT }}>
          {project.featured ? "FEATURED" : "ACTIVE"}
        </span>
      </div>

      {/* Image / placeholder */}
      <div className="relative h-44 overflow-hidden" style={{ borderBottom: `2px solid ${cardFg}` }}>
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="h-full w-full object-cover"
            style={{
              filter: hover ? "grayscale(0%) contrast(1.05)" : "grayscale(100%) contrast(1.1)",
              transition: "none",
            }}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center font-black"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(64px, 8vw, 120px)",
              lineHeight: 1,
              color: hover ? BG : INK,
              background: hover ? ACCENT : "transparent",
            }}
          >
            {project.title[0]?.toUpperCase()}
          </div>
        )}

        {/* Float action chips */}
        <div className="absolute right-3 top-3 flex gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`link-github-${project.id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex h-8 w-8 items-center justify-center"
              style={{
                background: BG,
                color: INK,
                border: `2px solid ${INK}`,
                transition: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = ACCENT;
                e.currentTarget.style.color = BG;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = BG;
                e.currentTarget.style.color = INK;
              }}
            >
              <Github className="h-3.5 w-3.5" />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`link-demo-${project.id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex h-8 w-8 items-center justify-center"
              style={{
                background: BG,
                color: INK,
                border: `2px solid ${INK}`,
                transition: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = ACCENT;
                e.currentTarget.style.color = BG;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = BG;
                e.currentTarget.style.color = INK;
              }}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-4 py-4">
        <h3
          className="mb-2 line-clamp-1"
          data-testid={`text-title-${project.id}`}
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: "22px",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
          }}
        >
          {project.title}
        </h3>
        <p
          className="mb-4 line-clamp-3 text-[13px] leading-snug"
          data-testid={`text-description-${project.id}`}
          style={{ opacity: 0.85 }}
        >
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {technologies.slice(0, 4).map((tech, i) => (
            <span
              key={i}
              data-testid={`badge-tech-${project.id}-${i}`}
              className="font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{
                padding: "3px 7px",
                border: `1.5px solid ${cardFg}`,
                color: cardFg,
                transition: "none",
              }}
            >
              {tech}
            </span>
          ))}
          {technologies.length > 4 && (
            <span
              className="font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{
                padding: "3px 7px",
                background: ACCENT,
                color: BG,
                border: `1.5px solid ${ACCENT}`,
              }}
            >
              +{technologies.length - 4}
            </span>
          )}
        </div>

        {/* Footer CTA */}
        <div
          className="mt-auto flex items-center justify-between pt-3 font-mono text-[11px] uppercase tracking-[0.22em]"
          style={{ borderTop: `2px solid ${cardFg}` }}
        >
          <span className="font-bold">OPEN_CASE</span>
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
    </div>
    </Link>
  );
}

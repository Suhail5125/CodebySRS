import { useState, useEffect } from "react";
import type { Skill } from "@shared";
import {
  SiReact, SiTypescript, SiJavascript, SiThreedotjs,
  SiNodedotjs, SiNextdotjs, SiPostgresql, SiGraphql,
  SiTailwindcss, SiFramer, SiExpress, SiRedis,
  SiDocker, SiFigma, SiBlender, SiGit, SiVite,
  SiMongodb, SiMysql, SiPython, SiPrisma, SiSvelte,
  SiAstro, SiLinux, SiRust, SiGo, SiGreensock,
  SiCss3, SiHtml5, SiGithub,
  SiVuedotjs, SiAngular, SiFlutter, SiDart,
  SiKubernetes, SiTerraform, SiNginx, SiWebpack,
} from "react-icons/si";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

const BG     = "#0A0A0A";
const INK    = "#F2EFE6";
const ACCENT = "#FF3D00";

/* ── brand icon + color map ─────────────────────────────────────────────── */
type IconEntry = { Icon: React.ComponentType<{ size?: number; color?: string }>; color: string };

const ICON_MAP: Record<string, IconEntry> = {
  "React":         { Icon: SiReact,            color: "#61DAFB" },
  "TypeScript":    { Icon: SiTypescript,        color: "#3178C6" },
  "JavaScript":    { Icon: SiJavascript,        color: "#F7DF1E" },
  "Three.js":      { Icon: SiThreedotjs,       color: "#F2EFE6" },
  "Node.js":       { Icon: SiNodedotjs,        color: "#339933" },
  "Next.js":       { Icon: SiNextdotjs,        color: "#F2EFE6" },
  "PostgreSQL":    { Icon: SiPostgresql,        color: "#4169E1" },
  "GraphQL":       { Icon: SiGraphql,           color: "#E10098" },
  "Tailwind":      { Icon: SiTailwindcss,       color: "#06B6D4" },
  "TailwindCSS":   { Icon: SiTailwindcss,       color: "#06B6D4" },
  "Framer":        { Icon: SiFramer,            color: "#6B8EFA" },
  "Framer Motion": { Icon: SiFramer,            color: "#6B8EFA" },
  "Express":       { Icon: SiExpress,           color: "#F2EFE6" },
  "Express.js":    { Icon: SiExpress,           color: "#F2EFE6" },
  "Redis":         { Icon: SiRedis,             color: "#DC382D" },
  "Docker":        { Icon: SiDocker,            color: "#2496ED" },
  "MongoDB":       { Icon: SiMongodb,           color: "#47A248" },
  "MySQL":         { Icon: SiMysql,             color: "#4479A1" },
  "Figma":         { Icon: SiFigma,             color: "#F24E1E" },
  "Blender":       { Icon: SiBlender,           color: "#F5792A" },
  "Git":           { Icon: SiGit,               color: "#F05032" },
  "GitHub":        { Icon: SiGithub,            color: "#F2EFE6" },
  "Vite":          { Icon: SiVite,              color: "#646CFF" },
  "Prisma":        { Icon: SiPrisma,            color: "#5A67D8" },
  "GSAP":          { Icon: SiGreensock,         color: "#88CE02" },
  "Svelte":        { Icon: SiSvelte,            color: "#FF3E00" },
  "Astro":         { Icon: SiAstro,             color: "#FF5D01" },
  "Linux":         { Icon: SiLinux,             color: "#FCC624" },
  "Python":        { Icon: SiPython,            color: "#3776AB" },
  "Rust":          { Icon: SiRust,              color: "#CE412B" },
  "Go":            { Icon: SiGo,                color: "#00ADD8" },
  "Golang":        { Icon: SiGo,                color: "#00ADD8" },
  "CSS":           { Icon: SiCss3,              color: "#1572B6" },
  "CSS3":          { Icon: SiCss3,              color: "#1572B6" },
  "HTML":          { Icon: SiHtml5,             color: "#E34F26" },
  "HTML5":         { Icon: SiHtml5,             color: "#E34F26" },
  "Vue.js":        { Icon: SiVuedotjs,         color: "#4FC08D" },
  "Vue":           { Icon: SiVuedotjs,         color: "#4FC08D" },
  "Angular":       { Icon: SiAngular,           color: "#DD0031" },
  "Flutter":       { Icon: SiFlutter,           color: "#02569B" },
  "Dart":          { Icon: SiDart,              color: "#0175C2" },
  "Kubernetes":    { Icon: SiKubernetes,        color: "#326CE5" },
  "Terraform":     { Icon: SiTerraform,         color: "#7B42BC" },
  "Nginx":         { Icon: SiNginx,             color: "#009639" },
  "Webpack":       { Icon: SiWebpack,           color: "#8DD6F9" },
};

/* ── fallback skills (only used when DB is empty) ────────────────────────── */
const FALLBACK: Skill[] = [
  {id:"f1",name:"React",      category:"Frontend",    proficiency:95,icon:null,order:0},
  {id:"f2",name:"TypeScript", category:"Frontend",    proficiency:92,icon:null,order:1},
  {id:"f3",name:"Three.js",   category:"Frontend",    proficiency:85,icon:null,order:2},
  {id:"f4",name:"Tailwind",   category:"Frontend",    proficiency:90,icon:null,order:3},
  {id:"f5",name:"Next.js",    category:"Frontend",    proficiency:88,icon:null,order:4},
  {id:"f6",name:"Framer",     category:"Frontend",    proficiency:80,icon:null,order:5},
  {id:"f7",name:"Vite",       category:"Frontend",    proficiency:87,icon:null,order:6},
  {id:"b1",name:"Node.js",    category:"Backend",     proficiency:88,icon:null,order:0},
  {id:"b2",name:"PostgreSQL", category:"Backend",     proficiency:82,icon:null,order:1},
  {id:"b3",name:"Redis",      category:"Backend",     proficiency:75,icon:null,order:2},
  {id:"b4",name:"Express",    category:"Backend",     proficiency:90,icon:null,order:3},
  {id:"b5",name:"GraphQL",    category:"Backend",     proficiency:78,icon:null,order:4},
  {id:"b6",name:"Docker",     category:"Backend",     proficiency:72,icon:null,order:5},
  {id:"b7",name:"Prisma",     category:"Backend",     proficiency:83,icon:null,order:6},
  {id:"g1",name:"Three.js",   category:"3D/Graphics", proficiency:85,icon:null,order:0},
  {id:"g2",name:"Blender",    category:"3D/Graphics", proficiency:70,icon:null,order:1},
  {id:"g3",name:"GSAP",       category:"3D/Graphics", proficiency:83,icon:null,order:2},
  {id:"t1",name:"Git",        category:"Tools",       proficiency:95,icon:null,order:0},
  {id:"t2",name:"Figma",      category:"Tools",       proficiency:88,icon:null,order:1},
  {id:"t3",name:"VS Code",    category:"Tools",       proficiency:98,icon:null,order:2},
  {id:"t4",name:"Linux",      category:"Tools",       proficiency:82,icon:null,order:3},
];

/* ── deterministic hue for unknown techs ─────────────────────────────────── */
function techColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffff;
  const hue = h % 360;
  return `hsl(${hue}, 70%, 62%)`;
}

function abbr(name: string): string {
  const w = name.split(/[\s\/\.\-]+/).filter(Boolean);
  return w.length >= 2 ? (w[0][0] + w[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
}

/* ─────────────────────────────────────────────────────────────────────────── */

export function SkillsSection({ skills, isLoading }: { skills: Skill[]; isLoading: boolean }) {
  const source = isLoading ? [] : (skills.length > 0 ? skills : FALLBACK);

  const grouped = source.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, Skill[]>);

  const cats = Object.keys(grouped);
  const [catIdx, setCatIdx] = useState(0);
  const [fading, setFading] = useState(false);

  const activeCat    = cats[catIdx] ?? "";
  const activeSkills = grouped[activeCat] ?? [];
  const avgProf      = activeSkills.length
    ? Math.round(activeSkills.reduce((a, s) => a + s.proficiency, 0) / activeSkills.length)
    : 0;

  /* auto-cycle */
  useEffect(() => {
    if (cats.length <= 1) return;
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => { setCatIdx(i => (i + 1) % cats.length); setFading(false); }, 400);
    }, 4000);
    return () => clearInterval(id);
  }, [cats.length]);

  const switchCat = (i: number) => {
    if (i === catIdx) return;
    setFading(true);
    setTimeout(() => { setCatIdx(i); setFading(false); }, 400);
  };

  return (
    <section
      id="skills"
      className="relative flex min-h-screen flex-col overflow-hidden px-6 py-20 lg:px-10"
      style={{ background: BG, color: INK }}
    >
      <div className="mx-auto w-full max-w-[1400px] flex flex-col flex-1">

        <Reveal>
          <SectionHeader
            num="03"
            name="SKILLS"
            kicker="// CAPABILITY MATRIX"
            headline="STACK INVENTORY"
            right={`${source.length} TECHNOLOGIES`}
            variant="right"
          />
        </Reveal>

        {/* ── Category indicator — no border box ── */}
        <div className="mt-10 flex items-end justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-40 mb-2">
              VIEWING CATEGORY
            </div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
                lineHeight: 1,
                letterSpacing: "-0.035em",
                textTransform: "uppercase",
                opacity: fading ? 0 : 1,
                transform: fading ? "translateY(12px)" : "translateY(0)",
                transition: "opacity 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.4s",
              }}
            >
              {activeCat || "LOADING…"}
            </div>
            <div className="mt-3 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em]">
              <span style={{ color: ACCENT }}>{activeSkills.length} skills</span>
              <span className="opacity-30">/</span>
              <span className="opacity-50">avg {avgProf}% proficiency</span>
            </div>
          </div>

          {/* Dot selector */}
          <div className="flex flex-col items-end gap-2 pb-1">
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-30 mb-1">
              {String(catIdx + 1).padStart(2,"0")} / {String(cats.length).padStart(2,"0")}
            </div>
            <div className="flex items-center gap-2">
              {cats.map((cat, i) => (
                <button
                  key={cat}
                  onClick={() => switchCat(i)}
                  title={cat}
                  style={{
                    height: 8,
                    width: i === catIdx ? 32 : 8,
                    borderRadius: 4,
                    background: i === catIdx ? ACCENT : `${INK}30`,
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "width 0.38s cubic-bezier(0.4,0,0.2,1), background 0.38s",
                  }}
                />
              ))}
            </div>
            {cats.map((cat, i) => (
              <div
                key={cat}
                className="font-mono text-[9px] uppercase tracking-[0.2em]"
                style={{
                  opacity: i === catIdx ? 0.6 : 0.18,
                  transition: "opacity 0.4s",
                }}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* ── Hairline divider ── */}
        <div className="mt-8 mb-8 h-px w-full" style={{ background: `${INK}15` }} />

        {/* ── Icon field — full remaining space, no borders ── */}
        <div
          className="flex-1"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px 12px",
            justifyContent: "center",
            alignContent: "center",
            paddingBottom: 32,
          }}
        >
          {source.length === 0 ? (
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] opacity-25 py-16">
              SCANNING STACK…
            </div>
          ) : (
            source.map((skill, i) => (
              <SkillNode
                key={skill.id}
                skill={skill}
                active={skill.category === activeCat}
                fading={fading}
                stagger={i % 4 === 1 ? 14 : i % 4 === 3 ? 28 : 0}
              />
            ))
          )}
        </div>

        {/* ── Minimal one-line footer ── */}
        <div
          className="pt-6 flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.22em]"
          style={{ borderTop: `1px solid ${INK}15` }}
        >
          <span className="inline-block h-1.5 w-1.5 brut-blink" style={{ background: ACCENT, borderRadius: 1 }} aria-hidden />
          <span className="opacity-40">{source.length} technologies</span>
          <span className="opacity-20">·</span>
          <span style={{ color: ACCENT }}>{activeCat}</span>
          <span className="opacity-20">·</span>
          <span className="opacity-40">avg {avgProf}%</span>
          <span className="opacity-20">·</span>
          <span className="opacity-40">operational</span>
        </div>

      </div>
    </section>
  );
}

/* ─── SkillNode ──────────────────────────────────────────────────────────── */

function SkillNode({
  skill, active, fading, stagger = 0,
}: { skill: Skill; active: boolean; fading: boolean; stagger?: number }) {
  const entry   = ICON_MAP[skill.name];
  const brand   = entry?.color ?? techColor(skill.name);
  const IconCmp = entry?.Icon;

  /* ring geometry */
  const sz      = active ? 96 : 76;
  const strokeW = 2;
  const r       = (sz - strokeW * 2) / 2;
  const circ    = 2 * Math.PI * r;
  const dash    = (Math.min(100, Math.max(0, skill.proficiency)) / 100) * circ;
  const cx      = sz / 2;

  const glowing = active && !fading;

  return (
    <div
      title={`${skill.name} · ${skill.proficiency}%`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        marginTop: stagger,
        flexShrink: 0,
        width: 96,
        /* size transition so active icons expand */
        transition: "opacity 0.45s cubic-bezier(0.4,0,0.2,1), filter 0.45s",
        opacity: fading ? 0.06 : active ? 1 : 0.13,
        filter: fading
          ? "grayscale(100%)"
          : active
          ? `grayscale(0%) drop-shadow(0 0 8px ${brand}99) drop-shadow(0 0 18px ${brand}44)`
          : "grayscale(100%)",
      }}
    >
      {/* Ring + icon container — size transitions */}
      <div
        style={{
          position: "relative",
          width: sz,
          height: sz,
          transition: "width 0.45s cubic-bezier(0.4,0,0.2,1), height 0.45s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* SVG proficiency arc */}
        <svg
          width={sz}
          height={sz}
          style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}
        >
          <circle cx={cx} cy={cx} r={r} fill="none" stroke={`${INK}10`} strokeWidth={strokeW} />
          <circle
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke={active ? brand : `${INK}20`}
            strokeWidth={strokeW}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="round"
            style={{ transition: "stroke 0.45s" }}
          />
        </svg>

        {/* Inner circle */}
        <div
          style={{
            position: "absolute",
            inset: 10,
            borderRadius: "50%",
            border: `1.5px solid ${active ? brand + "55" : INK + "15"}`,
            background: active ? brand + "12" : BG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "border-color 0.45s, background 0.45s",
          }}
        >
          {IconCmp ? (
            <IconCmp
              size={active ? 30 : 22}
              color={active ? brand : INK}
            />
          ) : (
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: active ? 14 : 11,
                color: active ? brand : INK,
                letterSpacing: "-0.01em",
                transition: "color 0.45s, font-size 0.45s",
              }}
            >
              {abbr(skill.name)}
            </span>
          )}
        </div>
      </div>

      {/* Name label */}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: active ? 9 : 8,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: active ? brand : INK,
          textAlign: "center",
          maxWidth: 80,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          transition: "color 0.45s, font-size 0.45s",
        }}
      >
        {skill.name}
      </div>
    </div>
  );
}

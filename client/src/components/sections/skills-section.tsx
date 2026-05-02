import { useState, useEffect, useRef } from "react";
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
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░<>/\\";

/* ── scramble hook (same logic as hero section) ──────────────────────────── */
function useScramble(target: string, durationMs: number, runKey: number | string) {
  const [out, setOut] = useState<string>(target);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const revealHead = Math.floor(t * (target.length + 4));
      let s = "";
      for (let i = 0; i < target.length; i++) {
        const ch = target[i];
        if (i < revealHead - 4) s += ch;
        else if (ch === " ") s += " ";
        else s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setOut(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs, runKey]);
  return out;
}

/* ── brand icon + color map ──────────────────────────────────────────────── */
type IconEntry = { Icon: React.ComponentType<{ size?: number; color?: string }>; color: string };

const ICON_MAP: Record<string, IconEntry> = {
  "React":         { Icon: SiReact,        color: "#61DAFB" },
  "TypeScript":    { Icon: SiTypescript,   color: "#3178C6" },
  "JavaScript":    { Icon: SiJavascript,   color: "#F7DF1E" },
  "Three.js":      { Icon: SiThreedotjs,  color: "#F2EFE6" },
  "Node.js":       { Icon: SiNodedotjs,   color: "#339933" },
  "Next.js":       { Icon: SiNextdotjs,   color: "#F2EFE6" },
  "PostgreSQL":    { Icon: SiPostgresql,   color: "#4169E1" },
  "GraphQL":       { Icon: SiGraphql,      color: "#E10098" },
  "Tailwind":      { Icon: SiTailwindcss,  color: "#06B6D4" },
  "TailwindCSS":   { Icon: SiTailwindcss,  color: "#06B6D4" },
  "Framer":        { Icon: SiFramer,       color: "#6B8EFA" },
  "Framer Motion": { Icon: SiFramer,       color: "#6B8EFA" },
  "Express":       { Icon: SiExpress,      color: "#F2EFE6" },
  "Express.js":    { Icon: SiExpress,      color: "#F2EFE6" },
  "Redis":         { Icon: SiRedis,        color: "#DC382D" },
  "Docker":        { Icon: SiDocker,       color: "#2496ED" },
  "MongoDB":       { Icon: SiMongodb,      color: "#47A248" },
  "MySQL":         { Icon: SiMysql,        color: "#4479A1" },
  "Figma":         { Icon: SiFigma,        color: "#F24E1E" },
  "Blender":       { Icon: SiBlender,      color: "#F5792A" },
  "Git":           { Icon: SiGit,          color: "#F05032" },
  "GitHub":        { Icon: SiGithub,       color: "#F2EFE6" },
  "Vite":          { Icon: SiVite,         color: "#646CFF" },
  "Prisma":        { Icon: SiPrisma,       color: "#5A67D8" },
  "GSAP":          { Icon: SiGreensock,    color: "#88CE02" },
  "Svelte":        { Icon: SiSvelte,       color: "#FF3E00" },
  "Astro":         { Icon: SiAstro,        color: "#FF5D01" },
  "Linux":         { Icon: SiLinux,        color: "#FCC624" },
  "Python":        { Icon: SiPython,       color: "#3776AB" },
  "Rust":          { Icon: SiRust,         color: "#CE412B" },
  "Go":            { Icon: SiGo,           color: "#00ADD8" },
  "Golang":        { Icon: SiGo,           color: "#00ADD8" },
  "CSS":           { Icon: SiCss3,         color: "#1572B6" },
  "CSS3":          { Icon: SiCss3,         color: "#1572B6" },
  "HTML":          { Icon: SiHtml5,        color: "#E34F26" },
  "HTML5":         { Icon: SiHtml5,        color: "#E34F26" },
  "Vue.js":        { Icon: SiVuedotjs,    color: "#4FC08D" },
  "Vue":           { Icon: SiVuedotjs,    color: "#4FC08D" },
  "Angular":       { Icon: SiAngular,      color: "#DD0031" },
  "Flutter":       { Icon: SiFlutter,      color: "#02569B" },
  "Dart":          { Icon: SiDart,         color: "#0175C2" },
  "Kubernetes":    { Icon: SiKubernetes,   color: "#326CE5" },
  "Terraform":     { Icon: SiTerraform,    color: "#7B42BC" },
  "Nginx":         { Icon: SiNginx,        color: "#009639" },
  "Webpack":       { Icon: SiWebpack,      color: "#8DD6F9" },
};

/* ── scattered canvas positions (% from container top-left, centred on node) */
const POSITIONS: { left: number; top: number }[] = [
  { left:  7,  top:  7  },
  { left: 21,  top:  3  },
  { left: 36,  top:  9  },
  { left: 51,  top:  2  },
  { left: 65,  top:  8  },
  { left: 79,  top:  3  },
  { left: 90,  top:  9  },
  { left: 13,  top: 26  },
  { left: 28,  top: 21  },
  { left: 44,  top: 28  },
  { left: 59,  top: 22  },
  { left: 74,  top: 27  },
  { left: 87,  top: 20  },
  { left:  4,  top: 47  },
  { left: 18,  top: 43  },
  { left: 33,  top: 50  },
  { left: 48,  top: 44  },
  { left: 63,  top: 51  },
  { left: 77,  top: 45  },
  { left: 89,  top: 52  },
  { left:  9,  top: 69  },
  { left: 24,  top: 65  },
  { left: 39,  top: 72  },
  { left: 54,  top: 66  },
  { left: 69,  top: 73  },
  { left: 83,  top: 67  },
  { left: 14,  top: 86  },
  { left: 30,  top: 82  },
  { left: 46,  top: 88  },
  { left: 61,  top: 83  },
];

/* ── deterministic color for unknowns ───────────────────────────────────── */
function techColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffff;
  return `hsl(${h % 360}, 68%, 60%)`;
}

function abbr(name: string): string {
  const w = name.split(/[\s\/\.\-]+/).filter(Boolean);
  return w.length >= 2 ? (w[0][0] + w[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
}

/* ── fallback (DB empty) ─────────────────────────────────────────────────── */
const FALLBACK: Skill[] = [
  { id:"f1", name:"React",      category:"Frontend",     proficiency:95, icon:null, order:0  },
  { id:"b1", name:"Node.js",    category:"Backend",      proficiency:88, icon:null, order:1  },
  { id:"f2", name:"TypeScript", category:"Frontend",     proficiency:92, icon:null, order:2  },
  { id:"g1", name:"Three.js",   category:"3D/Graphics",  proficiency:85, icon:null, order:3  },
  { id:"t1", name:"Git",        category:"Tools",        proficiency:95, icon:null, order:4  },
  { id:"f3", name:"Tailwind",   category:"Frontend",     proficiency:90, icon:null, order:5  },
  { id:"b2", name:"PostgreSQL", category:"Backend",      proficiency:82, icon:null, order:6  },
  { id:"g2", name:"Blender",    category:"3D/Graphics",  proficiency:70, icon:null, order:7  },
  { id:"t2", name:"Figma",      category:"Tools",        proficiency:88, icon:null, order:8  },
  { id:"f4", name:"Next.js",    category:"Frontend",     proficiency:88, icon:null, order:9  },
  { id:"b3", name:"Redis",      category:"Backend",      proficiency:75, icon:null, order:10 },
  { id:"g3", name:"GSAP",       category:"3D/Graphics",  proficiency:83, icon:null, order:11 },
  { id:"t3", name:"Linux",      category:"Tools",        proficiency:82, icon:null, order:12 },
  { id:"f5", name:"Framer",     category:"Frontend",     proficiency:80, icon:null, order:13 },
  { id:"b4", name:"Express",    category:"Backend",      proficiency:90, icon:null, order:14 },
  { id:"f6", name:"Vite",       category:"Frontend",     proficiency:87, icon:null, order:15 },
  { id:"b5", name:"GraphQL",    category:"Backend",      proficiency:78, icon:null, order:16 },
  { id:"t4", name:"VS Code",    category:"Tools",        proficiency:98, icon:null, order:17 },
  { id:"b6", name:"Docker",     category:"Backend",      proficiency:72, icon:null, order:18 },
  { id:"b7", name:"Prisma",     category:"Backend",      proficiency:83, icon:null, order:19 },
  { id:"f7", name:"CSS",        category:"Frontend",     proficiency:93, icon:null, order:20 },
];

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
  const [transitioning, setTransitioning] = useState(false);

  const activeCat    = cats[catIdx] ?? "";
  const activeSkills = grouped[activeCat] ?? [];
  const avgProf      = activeSkills.length
    ? Math.round(activeSkills.reduce((a, s) => a + s.proficiency, 0) / activeSkills.length)
    : 0;

  const scrambled = useScramble(activeCat.toUpperCase(), 700, catIdx);

  /* auto-cycle */
  useEffect(() => {
    if (cats.length <= 1) return;
    const id = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => { setCatIdx(i => (i + 1) % cats.length); setTransitioning(false); }, 350);
    }, 4200);
    return () => clearInterval(id);
  }, [cats.length]);

  const switchCat = (i: number) => {
    if (i === catIdx) return;
    setTransitioning(true);
    setTimeout(() => { setCatIdx(i); setTransitioning(false); }, 350);
  };

  return (
    <section
      id="skills"
      className="relative overflow-hidden"
      style={{
        background: BG,
        color: INK,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "80px 40px 40px",
      }}
    >
      {/* ── Header ── */}
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

      {/* ── Canvas: scattered icons + category label ── */}
      <div
        className="flex-1 relative"
        style={{ minHeight: 620, marginTop: 32 }}
      >
        {/* All skill nodes — absolute scattered positions */}
        {source.map((skill, i) => {
          const pos = POSITIONS[i % POSITIONS.length];
          return (
            <SkillNode
              key={skill.id}
              skill={skill}
              active={skill.category === activeCat}
              transitioning={transitioning}
              left={pos.left}
              top={pos.top}
            />
          );
        })}

        {/* ── Category label — bottom-left corner ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            zIndex: 0,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div
            className="font-mono uppercase tracking-[0.3em]"
            style={{ fontSize: 9, opacity: 0.35, marginBottom: 6, color: ACCENT }}
          >
            ACTIVE CATEGORY
          </div>
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(3.5rem, 7vw, 7rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: INK,
              opacity: 0.06,
              whiteSpace: "nowrap",
            }}
          >
            {scrambled || "\u00A0"}
          </div>
        </div>

        {/* ── Category label — prominent overlay bottom-right ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 12,
          }}
        >
          {/* Readable category name */}
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.6rem, 3.5vw, 3rem)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: INK,
            }}
          >
            {scrambled || "\u00A0"}
          </div>

          {/* Count + avg */}
          <div className="flex items-center gap-4 font-mono uppercase tracking-[0.2em]" style={{ fontSize: 10 }}>
            <span style={{ color: ACCENT }}>{activeSkills.length} skills</span>
            <span style={{ opacity: 0.3 }}>/</span>
            <span style={{ opacity: 0.5 }}>avg {avgProf}%</span>
          </div>

          {/* Dot selector */}
          <div className="flex items-center gap-2">
            {cats.map((cat, i) => (
              <button
                key={cat}
                onClick={() => switchCat(i)}
                title={cat}
                style={{
                  height: 7,
                  width: i === catIdx ? 28 : 7,
                  borderRadius: 4,
                  background: i === catIdx ? ACCENT : `${INK}28`,
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "width 0.38s cubic-bezier(0.4,0,0.2,1), background 0.38s",
                }}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="font-mono" style={{ fontSize: 9, opacity: 0.3, letterSpacing: "0.2em" }}>
            {String(catIdx + 1).padStart(2, "0")} / {String(cats.length).padStart(2, "0")}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SkillNode (absolutely positioned) ─────────────────────────────────── */

function SkillNode({
  skill, active, transitioning, left, top,
}: {
  skill: Skill;
  active: boolean;
  transitioning: boolean;
  left: number;
  top: number;
}) {
  const entry   = ICON_MAP[skill.name];
  const brand   = entry?.color ?? techColor(skill.name);
  const IconCmp = entry?.Icon;

  const sz      = 84;
  const strokeW = 2;
  const r       = (sz - strokeW * 2) / 2;
  const circ    = 2 * Math.PI * r;
  const dash    = (Math.min(100, Math.max(0, skill.proficiency)) / 100) * circ;
  const cx      = sz / 2;

  const glowing = active && !transitioning;

  return (
    <div
      title={`${skill.name} · ${skill.proficiency}%`}
      style={{
        position: "absolute",
        left: `${left}%`,
        top: `${top}%`,
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        zIndex: active ? 5 : 2,
        transition: "opacity 0.5s cubic-bezier(0.4,0,0.2,1), filter 0.5s",
        opacity: transitioning ? 0.05 : active ? 1 : 0.11,
        filter: transitioning
          ? "grayscale(100%)"
          : active
          ? `grayscale(0%) drop-shadow(0 0 10px ${brand}bb) drop-shadow(0 0 22px ${brand}55)`
          : "grayscale(100%)",
      }}
    >
      <div style={{ position: "relative", width: sz, height: sz }}>
        {/* Arc */}
        <svg
          width={sz} height={sz}
          style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}
        >
          <circle cx={cx} cy={cx} r={r} fill="none" stroke={`${INK}0e`} strokeWidth={strokeW} />
          <circle
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke={active ? brand : `${INK}1a`}
            strokeWidth={strokeW}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="round"
            style={{ transition: "stroke 0.5s" }}
          />
        </svg>

        {/* Inner circle */}
        <div
          style={{
            position: "absolute",
            inset: 9,
            borderRadius: "50%",
            border: `1.5px solid ${active ? brand + "60" : INK + "18"}`,
            background: active ? brand + "14" : BG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "border-color 0.5s, background 0.5s",
          }}
        >
          {IconCmp ? (
            <IconCmp size={active ? 28 : 20} color={active ? brand : INK} />
          ) : (
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: active ? 13 : 10,
                color: active ? brand : INK,
                letterSpacing: "-0.01em",
                transition: "color 0.5s",
              }}
            >
              {abbr(skill.name)}
            </span>
          )}
        </div>
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 8,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: active ? brand : INK,
          whiteSpace: "nowrap",
          transition: "color 0.5s",
        }}
      >
        {skill.name}
      </div>
    </div>
  );
}

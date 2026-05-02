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
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░<>/\\";

/* ── scramble hook ───────────────────────────────────────────────────────── */
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
        if (i < revealHead - 4) s += target[i];
        else if (target[i] === " ") s += " ";
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
  "Three.js":      { Icon: SiThreedotjs,  color: "#C8C8C8" },
  "Node.js":       { Icon: SiNodedotjs,   color: "#339933" },
  "Next.js":       { Icon: SiNextdotjs,   color: "#C8C8C8" },
  "PostgreSQL":    { Icon: SiPostgresql,   color: "#4169E1" },
  "GraphQL":       { Icon: SiGraphql,      color: "#E10098" },
  "Tailwind":      { Icon: SiTailwindcss,  color: "#06B6D4" },
  "TailwindCSS":   { Icon: SiTailwindcss,  color: "#06B6D4" },
  "Framer":        { Icon: SiFramer,       color: "#6B8EFA" },
  "Framer Motion": { Icon: SiFramer,       color: "#6B8EFA" },
  "Express":       { Icon: SiExpress,      color: "#C8C8C8" },
  "Express.js":    { Icon: SiExpress,      color: "#C8C8C8" },
  "Redis":         { Icon: SiRedis,        color: "#DC382D" },
  "Docker":        { Icon: SiDocker,       color: "#2496ED" },
  "MongoDB":       { Icon: SiMongodb,      color: "#47A248" },
  "MySQL":         { Icon: SiMysql,        color: "#4479A1" },
  "Figma":         { Icon: SiFigma,        color: "#F24E1E" },
  "Blender":       { Icon: SiBlender,      color: "#F5792A" },
  "Git":           { Icon: SiGit,          color: "#F05032" },
  "GitHub":        { Icon: SiGithub,       color: "#C8C8C8" },
  "Vite":          { Icon: SiVite,         color: "#646CFF" },
  "Prisma":        { Icon: SiPrisma,       color: "#A78BFA" },
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

/* ── 27 canvas positions: 4 organic rows across the full area ────────────── */
const POSITIONS: { left: number; top: number }[] = [
  /* row 1 — top ~7% */
  { left:  5, top:  7 }, // 0
  { left: 18, top:  7 }, // 1
  { left: 32, top:  7 }, // 2
  { left: 46, top:  7 }, // 3
  { left: 60, top:  7 }, // 4
  { left: 73, top:  7 }, // 5
  { left: 87, top:  7 }, // 6
  /* row 2 — top ~32% */
  { left: 11, top: 32 }, // 7
  { left: 24, top: 32 }, // 8
  { left: 38, top: 32 }, // 9
  { left: 52, top: 32 }, // 10
  { left: 65, top: 32 }, // 11
  { left: 78, top: 32 }, // 12
  { left: 91, top: 32 }, // 13
  /* row 3 — top ~57% */
  { left:  5, top: 57 }, // 14
  { left: 18, top: 57 }, // 15
  { left: 32, top: 57 }, // 16
  { left: 46, top: 57 }, // 17
  { left: 60, top: 57 }, // 18
  { left: 73, top: 57 }, // 19
  { left: 87, top: 57 }, // 20
  /* row 4 — top ~80% */
  { left: 11, top: 80 }, // 21
  { left: 25, top: 80 }, // 22
  { left: 39, top: 80 }, // 23
  { left: 53, top: 80 }, // 24
  { left: 67, top: 80 }, // 25
  { left: 81, top: 80 }, // 26
];

/*
 * POSITION_SHUFFLE — maps each skill-array index to a POSITIONS slot.
 * Manually designed so same-category items in the interleaved FALLBACK
 * end up spread across all four rows and different columns.
 *
 * Skill interleaving: FE, BE, FE, 3D, Tools, FE, BE, 3D, Tools, FE,
 *   BE, 3D, Tools, FE, BE, FE, BE, Tools, BE, BE, FE
 *
 * FE  (0,2,5,9,13,15,20) → pos [0,20,25,8,21,16,9]
 *   → rows: 1,3,4,2,4,3,2 — ✓ spread across all rows
 * BE  (1,6,10,14,16,18,19) → pos [10,3,23,6,26,14,22]
 *   → rows: 2,1,4,1,4,3,4 — ✓ spread
 * 3D  (3,7,11) → pos [5,13,1]  — rows 1,2,1 (3 items, adequate)
 * Tools (4,8,12,17) → pos [15,18,11,4] — rows 3,3,2,1 — ✓
 */
const POSITION_SHUFFLE = [
   0, 10, 20,  5, 15, 25,  3,
  13, 18,  8, 23,  1, 11, 21,
   6, 16, 26,  4, 14, 22,  9,
];

/* ── deterministic fallback color ────────────────────────────────────────── */
function techColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffff;
  return `hsl(${h % 360}, 68%, 60%)`;
}

function abbr(name: string): string {
  const w = name.split(/[\s\/\.\-]+/).filter(Boolean);
  return w.length >= 2 ? (w[0][0] + w[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
}

/* ── fallback interleaved by category so scatter looks natural ───────────── */
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

  const scrambled = useScramble(activeCat.toUpperCase(), 650, catIdx);

  useEffect(() => {
    if (cats.length <= 1) return;
    const id = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => { setCatIdx(i => (i + 1) % cats.length); setTransitioning(false); }, 320);
    }, 4200);
    return () => clearInterval(id);
  }, [cats.length]);

  const switchCat = (i: number) => {
    if (i === catIdx) return;
    setTransitioning(true);
    setTimeout(() => { setCatIdx(i); setTransitioning(false); }, 320);
  };

  return (
    <section
      id="skills"
      style={{
        height: "100vh",
        overflow: "hidden",
        background: BG,
        color: INK,
        display: "flex",
        flexDirection: "column",
        padding: "20px 28px 16px",
        position: "relative",
      }}
    >
      {/* ── Section header ── */}
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

      {/* ── Full-remaining-height canvas ── */}
      <div style={{ position: "relative", flex: 1, marginTop: 12 }}>

        {/* Ghost watermark — category name huge in background */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            zIndex: 0,
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(5rem, 10vw, 9rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.05em",
            textTransform: "uppercase",
            color: INK,
            opacity: 0.04,
            userSelect: "none",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {scrambled || "\u00A0"}
        </div>

        {/* ── Scattered skill nodes ── */}
        {source.map((skill, i) => {
          const posIdx = POSITION_SHUFFLE[i % POSITION_SHUFFLE.length];
          const pos    = POSITIONS[posIdx % POSITIONS.length];
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

        {/* ── Category UI — bottom-right ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 8,
          }}
        >
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.4rem, 2.8vw, 2.4rem)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: INK,
            }}
          >
            {scrambled || "\u00A0"}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.18em" }}>
            <span style={{ color: ACCENT }}>{activeSkills.length} skills</span>
            <span style={{ opacity: 0.25 }}>/</span>
            <span style={{ opacity: 0.45 }}>avg {avgProf}%</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {cats.map((cat, i) => (
              <button
                key={cat}
                onClick={() => switchCat(i)}
                title={cat}
                style={{
                  height: 6,
                  width: i === catIdx ? 26 : 6,
                  borderRadius: 3,
                  background: i === catIdx ? ACCENT : `${INK}28`,
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "width 0.38s cubic-bezier(0.4,0,0.2,1), background 0.38s",
                }}
              />
            ))}
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, opacity: 0.3, marginLeft: 4, letterSpacing: "0.15em" }}>
              {String(catIdx + 1).padStart(2,"0")}/{String(cats.length).padStart(2,"0")}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─── SkillNode ──────────────────────────────────────────────────────────── */

function SkillNode({
  skill, active, transitioning, left, top,
}: {
  skill: Skill; active: boolean; transitioning: boolean; left: number; top: number;
}) {
  const entry   = ICON_MAP[skill.name];
  const brand   = entry?.color ?? techColor(skill.name);
  const IconCmp = entry?.Icon;

  const sz      = 72;
  const strokeW = 2;
  const r       = (sz - strokeW * 2) / 2;
  const circ    = 2 * Math.PI * r;
  const dash    = (Math.min(100, Math.max(0, skill.proficiency)) / 100) * circ;
  const cx      = sz / 2;

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
        gap: 4,
        zIndex: active ? 10 : 3,
        cursor: "default",
        /* opacity: inactive raised to 0.38 so icons are clearly visible */
        opacity: transitioning ? 0.08 : active ? 1 : 0.38,
        /* grayscale: 80% when inactive — still shows a hint of color */
        filter: transitioning
          ? "grayscale(100%)"
          : active
          ? `grayscale(0%) drop-shadow(0 0 10px ${brand}cc) drop-shadow(0 0 24px ${brand}66)`
          : "grayscale(80%)",
        transition: "opacity 0.48s cubic-bezier(0.4,0,0.2,1), filter 0.48s",
      }}
    >
      {/* Ring + icon */}
      <div style={{ position: "relative", width: sz, height: sz }}>
        <svg width={sz} height={sz} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
          <circle cx={cx} cy={cx} r={r} fill="none" stroke={`${INK}12`} strokeWidth={strokeW} />
          <circle
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke={active ? brand : `${INK}22`}
            strokeWidth={strokeW}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="round"
            style={{ transition: "stroke 0.48s" }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 8,
            borderRadius: "50%",
            border: `1.5px solid ${active ? brand + "70" : INK + "20"}`,
            background: active ? brand + "16" : `${INK}06`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "border-color 0.48s, background 0.48s",
          }}
        >
          {IconCmp ? (
            <IconCmp size={active ? 26 : 20} color={active ? brand : INK} />
          ) : (
            <span style={{
              fontFamily: "Inter, sans-serif", fontWeight: 800,
              fontSize: active ? 13 : 10,
              color: active ? brand : INK,
              transition: "color 0.48s",
            }}>
              {abbr(skill.name)}
            </span>
          )}
        </div>
      </div>

      {/* Label */}
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 7.5,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: active ? brand : INK,
        whiteSpace: "nowrap",
        transition: "color 0.48s",
      }}>
        {skill.name}
      </div>
    </div>
  );
}

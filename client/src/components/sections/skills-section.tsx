import { useState, useEffect } from "react";
import type { Skill } from "@shared";
import {
  SiReact, SiTypescript, SiJavascript, SiThreedotjs,
  SiNodedotjs, SiNextdotjs, SiPostgresql, SiGraphql,
  SiTailwindcss, SiFramer, SiExpress, SiRedis,
  SiDocker, SiFigma, SiBlender, SiGit, SiVite,
  SiMongodb, SiPython, SiPrisma, SiSvelte,
  SiAstro, SiLinux, SiRust, SiGo, SiGreensock,
  SiCss3, SiHtml5, SiGithub, SiVuedotjs, SiAngular,
} from "react-icons/si";
import { Reveal } from "@/components/reveal";

const BG     = "#0A0A0A";
const INK    = "#F2EFE6";
const ACCENT = "#FF3D00";
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░<>/\\";

/* ── scramble ────────────────────────────────────────────────────────────── */
function useScramble(target: string, durationMs: number, runKey: number | string) {
  const [out, setOut] = useState<string>(target);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const head = Math.floor(t * (target.length + 4));
      let s = "";
      for (let i = 0; i < target.length; i++) {
        if (i < head - 4) s += target[i];
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

/* ── brand icons ─────────────────────────────────────────────────────────── */
type IconEntry = { Icon: React.ComponentType<{ size?: number; color?: string }>; color: string };
const ICON_MAP: Record<string, IconEntry> = {
  "React":         { Icon: SiReact,       color: "#61DAFB" },
  "TypeScript":    { Icon: SiTypescript,  color: "#3178C6" },
  "JavaScript":    { Icon: SiJavascript,  color: "#F7DF1E" },
  "Three.js":      { Icon: SiThreedotjs, color: "#CCCCCC" },
  "Node.js":       { Icon: SiNodedotjs,  color: "#339933" },
  "Next.js":       { Icon: SiNextdotjs,  color: "#CCCCCC" },
  "PostgreSQL":    { Icon: SiPostgresql,  color: "#4169E1" },
  "GraphQL":       { Icon: SiGraphql,     color: "#E10098" },
  "Tailwind":      { Icon: SiTailwindcss, color: "#06B6D4" },
  "TailwindCSS":   { Icon: SiTailwindcss, color: "#06B6D4" },
  "Framer":        { Icon: SiFramer,      color: "#6B8EFA" },
  "Framer Motion": { Icon: SiFramer,      color: "#6B8EFA" },
  "Express":       { Icon: SiExpress,     color: "#CCCCCC" },
  "Express.js":    { Icon: SiExpress,     color: "#CCCCCC" },
  "Redis":         { Icon: SiRedis,       color: "#DC382D" },
  "Docker":        { Icon: SiDocker,      color: "#2496ED" },
  "MongoDB":       { Icon: SiMongodb,     color: "#47A248" },
  "Figma":         { Icon: SiFigma,       color: "#F24E1E" },
  "Blender":       { Icon: SiBlender,     color: "#F5792A" },
  "Git":           { Icon: SiGit,         color: "#F05032" },
  "GitHub":        { Icon: SiGithub,      color: "#CCCCCC" },
  "Vite":          { Icon: SiVite,        color: "#646CFF" },
  "Prisma":        { Icon: SiPrisma,      color: "#A78BFA" },
  "GSAP":          { Icon: SiGreensock,   color: "#88CE02" },
  "Svelte":        { Icon: SiSvelte,      color: "#FF3E00" },
  "Astro":         { Icon: SiAstro,       color: "#FF5D01" },
  "Linux":         { Icon: SiLinux,       color: "#FCC624" },
  "Python":        { Icon: SiPython,      color: "#3776AB" },
  "Rust":          { Icon: SiRust,        color: "#CE412B" },
  "Go":            { Icon: SiGo,          color: "#00ADD8" },
  "CSS":           { Icon: SiCss3,        color: "#1572B6" },
  "HTML":          { Icon: SiHtml5,       color: "#E34F26" },
  "Vue.js":        { Icon: SiVuedotjs,   color: "#4FC08D" },
  "Angular":       { Icon: SiAngular,     color: "#DD0031" },
};

function techColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffff;
  return `hsl(${h % 360}, 68%, 60%)`;
}
function abbr(name: string): string {
  const w = name.split(/[\s\/\.\-]+/).filter(Boolean);
  return w.length >= 2 ? (w[0][0] + w[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
}

/*
 * FALLBACK — 28 skills interleaved F,B,G,T so active-category icons
 * land at every-4th grid slot, making the glow look scattered (non-consecutive).
 * Grid is 7 wide so Frontend lands at cols 1,5,2,6,3,7,4 across rows.
 */
const FALLBACK: Skill[] = [
  /* 0  */ { id:"f1", name:"React",      category:"Frontend",     proficiency:95, icon:null, order:0 },
  /* 1  */ { id:"b1", name:"Node.js",    category:"Backend",      proficiency:88, icon:null, order:1 },
  /* 2  */ { id:"g1", name:"Three.js",   category:"3D/Graphics",  proficiency:85, icon:null, order:2 },
  /* 3  */ { id:"t1", name:"Git",        category:"Tools",        proficiency:95, icon:null, order:3 },
  /* 4  */ { id:"f2", name:"TypeScript", category:"Frontend",     proficiency:92, icon:null, order:4 },
  /* 5  */ { id:"b2", name:"PostgreSQL", category:"Backend",      proficiency:82, icon:null, order:5 },
  /* 6  */ { id:"g2", name:"Blender",    category:"3D/Graphics",  proficiency:70, icon:null, order:6 },
  /* 7  */ { id:"t2", name:"Figma",      category:"Tools",        proficiency:88, icon:null, order:7 },
  /* 8  */ { id:"f3", name:"Next.js",    category:"Frontend",     proficiency:88, icon:null, order:8 },
  /* 9  */ { id:"b3", name:"Express",    category:"Backend",      proficiency:90, icon:null, order:9 },
  /* 10 */ { id:"g3", name:"GSAP",       category:"3D/Graphics",  proficiency:83, icon:null, order:10 },
  /* 11 */ { id:"t3", name:"Linux",      category:"Tools",        proficiency:82, icon:null, order:11 },
  /* 12 */ { id:"f4", name:"Tailwind",   category:"Frontend",     proficiency:90, icon:null, order:12 },
  /* 13 */ { id:"b4", name:"GraphQL",    category:"Backend",      proficiency:78, icon:null, order:13 },
  /* 14 */ { id:"g4", name:"Svelte",     category:"3D/Graphics",  proficiency:72, icon:null, order:14 },
  /* 15 */ { id:"t4", name:"Python",     category:"Tools",        proficiency:80, icon:null, order:15 },
  /* 16 */ { id:"f5", name:"Framer",     category:"Frontend",     proficiency:80, icon:null, order:16 },
  /* 17 */ { id:"b5", name:"Redis",      category:"Backend",      proficiency:75, icon:null, order:17 },
  /* 18 */ { id:"g5", name:"Astro",      category:"3D/Graphics",  proficiency:74, icon:null, order:18 },
  /* 19 */ { id:"t5", name:"GitHub",     category:"Tools",        proficiency:96, icon:null, order:19 },
  /* 20 */ { id:"f6", name:"Vite",       category:"Frontend",     proficiency:87, icon:null, order:20 },
  /* 21 */ { id:"b6", name:"Docker",     category:"Backend",      proficiency:72, icon:null, order:21 },
  /* 22 */ { id:"g6", name:"Rust",       category:"3D/Graphics",  proficiency:65, icon:null, order:22 },
  /* 23 */ { id:"t6", name:"Go",         category:"Tools",        proficiency:70, icon:null, order:23 },
  /* 24 */ { id:"f7", name:"JavaScript", category:"Frontend",     proficiency:94, icon:null, order:24 },
  /* 25 */ { id:"b7", name:"Prisma",     category:"Backend",      proficiency:83, icon:null, order:25 },
  /* 26 */ { id:"g7", name:"Vue.js",     category:"3D/Graphics",  proficiency:68, icon:null, order:26 },
  /* 27 */ { id:"t7", name:"Figma",      category:"Tools",        proficiency:88, icon:null, order:27 },
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

  const scrambled = useScramble(activeCat.toUpperCase(), 680, catIdx);

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
        borderTop: `2px solid ${INK}18`,
      }}
    >
      {/* ════ LEFT PANEL ════ */}
      <div
        style={{
          width: 300,
          flexShrink: 0,
          borderRight: `2px solid ${INK}15`,
          display: "flex",
          flexDirection: "column",
          padding: "28px 28px 28px 28px",
          gap: 0,
        }}
      >
        {/* Section meta */}
        <Reveal>
          <div style={{ marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: 11, color: ACCENT, letterSpacing: "0.1em" }}>
                03
              </span>
              <span style={{ fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: "0.18em", opacity: 0.5 }}>
                / SKILLS
              </span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.28em", opacity: 0.32, textTransform: "uppercase" }}>
              // CAPABILITY MATRIX
            </div>
          </div>
        </Reveal>

        {/* Divider */}
        <div style={{ height: 1, background: `${INK}12`, margin: "16px 0" }} />

        {/* Big scrambled category name */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.28em", opacity: 0.38, textTransform: "uppercase", marginBottom: 10 }}>
            ACTIVE CATEGORY
          </div>
          <div
            style={{
              fontFamily: "Inter,sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2rem, 3.2vw, 3.2rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              wordBreak: "break-all",
              minHeight: "3em",
            }}
          >
            {scrambled || "\u00A0"}
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 16, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.18em" }}>
            <span style={{ color: ACCENT, fontSize: 13, fontFamily: "Inter,sans-serif", fontWeight: 800 }}>
              {activeSkills.length}
            </span>
            <span style={{ opacity: 0.35 }}>skills</span>
            <span style={{ opacity: 0.2 }}>/</span>
            <span style={{ opacity: 0.35 }}>avg</span>
            <span style={{ color: ACCENT, fontSize: 13, fontFamily: "Inter,sans-serif", fontWeight: 800 }}>
              {avgProf}%
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: `${INK}12`, margin: "16px 0" }} />

        {/* Category list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {cats.map((cat, i) => (
            <button
              key={cat}
              onClick={() => switchCat(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px 0",
                textAlign: "left",
              }}
            >
              {/* Active indicator bar */}
              <div style={{
                width: i === catIdx ? 20 : 4,
                height: 2,
                background: i === catIdx ? ACCENT : `${INK}25`,
                borderRadius: 1,
                flexShrink: 0,
                transition: "width 0.38s cubic-bezier(0.4,0,0.2,1), background 0.38s",
              }} />
              <span style={{
                fontFamily: "Inter,sans-serif",
                fontWeight: i === catIdx ? 800 : 400,
                fontSize: 11,
                letterSpacing: i === catIdx ? "0.08em" : "0.06em",
                textTransform: "uppercase",
                color: i === catIdx ? INK : `${INK}45`,
                transition: "color 0.38s, font-weight 0.2s, letter-spacing 0.38s",
              }}>
                {cat}
              </span>
              <span style={{
                marginLeft: "auto",
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 9,
                color: i === catIdx ? ACCENT : `${INK}25`,
                transition: "color 0.38s",
              }}>
                {String(grouped[cat]?.length ?? 0).padStart(2,"0")}
              </span>
            </button>
          ))}
        </div>

        {/* Bottom: counter */}
        <div style={{ marginTop: 16, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, opacity: 0.22, letterSpacing: "0.18em" }}>
          {String(catIdx + 1).padStart(2,"0")} / {String(cats.length).padStart(2,"0")} CATEGORIES
        </div>
      </div>

      {/* ════ RIGHT PANEL — icon grid ════ */}
      <div
        style={{
          flex: 1,
          background: "#0D0D0D",
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "10px 6px",
          padding: "28px 24px",
          alignContent: "center",
          overflow: "hidden",
        }}
      >
        {source.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, opacity: 0.2, letterSpacing: "0.3em", textTransform: "uppercase" }}>
            SCANNING STACK…
          </div>
        ) : source.map((skill, i) => (
          <SkillNode
            key={skill.id}
            skill={skill}
            active={skill.category === activeCat}
            transitioning={transitioning}
            catIdx={catIdx}
          />
        ))}
      </div>
    </section>
  );
}

/* ─── SkillNode ──────────────────────────────────────────────────────────── */

function SkillNode({
  skill, active, transitioning, catIdx,
}: {
  skill: Skill; active: boolean; transitioning: boolean; catIdx: number;
}) {
  const entry   = ICON_MAP[skill.name];
  const brand   = entry?.color ?? techColor(skill.name);
  const IconCmp = entry?.Icon;

  const sz      = 68;
  const strokeW = 2.5;
  const r       = (sz - strokeW * 2) / 2;
  const circ    = 2 * Math.PI * r;
  const dash    = (Math.min(100, Math.max(0, skill.proficiency)) / 100) * circ;

  /* When active, dashoffset animates from circ → (circ - dash) via CSS transition.
   * The key change on catIdx forces a remount so the arc always draws from zero. */
  const offset  = active ? circ - dash : circ;

  return (
    <div
      title={`${skill.name} · ${skill.proficiency}%`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        opacity: transitioning ? 0.06 : active ? 1 : 0.3,
        filter: transitioning
          ? "grayscale(100%)"
          : active
          ? `grayscale(0%) drop-shadow(0 0 8px ${brand}bb) drop-shadow(0 0 20px ${brand}55)`
          : "grayscale(70%)",
        transition: "opacity 0.48s cubic-bezier(0.4,0,0.2,1), filter 0.48s",
      }}
    >
      {/* Ring + icon */}
      <div style={{ position: "relative", width: sz, height: sz }}>
        <svg
          width={sz} height={sz}
          style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}
        >
          {/* Track */}
          <circle
            cx={sz/2} cy={sz/2} r={r}
            fill="none"
            stroke={`${INK}10`}
            strokeWidth={strokeW}
          />
          {/* Animated fill arc — key changes on catIdx so it redraws from 0 each cycle */}
          <circle
            key={`${skill.id}-${catIdx}`}
            cx={sz/2} cy={sz/2} r={r}
            fill="none"
            stroke={active ? brand : `${INK}20`}
            strokeWidth={strokeW}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: active
                ? "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1), stroke 0.5s"
                : "stroke 0.5s",
            }}
          />
        </svg>

        {/* Inner circle */}
        <div
          style={{
            position: "absolute",
            inset: 8,
            borderRadius: "50%",
            border: `1.5px solid ${active ? brand + "60" : INK + "18"}`,
            background: active ? brand + "14" : `${INK}05`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "border-color 0.48s, background 0.48s",
          }}
        >
          {IconCmp ? (
            <IconCmp size={active ? 24 : 18} color={active ? brand : INK} />
          ) : (
            <span style={{
              fontFamily: "Inter,sans-serif", fontWeight: 800,
              fontSize: active ? 12 : 9,
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
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: 7,
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        color: active ? brand : `${INK}70`,
        whiteSpace: "nowrap",
        transition: "color 0.48s",
        maxWidth: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}>
        {skill.name}
      </div>
    </div>
  );
}

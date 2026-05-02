import { useState, useEffect } from "react";
import type { Skill } from "@shared";
import {
  SiReact, SiTypescript, SiJavascript, SiThreedotjs,
  SiNodedotjs, SiNextdotjs, SiPostgresql, SiGraphql,
  SiTailwindcss, SiFramer, SiExpress, SiRedis,
  SiDocker, SiFigma, SiBlender, SiGit, SiVite,
  SiMongodb, SiMysql, SiPython, SiPrisma, SiSvelte,
  SiAstro, SiLinux, SiRust, SiGo, SiGreensock,
  SiCss3, SiHtml5, SiGithub, SiVuedotjs, SiAngular,
  SiFlutter, SiKubernetes, SiTerraform, SiNginx, SiWebpack,
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

/* ── brand icon + color map ──────────────────────────────────────────────── */
type IconEntry = { Icon: React.ComponentType<{ size?: number; color?: string }>; color: string };
const ICON_MAP: Record<string, IconEntry> = {
  "React":          { Icon: SiReact,       color: "#61DAFB" },
  "TypeScript":     { Icon: SiTypescript,  color: "#3178C6" },
  "JavaScript":     { Icon: SiJavascript,  color: "#F7DF1E" },
  "Three.js":       { Icon: SiThreedotjs, color: "#C8C8C8" },
  "Node.js":        { Icon: SiNodedotjs,  color: "#339933" },
  "Next.js":        { Icon: SiNextdotjs,  color: "#C8C8C8" },
  "PostgreSQL":     { Icon: SiPostgresql,  color: "#4169E1" },
  "GraphQL":        { Icon: SiGraphql,     color: "#E10098" },
  "Tailwind":       { Icon: SiTailwindcss, color: "#06B6D4" },
  "TailwindCSS":    { Icon: SiTailwindcss, color: "#06B6D4" },
  "Framer":         { Icon: SiFramer,      color: "#6B8EFA" },
  "Framer Motion":  { Icon: SiFramer,      color: "#6B8EFA" },
  "Express":        { Icon: SiExpress,     color: "#C8C8C8" },
  "Express.js":     { Icon: SiExpress,     color: "#C8C8C8" },
  "Redis":          { Icon: SiRedis,       color: "#DC382D" },
  "Docker":         { Icon: SiDocker,      color: "#2496ED" },
  "MongoDB":        { Icon: SiMongodb,     color: "#47A248" },
  "MySQL":          { Icon: SiMysql,       color: "#4479A1" },
  "Figma":          { Icon: SiFigma,       color: "#F24E1E" },
  "Blender":        { Icon: SiBlender,     color: "#F5792A" },
  "Git":            { Icon: SiGit,         color: "#F05032" },
  "GitHub":         { Icon: SiGithub,      color: "#C8C8C8" },
  "Vite":           { Icon: SiVite,        color: "#646CFF" },
  "Prisma":         { Icon: SiPrisma,      color: "#A78BFA" },
  "GSAP":           { Icon: SiGreensock,   color: "#88CE02" },
  "Svelte":         { Icon: SiSvelte,      color: "#FF3E00" },
  "Astro":          { Icon: SiAstro,       color: "#FF5D01" },
  "Linux":          { Icon: SiLinux,       color: "#FCC624" },
  "Python":         { Icon: SiPython,      color: "#3776AB" },
  "Rust":           { Icon: SiRust,        color: "#CE412B" },
  "Go":             { Icon: SiGo,          color: "#00ADD8" },
  "CSS":            { Icon: SiCss3,        color: "#1572B6" },
  "CSS3":           { Icon: SiCss3,        color: "#1572B6" },
  "HTML":           { Icon: SiHtml5,       color: "#E34F26" },
  "HTML5":          { Icon: SiHtml5,       color: "#E34F26" },
  "Vue.js":         { Icon: SiVuedotjs,   color: "#4FC08D" },
  "Vue":            { Icon: SiVuedotjs,   color: "#4FC08D" },
  "Angular":        { Icon: SiAngular,     color: "#DD0031" },
  "Flutter":        { Icon: SiFlutter,     color: "#02569B" },
  "Kubernetes":     { Icon: SiKubernetes,  color: "#326CE5" },
  "Terraform":      { Icon: SiTerraform,   color: "#7B42BC" },
  "Nginx":          { Icon: SiNginx,       color: "#009639" },
  "Webpack":        { Icon: SiWebpack,     color: "#8DD6F9" },
};

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

/* ── fallback — 36 items across 4 categories ─────────────────────────────── */
const FALLBACK: Skill[] = [
  { id:"f01", name:"React",      category:"Frontend",     proficiency:95, icon:null, order:0  },
  { id:"f02", name:"TypeScript", category:"Frontend",     proficiency:92, icon:null, order:1  },
  { id:"f03", name:"Next.js",    category:"Frontend",     proficiency:88, icon:null, order:2  },
  { id:"f04", name:"Tailwind",   category:"Frontend",     proficiency:90, icon:null, order:3  },
  { id:"f05", name:"Vite",       category:"Frontend",     proficiency:87, icon:null, order:4  },
  { id:"f06", name:"Framer",     category:"Frontend",     proficiency:80, icon:null, order:5  },
  { id:"f07", name:"JavaScript", category:"Frontend",     proficiency:93, icon:null, order:6  },
  { id:"f08", name:"CSS",        category:"Frontend",     proficiency:90, icon:null, order:7  },
  { id:"f09", name:"HTML",       category:"Frontend",     proficiency:95, icon:null, order:8  },
  { id:"f10", name:"Svelte",     category:"Frontend",     proficiency:72, icon:null, order:9  },
  { id:"f11", name:"Astro",      category:"Frontend",     proficiency:75, icon:null, order:10 },
  { id:"f12", name:"Vue.js",     category:"Frontend",     proficiency:68, icon:null, order:11 },
  { id:"b01", name:"Node.js",    category:"Backend",      proficiency:88, icon:null, order:0  },
  { id:"b02", name:"PostgreSQL", category:"Backend",      proficiency:82, icon:null, order:1  },
  { id:"b03", name:"Redis",      category:"Backend",      proficiency:75, icon:null, order:2  },
  { id:"b04", name:"Express",    category:"Backend",      proficiency:90, icon:null, order:3  },
  { id:"b05", name:"GraphQL",    category:"Backend",      proficiency:78, icon:null, order:4  },
  { id:"b06", name:"Docker",     category:"Backend",      proficiency:72, icon:null, order:5  },
  { id:"b07", name:"Prisma",     category:"Backend",      proficiency:83, icon:null, order:6  },
  { id:"b08", name:"MongoDB",    category:"Backend",      proficiency:76, icon:null, order:7  },
  { id:"b09", name:"Python",     category:"Backend",      proficiency:70, icon:null, order:8  },
  { id:"b10", name:"Nginx",      category:"Backend",      proficiency:65, icon:null, order:9  },
  { id:"b11", name:"Go",         category:"Backend",      proficiency:62, icon:null, order:10 },
  { id:"b12", name:"Kubernetes", category:"Backend",      proficiency:60, icon:null, order:11 },
  { id:"g01", name:"Three.js",   category:"3D/Graphics",  proficiency:85, icon:null, order:0  },
  { id:"g02", name:"Blender",    category:"3D/Graphics",  proficiency:70, icon:null, order:1  },
  { id:"g03", name:"GSAP",       category:"3D/Graphics",  proficiency:83, icon:null, order:2  },
  { id:"t01", name:"Git",        category:"Tools",        proficiency:95, icon:null, order:0  },
  { id:"t02", name:"Figma",      category:"Tools",        proficiency:88, icon:null, order:1  },
  { id:"t03", name:"GitHub",     category:"Tools",        proficiency:92, icon:null, order:2  },
  { id:"t04", name:"Linux",      category:"Tools",        proficiency:82, icon:null, order:3  },
  { id:"t05", name:"Webpack",    category:"Tools",        proficiency:70, icon:null, order:4  },
  { id:"t06", name:"Terraform",  category:"Tools",        proficiency:62, icon:null, order:5  },
  { id:"t07", name:"Angular",    category:"Tools",        proficiency:55, icon:null, order:6  },
  { id:"t08", name:"Flutter",    category:"Tools",        proficiency:58, icon:null, order:7  },
  { id:"t09", name:"Rust",       category:"Tools",        proficiency:60, icon:null, order:8  },
];

/* ── marquee text content ────────────────────────────────────────────────── */
const MARQUEE_A =
  " REACT · TYPESCRIPT · NEXT.JS · TAILWIND · VITE · FRAMER · JAVASCRIPT · CSS3 · HTML5 · SVELTE · ASTRO · VUE.JS · THREE.JS · GSAP · BLENDER · ";
const MARQUEE_B =
  " NODE.JS · POSTGRESQL · REDIS · EXPRESS · GRAPHQL · DOCKER · PRISMA · MONGODB · PYTHON · NGINX · GO · KUBERNETES · TERRAFORM · WEBPACK · ANGULAR · FLUTTER · RUST · GIT · FIGMA · GITHUB · LINUX · ";

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
        padding: "20px 28px 0",
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

      {/* ── Category bar ── */}
      <div
        className="mt-5 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${INK}18`, paddingBottom: 10 }}
      >
        {/* Left: live dot + scramble name + meta */}
        <div className="flex items-center gap-3">
          <span
            className="brut-blink inline-block h-2 w-2"
            style={{ background: ACCENT, borderRadius: 1 }}
            aria-hidden
          />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1rem, 2.2vw, 1.6rem)",
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {scrambled || "\u00A0"}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-35">
            {activeSkills.length} skills · avg{" "}
            <span style={{ color: ACCENT }}>{avgProf}%</span>
          </span>
        </div>

        {/* Right: dot selector + counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {cats.map((cat, i) => (
              <button
                key={cat}
                onClick={() => switchCat(i)}
                title={cat}
                style={{
                  height: 6,
                  width: i === catIdx ? 24 : 6,
                  borderRadius: 3,
                  background: i === catIdx ? ACCENT : `${INK}28`,
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "width 0.38s cubic-bezier(0.4,0,0.2,1), background 0.38s",
                }}
              />
            ))}
          </div>
          <span className="font-mono text-[9px] opacity-30 tracking-[0.15em]">
            {String(catIdx + 1).padStart(2, "0")}/{String(cats.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* ── Icon rows — horizontal lines, flex-wrap ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexWrap: "wrap",
          gap: "10px 6px",
          alignContent: "center",
          paddingTop: 16,
          paddingBottom: 8,
          overflow: "hidden",
        }}
      >
        {source.length === 0 ? (
          <div className="w-full text-center font-mono text-[11px] uppercase tracking-[0.3em] opacity-25">
            SCANNING STACK…
          </div>
        ) : (
          source.map((skill) => (
            <SkillNode
              key={skill.id}
              skill={skill}
              active={skill.category === activeCat}
              transitioning={transitioning}
            />
          ))
        )}
      </div>

      {/* ── Marquee strips ── */}
      {/* Strip A — left → right */}
      <div
        style={{
          overflow: "hidden",
          borderTop: `1px solid ${INK}18`,
          height: 28,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className="brut-marquee"
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: ACCENT,
            opacity: 0.65,
          }}
        >
          <span>{MARQUEE_A.repeat(4)}</span>
          <span aria-hidden>{MARQUEE_A.repeat(4)}</span>
        </div>
      </div>

      {/* Strip B — right → left */}
      <div
        style={{
          overflow: "hidden",
          borderTop: `1px solid ${INK}10`,
          height: 28,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className="brut-marquee-rev"
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: INK,
            opacity: 0.22,
          }}
        >
          <span>{MARQUEE_B.repeat(3)}</span>
          <span aria-hidden>{MARQUEE_B.repeat(3)}</span>
        </div>
      </div>
    </section>
  );
}

/* ─── SkillNode (in-flow, flex-wrap row) ─────────────────────────────────── */

function SkillNode({
  skill, active, transitioning,
}: { skill: Skill; active: boolean; transitioning: boolean }) {
  const entry   = ICON_MAP[skill.name];
  const brand   = entry?.color ?? techColor(skill.name);
  const IconCmp = entry?.Icon;

  const sz      = 64;
  const strokeW = 2;
  const r       = (sz - strokeW * 2) / 2;
  const circ    = 2 * Math.PI * r;
  const dash    = (Math.min(100, Math.max(0, skill.proficiency)) / 100) * circ;
  const cx      = sz / 2;

  return (
    <div
      title={`${skill.name} · ${skill.proficiency}%`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        flexShrink: 0,
        opacity: transitioning ? 0.06 : active ? 1 : 0.36,
        filter: transitioning
          ? "grayscale(100%)"
          : active
          ? `grayscale(0%) drop-shadow(0 0 8px ${brand}cc) drop-shadow(0 0 20px ${brand}66)`
          : "grayscale(75%)",
        transition: "opacity 0.45s cubic-bezier(0.4,0,0.2,1), filter 0.45s",
      }}
    >
      {/* SVG ring + brand icon */}
      <div style={{ position: "relative", width: sz, height: sz }}>
        <svg
          width={sz} height={sz}
          style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}
        >
          <circle cx={cx} cy={cx} r={r} fill="none" stroke={`${INK}12`} strokeWidth={strokeW} />
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

        <div
          style={{
            position: "absolute",
            inset: 7,
            borderRadius: "50%",
            border: `1.5px solid ${active ? brand + "60" : INK + "18"}`,
            background: active ? brand + "14" : `${INK}05`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "border-color 0.45s, background 0.45s",
          }}
        >
          {IconCmp ? (
            <IconCmp size={active ? 24 : 18} color={active ? brand : INK} />
          ) : (
            <span style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: active ? 12 : 9,
              color: active ? brand : INK,
              transition: "color 0.45s",
            }}>
              {abbr(skill.name)}
            </span>
          )}
        </div>
      </div>

      {/* Name */}
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 7,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: active ? brand : `${INK}99`,
        whiteSpace: "nowrap",
        transition: "color 0.45s",
      }}>
        {skill.name}
      </div>
    </div>
  );
}

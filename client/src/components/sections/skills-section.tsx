import { useState, useEffect, useRef, useMemo } from "react";
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
  SiFirebase, SiSupabase, SiAmazonwebservices, SiVercel,
  SiSass, SiRedux, SiJest, SiSwift, SiCplusplus, SiPhp,
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
  "React":         { Icon: SiReact,               color: "#61DAFB" },
  "TypeScript":    { Icon: SiTypescript,           color: "#3178C6" },
  "JavaScript":    { Icon: SiJavascript,           color: "#F7DF1E" },
  "Three.js":      { Icon: SiThreedotjs,           color: "#C8C8C8" },
  "Node.js":       { Icon: SiNodedotjs,            color: "#339933" },
  "Next.js":       { Icon: SiNextdotjs,            color: "#C8C8C8" },
  "PostgreSQL":    { Icon: SiPostgresql,           color: "#4169E1" },
  "GraphQL":       { Icon: SiGraphql,              color: "#E10098" },
  "Tailwind":      { Icon: SiTailwindcss,          color: "#06B6D4" },
  "TailwindCSS":   { Icon: SiTailwindcss,          color: "#06B6D4" },
  "Framer":        { Icon: SiFramer,               color: "#6B8EFA" },
  "Framer Motion": { Icon: SiFramer,               color: "#6B8EFA" },
  "Express":       { Icon: SiExpress,              color: "#C8C8C8" },
  "Express.js":    { Icon: SiExpress,              color: "#C8C8C8" },
  "Redis":         { Icon: SiRedis,                color: "#DC382D" },
  "Docker":        { Icon: SiDocker,               color: "#2496ED" },
  "MongoDB":       { Icon: SiMongodb,              color: "#47A248" },
  "MySQL":         { Icon: SiMysql,                color: "#4479A1" },
  "Figma":         { Icon: SiFigma,                color: "#F24E1E" },
  "Blender":       { Icon: SiBlender,              color: "#F5792A" },
  "Git":           { Icon: SiGit,                  color: "#F05032" },
  "GitHub":        { Icon: SiGithub,               color: "#C8C8C8" },
  "Vite":          { Icon: SiVite,                 color: "#646CFF" },
  "Prisma":        { Icon: SiPrisma,               color: "#A78BFA" },
  "GSAP":          { Icon: SiGreensock,            color: "#88CE02" },
  "Svelte":        { Icon: SiSvelte,               color: "#FF3E00" },
  "Astro":         { Icon: SiAstro,                color: "#FF5D01" },
  "Linux":         { Icon: SiLinux,                color: "#FCC624" },
  "Python":        { Icon: SiPython,               color: "#3776AB" },
  "Rust":          { Icon: SiRust,                 color: "#CE412B" },
  "Go":            { Icon: SiGo,                   color: "#00ADD8" },
  "Golang":        { Icon: SiGo,                   color: "#00ADD8" },
  "CSS":           { Icon: SiCss3,                 color: "#1572B6" },
  "CSS3":          { Icon: SiCss3,                 color: "#1572B6" },
  "HTML":          { Icon: SiHtml5,                color: "#E34F26" },
  "HTML5":         { Icon: SiHtml5,                color: "#E34F26" },
  "Vue.js":        { Icon: SiVuedotjs,             color: "#4FC08D" },
  "Vue":           { Icon: SiVuedotjs,             color: "#4FC08D" },
  "Angular":       { Icon: SiAngular,              color: "#DD0031" },
  "Flutter":       { Icon: SiFlutter,              color: "#02569B" },
  "Dart":          { Icon: SiDart,                 color: "#0175C2" },
  "Kubernetes":    { Icon: SiKubernetes,           color: "#326CE5" },
  "Terraform":     { Icon: SiTerraform,            color: "#7B42BC" },
  "Nginx":         { Icon: SiNginx,                color: "#009639" },
  "Webpack":       { Icon: SiWebpack,              color: "#8DD6F9" },
  "Firebase":      { Icon: SiFirebase,             color: "#FFCA28" },
  "Supabase":      { Icon: SiSupabase,             color: "#3ECF8E" },
  "AWS":           { Icon: SiAmazonwebservices,    color: "#FF9900" },
  "Vercel":        { Icon: SiVercel,               color: "#C8C8C8" },
  "Sass":          { Icon: SiSass,                 color: "#CC6699" },
  "Redux":         { Icon: SiRedux,                color: "#764ABC" },
  "Jest":          { Icon: SiJest,                 color: "#C21325" },
  "Swift":         { Icon: SiSwift,                color: "#F05138" },
  "C++":           { Icon: SiCplusplus,            color: "#00599C" },
  "PHP":           { Icon: SiPhp,                  color: "#777BB4" },
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

/* ── fallback skills list (28 total — 4 rows × 7) ───────────────────────── */
const FALLBACK: Skill[] = [
  { id:"f1",  name:"React",      category:"Frontend",     proficiency:95, icon:null, order:0  },
  { id:"f2",  name:"TypeScript", category:"Frontend",     proficiency:92, icon:null, order:1  },
  { id:"f3",  name:"Tailwind",   category:"Frontend",     proficiency:90, icon:null, order:2  },
  { id:"f4",  name:"Next.js",    category:"Frontend",     proficiency:88, icon:null, order:3  },
  { id:"f5",  name:"Framer",     category:"Frontend",     proficiency:80, icon:null, order:4  },
  { id:"f6",  name:"Vite",       category:"Frontend",     proficiency:87, icon:null, order:5  },
  { id:"f7",  name:"CSS",        category:"Frontend",     proficiency:93, icon:null, order:6  },
  { id:"b1",  name:"Node.js",    category:"Backend",      proficiency:88, icon:null, order:7  },
  { id:"b2",  name:"PostgreSQL", category:"Backend",      proficiency:82, icon:null, order:8  },
  { id:"b3",  name:"Redis",      category:"Backend",      proficiency:75, icon:null, order:9  },
  { id:"b4",  name:"Express",    category:"Backend",      proficiency:90, icon:null, order:10 },
  { id:"b5",  name:"GraphQL",    category:"Backend",      proficiency:78, icon:null, order:11 },
  { id:"b6",  name:"Docker",     category:"Backend",      proficiency:72, icon:null, order:12 },
  { id:"b7",  name:"Prisma",     category:"Backend",      proficiency:83, icon:null, order:13 },
  { id:"g1",  name:"Three.js",   category:"3D/Graphics",  proficiency:85, icon:null, order:14 },
  { id:"g2",  name:"Blender",    category:"3D/Graphics",  proficiency:70, icon:null, order:15 },
  { id:"g3",  name:"GSAP",       category:"3D/Graphics",  proficiency:83, icon:null, order:16 },
  { id:"t1",  name:"Git",        category:"Tools",        proficiency:95, icon:null, order:17 },
  { id:"t2",  name:"Figma",      category:"Tools",        proficiency:88, icon:null, order:18 },
  { id:"t3",  name:"Linux",      category:"Tools",        proficiency:82, icon:null, order:19 },
  { id:"t4",  name:"VS Code",    category:"Tools",        proficiency:98, icon:null, order:20 },
  { id:"b8",  name:"Firebase",   category:"Backend",      proficiency:80, icon:null, order:21 },
  { id:"b9",  name:"Supabase",   category:"Backend",      proficiency:76, icon:null, order:22 },
  { id:"t5",  name:"AWS",        category:"Tools",        proficiency:70, icon:null, order:23 },
  { id:"t6",  name:"Vercel",     category:"Tools",        proficiency:90, icon:null, order:24 },
  { id:"f8",  name:"Sass",       category:"Frontend",     proficiency:85, icon:null, order:25 },
  { id:"f9",  name:"Redux",      category:"Frontend",     proficiency:78, icon:null, order:26 },
  { id:"t7",  name:"Jest",       category:"Tools",        proficiency:75, icon:null, order:27 },
];

/* ── pick N random unique items from an array ────────────────────────────── */
function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

/* ─────────────────────────────────────────────────────────────────────────── */

export function SkillsSection({ skills, isLoading }: { skills: Skill[]; isLoading: boolean }) {
  const rawSource = isLoading ? [] : (skills.length > 0 ? skills : FALLBACK);

  /* shuffle once per source so categories are mixed randomly across the grid */
  const source = useMemo(() => {
    const arr = [...rawSource];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawSource.length]);

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

  /* ── sequential scattered glow: icons light up in random order, stay lit ── */
  const CYCLE_MS = 4200;
  const RING_MS  = 650;
  const [glowingIds, setGlowingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const n = activeSkills.length;
    if (n === 0) return;
    setGlowingIds(new Set());
    // shuffle the active skills so glow order is random across the grid
    const shuffled = [...activeSkills].sort(() => Math.random() - 0.5);
    const step = (CYCLE_MS - RING_MS) / Math.max(n, 1);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < n; i++) {
      const id = shuffled[i].id;
      timers.push(setTimeout(() => {
        setGlowingIds(prev => new Set([...prev, id]));
      }, Math.round(step * i)));
    }
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catIdx, source.length]);

  /* ── auto-advance categories ── */
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
        minHeight: "100vh",
        background: BG,
        color: INK,
        display: "flex",
        flexDirection: "column",
        padding: "80px 16px 16px",
        borderTop: `2px solid ${INK}`,
        borderBottom: `2px solid ${INK}`,
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

        {/* Ghost watermark */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
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

        {/* ── 7-column full-width grid ── */}
        <div
          style={{
            position: "relative",
            zIndex: 5,
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "12px 0",
            paddingBottom: 72,
          }}
        >
          {source.map((skill) => {
            const glowing = glowingIds.has(skill.id);
            const inActiveCat = skill.category === activeCat;
            return (
              <SkillNode
                key={skill.id}
                skill={skill}
                glowing={glowing && !transitioning}
                inActiveCat={inActiveCat}
                transitioning={transitioning}
                ringKey={`${catIdx}-${skill.id}`}
              />
            );
          })}
        </div>

        {/* ── Category UI — bottom-left ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
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
  skill, glowing, inActiveCat, transitioning, ringKey,
}: {
  skill: Skill;
  glowing: boolean;
  inActiveCat: boolean;
  transitioning: boolean;
  ringKey: string;
}) {
  const entry   = ICON_MAP[skill.name];
  const brand   = entry?.color ?? techColor(skill.name);
  const IconCmp = entry?.Icon;

  const sz      = 74;
  const strokeW = 2;
  const r       = (sz - strokeW * 2) / 2;
  const circ    = 2 * Math.PI * r;
  const dash    = (Math.min(100, Math.max(0, skill.proficiency)) / 100) * circ;
  const cx      = sz / 2;

  /* dim: not in active category and not glowing */
  const dimmed = !inActiveCat && !glowing;

  return (
    <div
      title={`${skill.name} · ${skill.proficiency}%`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        cursor: "default",
        opacity: transitioning ? 0.06 : glowing ? 1 : dimmed ? 0.38 : 0.55,
        filter: transitioning
          ? "grayscale(100%)"
          : glowing
          ? `grayscale(0%) drop-shadow(0 0 10px ${brand}cc) drop-shadow(0 0 26px ${brand}55)`
          : "grayscale(60%)",
        transition: "opacity 0.55s cubic-bezier(0.4,0,0.2,1), filter 0.55s",
      }}
    >
      {/* Ring + icon */}
      <div style={{ position: "relative", width: sz, height: sz }}>
        <svg width={sz} height={sz} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
          <circle cx={cx} cy={cx} r={r} fill="none" stroke={`${INK}12`} strokeWidth={strokeW} />
          {/* Animated progress arc — key resets the animation each time icon lights up */}
          <circle
            key={`ring-${skill.id}-${ringKey}`}
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke={glowing ? brand : `${INK}20`}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeDasharray={circ}
            style={{
              "--ring-circ": circ,
              "--ring-end": circ - dash,
              strokeDashoffset: glowing ? undefined : circ - dash,
              transition: "stroke 0.48s",
              animation: glowing ? `ringLoad 0.65s cubic-bezier(0.4,0,0.2,1) forwards` : "none",
            } as React.CSSProperties}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 8,
            borderRadius: "50%",
            border: `1.5px solid ${glowing ? brand + "70" : INK + "18"}`,
            background: glowing ? brand + "18" : `${INK}05`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "border-color 0.48s, background 0.48s",
          }}
        >
          {IconCmp ? (
            <IconCmp size={glowing ? 26 : 20} color={glowing ? brand : INK} />
          ) : (
            <span style={{
              fontFamily: "Inter, sans-serif", fontWeight: 800,
              fontSize: glowing ? 13 : 10,
              color: glowing ? brand : INK,
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
        fontSize: 8.5,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: glowing ? brand : INK,
        whiteSpace: "nowrap",
        transition: "color 0.48s",
      }}>
        {skill.name}
      </div>
    </div>
  );
}

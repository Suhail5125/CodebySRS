import { useState, useEffect } from "react";
import type { Skill } from "@shared";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

const BG    = "#0A0A0A";
const INK   = "#F2EFE6";
const ACCENT = "#FF3D00";

/* ── known abbreviations for common tech names ─────────────────────────── */
const ABBR: Record<string, string> = {
  "React": "RE", "TypeScript": "TS", "JavaScript": "JS",
  "Three.js": "3J", "Node.js": "NJ", "Next.js": "NX",
  "PostgreSQL": "PG", "GraphQL": "GQ", "Vue.js": "VU",
  "Angular": "NG", "Tailwind": "TW", "Framer": "FM",
  "Express": "EX", "Redis": "RD", "Docker": "DK",
  "Figma": "FG", "Blender": "BL", "WebGL": "GL",
  "CSS": "CS", "Git": "GT", "VS Code": "VS", "Prisma": "PR",
  "MongoDB": "MG", "MySQL": "MY", "Rust": "RS", "Go": "GO",
  "Python": "PY", "Swift": "SW", "Kotlin": "KT", "Flutter": "FL",
  "AWS": "AW", "GCP": "GC", "Azure": "AZ", "Linux": "LX",
  "GSAP": "GS", "Svelte": "SV", "Astro": "AS",
};

function abbr(name: string) {
  if (ABBR[name]) return ABBR[name];
  const w = name.split(/[\s\/\.\-]+/).filter(Boolean);
  if (w.length >= 2) return (w[0][0] + w[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function short(name: string) {
  return name.split(/\s+/)[0].slice(0, 7).toUpperCase();
}

/* ── fallback so section never looks empty ─────────────────────────────── */
const FALLBACK: Skill[] = [
  { id:"f1", name:"React",      category:"Frontend",    proficiency:95, icon:null, order:0 },
  { id:"f2", name:"TypeScript", category:"Frontend",    proficiency:92, icon:null, order:1 },
  { id:"f3", name:"Three.js",   category:"Frontend",    proficiency:85, icon:null, order:2 },
  { id:"f4", name:"Tailwind",   category:"Frontend",    proficiency:90, icon:null, order:3 },
  { id:"f5", name:"Next.js",    category:"Frontend",    proficiency:88, icon:null, order:4 },
  { id:"f6", name:"Framer",     category:"Frontend",    proficiency:80, icon:null, order:5 },
  { id:"b1", name:"Node.js",    category:"Backend",     proficiency:88, icon:null, order:0 },
  { id:"b2", name:"PostgreSQL", category:"Backend",     proficiency:82, icon:null, order:1 },
  { id:"b3", name:"Redis",      category:"Backend",     proficiency:75, icon:null, order:2 },
  { id:"b4", name:"Express",    category:"Backend",     proficiency:90, icon:null, order:3 },
  { id:"b5", name:"GraphQL",    category:"Backend",     proficiency:78, icon:null, order:4 },
  { id:"b6", name:"Docker",     category:"Backend",     proficiency:72, icon:null, order:5 },
  { id:"g1", name:"WebGL",      category:"3D/Graphics", proficiency:80, icon:null, order:0 },
  { id:"g2", name:"Blender",    category:"3D/Graphics", proficiency:70, icon:null, order:1 },
  { id:"g3", name:"GSAP",       category:"3D/Graphics", proficiency:83, icon:null, order:2 },
  { id:"t1", name:"Git",        category:"Tools",       proficiency:95, icon:null, order:0 },
  { id:"t2", name:"Figma",      category:"Tools",       proficiency:88, icon:null, order:1 },
  { id:"t3", name:"VS Code",    category:"Tools",       proficiency:98, icon:null, order:2 },
  { id:"t4", name:"Linux",      category:"Tools",       proficiency:82, icon:null, order:3 },
];

/* ─────────────────────────────────────────────────────────────────────── */

interface SkillsSectionProps {
  skills: Skill[];
  isLoading: boolean;
}

export function SkillsSection({ skills, isLoading }: SkillsSectionProps) {
  const source = isLoading ? [] : (skills.length > 0 ? skills : FALLBACK);

  const grouped = source.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, Skill[]>);

  const cats = Object.keys(grouped);
  const [catIdx, setCatIdx]           = useState(0);
  const [fading, setFading]           = useState(false);
  const [hoveredId, setHoveredId]     = useState<string | null>(null);

  const activeCat    = cats[catIdx] ?? "";
  const activeSkills = (grouped[activeCat] ?? []).slice(0, 8);
  const avgProf      = activeSkills.length
    ? Math.round(activeSkills.reduce((a, s) => a + s.proficiency, 0) / activeSkills.length)
    : 0;

  /* auto-cycle */
  useEffect(() => {
    if (cats.length <= 1) return;
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCatIdx(i => (i + 1) % cats.length);
        setFading(false);
      }, 380);
    }, 3800);
    return () => clearInterval(id);
  }, [cats.length]);

  const switchCat = (i: number) => {
    if (i === catIdx) return;
    setFading(true);
    setTimeout(() => { setCatIdx(i); setFading(false); }, 380);
  };

  return (
    <section
      id="skills"
      className="relative min-h-screen overflow-hidden px-6 py-20 lg:px-10"
      style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
    >
      <div className="mx-auto w-full max-w-[1400px]">
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

        {/* ── main split ── */}
        <div
          className="mt-10 grid grid-cols-1 lg:grid-cols-12"
          style={{ border: `2px solid ${INK}` }}
        >

          {/* ── LEFT: radial ring panel ── */}
          <div
            className="lg:col-span-5"
            style={{ borderRight: `2px solid ${INK}`, display: "flex", flexDirection: "column" }}
          >
            {/* Category label */}
            <div className="px-6 pt-6 pb-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-40">
                ACTIVE CATEGORY
              </div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  textTransform: "uppercase",
                  color: INK,
                  marginTop: 6,
                  opacity: fading ? 0 : 1,
                  transform: fading ? "translateY(10px)" : "translateY(0)",
                  transition: "opacity 0.38s cubic-bezier(0.4,0,0.2,1), transform 0.38s cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                {activeCat || "LOADING…"}
              </div>
              <div className="mt-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
                <span style={{ color: ACCENT }}>{activeSkills.length} SKILLS</span>
                <span className="opacity-30">·</span>
                <span className="opacity-50">AVG {avgProf}%</span>
              </div>
            </div>

            {/* Radial ring */}
            <div style={{ flex: 1, position: "relative", minHeight: 380 }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: fading ? 0 : 1,
                  transform: fading ? "scale(0.93)" : "scale(1)",
                  transition: "opacity 0.38s cubic-bezier(0.4,0,0.2,1), transform 0.38s cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                {/* Center glow orb */}
                <div
                  style={{
                    position: "absolute",
                    width: 88,
                    height: 88,
                    borderRadius: "50%",
                    border: `2px solid ${ACCENT}`,
                    background: BG,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 0 20px ${ACCENT}55, 0 0 44px ${ACCENT}22`,
                    zIndex: 2,
                  }}
                >
                  <span style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 800,
                    fontSize: 24,
                    color: ACCENT,
                    lineHeight: 1,
                  }}>
                    {String(avgProf).padStart(2, "0")}
                  </span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 8,
                    color: INK,
                    opacity: 0.45,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginTop: 3,
                  }}>
                    AVG %
                  </span>
                </div>

                {/* Orbital connector ring */}
                <div
                  style={{
                    position: "absolute",
                    width: 296,
                    height: 296,
                    borderRadius: "50%",
                    border: `1px dashed ${INK}12`,
                    pointerEvents: "none",
                  }}
                />

                {/* Skill nodes */}
                {activeSkills.map((skill, i) => {
                  const angleDeg = i * (360 / activeSkills.length) - 90;
                  const angleRad = (angleDeg * Math.PI) / 180;
                  const radius   = 148;
                  const x = Math.cos(angleRad) * radius;
                  const y = Math.sin(angleRad) * radius;
                  const isHov = hoveredId === skill.id;

                  return (
                    <div
                      key={skill.id}
                      onMouseEnter={() => setHoveredId(skill.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                        zIndex: 1,
                        cursor: "default",
                      }}
                    >
                      <SkillNode skill={skill} glowing={isHov} size={72} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category dot selector */}
            <div
              className="flex items-center justify-center gap-2 pb-5"
              style={{ borderTop: `1px solid ${INK}15`, paddingTop: 16 }}
            >
              {cats.map((cat, i) => (
                <button
                  key={cat}
                  onClick={() => switchCat(i)}
                  title={cat}
                  style={{
                    height: 8,
                    width: i === catIdx ? 28 : 8,
                    borderRadius: 4,
                    background: i === catIdx ? ACCENT : `${INK}35`,
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "width 0.35s cubic-bezier(0.4,0,0.2,1), background 0.35s",
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── RIGHT: scattered all-skills grid ── */}
          <div className="hidden lg:flex lg:col-span-7" style={{ flexWrap: "wrap", alignContent: "center", padding: "32px 24px", gap: 0 }}>
            {source.map((skill) => {
              const isActive = skill.category === activeCat;
              return (
                <MiniNode
                  key={skill.id}
                  skill={skill}
                  isActive={isActive}
                  transitioning={fading}
                />
              );
            })}
          </div>

        </div>

        {/* ── telemetry strip ── */}
        <div
          className="grid grid-cols-2 gap-0 font-mono text-[11px] uppercase tracking-[0.2em] md:grid-cols-4"
          style={{ border: `2px solid ${INK}`, borderTop: "none" }}
        >
          {[
            { k: "ACTIVE_CAT", v: activeCat || "—" },
            { k: "ITEMS",      v: String(activeSkills.length).padStart(2, "0") },
            { k: "AVG_PROF",   v: `${avgProf}%` },
            { k: "STATUS",     v: "OPERATIONAL" },
          ].map((t, i) => (
            <div
              key={t.k}
              className="flex items-center justify-between px-4 py-3"
              style={{ borderRight: i < 3 ? `2px solid ${INK}` : "none" }}
            >
              <span className="opacity-50">{t.k}</span>
              <span style={{ color: ACCENT }}>{t.v}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ─── SkillNode — radial ring item ─────────────────────────────────────── */
function SkillNode({ skill, glowing, size = 72 }: { skill: Skill; glowing: boolean; size?: number }) {
  const strokeW = 2.5;
  const r       = (size - strokeW * 2) / 2;
  const circ    = 2 * Math.PI * r;
  const dash    = (Math.min(100, Math.max(0, skill.proficiency)) / 100) * circ;
  const cx      = size / 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Ring + icon */}
      <div style={{ position: "relative", width: size, height: size }}>

        {/* SVG proficiency arc */}
        <svg
          width={size}
          height={size}
          style={{
            position: "absolute",
            inset: 0,
            transform: "rotate(-90deg)",
            filter: glowing
              ? `drop-shadow(0 0 5px ${ACCENT}) drop-shadow(0 0 10px ${ACCENT}99)`
              : "none",
            transition: "filter 0.25s",
          }}
        >
          {/* track */}
          <circle cx={cx} cy={cx} r={r} fill="none" stroke={`${INK}12`} strokeWidth={strokeW} />
          {/* filled arc */}
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke={glowing ? ACCENT : `${ACCENT}60`}
            strokeWidth={strokeW}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="round"
            style={{ transition: "stroke 0.25s" }}
          />
        </svg>

        {/* Inner circle */}
        <div
          style={{
            position: "absolute",
            inset: 9,
            borderRadius: "50%",
            border: `1.5px solid ${glowing ? ACCENT : `${INK}22`}`,
            background: glowing ? `${ACCENT}14` : BG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "border-color 0.25s, background 0.25s",
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: 11,
              color: glowing ? ACCENT : INK,
              letterSpacing: "-0.01em",
              transition: "color 0.25s",
            }}
          >
            {abbr(skill.name)}
          </span>
        </div>
      </div>

      {/* Label */}
      <div
        style={{
          marginTop: 6,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 8,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: glowing ? ACCENT : INK,
          opacity: glowing ? 1 : 0.45,
          textAlign: "center",
          maxWidth: 76,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          transition: "color 0.25s, opacity 0.25s",
        }}
      >
        {short(skill.name)}
      </div>
    </div>
  );
}

/* ─── MiniNode — right panel background icons ───────────────────────────── */
function MiniNode({ skill, isActive, transitioning }: { skill: Skill; isActive: boolean; transitioning: boolean }) {
  const size    = 52;
  const strokeW = 1.8;
  const r       = (size - strokeW * 2) / 2;
  const circ    = 2 * Math.PI * r;
  const dash    = isActive ? (skill.proficiency / 100) * circ : 0;
  const cx      = size / 2;

  return (
    <div
      title={`${skill.name} — ${skill.proficiency}%`}
      style={{
        margin: 11,
        opacity: transitioning ? 0.1 : isActive ? 0.88 : 0.1,
        filter: isActive && !transitioning ? `drop-shadow(0 0 5px ${ACCENT}77)` : "none",
        transition: "opacity 0.5s cubic-bezier(0.4,0,0.2,1), filter 0.5s cubic-bezier(0.4,0,0.2,1)",
        flexShrink: 0,
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          width={size}
          height={size}
          style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}
        >
          <circle cx={cx} cy={cx} r={r} fill="none" stroke={`${INK}15`} strokeWidth={strokeW} />
          {isActive && (
            <circle
              cx={cx}
              cy={cx}
              r={r}
              fill="none"
              stroke={ACCENT}
              strokeWidth={strokeW}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeLinecap="round"
            />
          )}
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 6,
            borderRadius: "50%",
            border: `1px solid ${isActive ? ACCENT : INK}25`,
            background: BG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: 9,
              color: isActive ? ACCENT : INK,
            }}
          >
            {abbr(skill.name)}
          </span>
        </div>
      </div>
    </div>
  );
}

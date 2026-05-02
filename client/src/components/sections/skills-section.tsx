import { useState, useEffect } from "react";
import type { Skill } from "@shared";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

const BG     = "#0A0A0A";
const INK    = "#F2EFE6";
const ACCENT = "#FF3D00";

/* ── abbreviation map ──────────────────────────────────────────────────── */
const ABBR: Record<string, string> = {
  "React":"RE","TypeScript":"TS","JavaScript":"JS","Three.js":"3J",
  "Node.js":"NJ","Next.js":"NX","PostgreSQL":"PG","GraphQL":"GQ",
  "Vue.js":"VU","Angular":"NG","Tailwind":"TW","Framer":"FM",
  "Express":"EX","Redis":"RD","Docker":"DK","Figma":"FG",
  "Blender":"BL","WebGL":"GL","CSS":"CS","Git":"GT","VS Code":"VS",
  "Prisma":"PR","MongoDB":"MG","MySQL":"MY","Rust":"RS","Go":"GO",
  "Python":"PY","Swift":"SW","Kotlin":"KT","Flutter":"FL",
  "AWS":"AW","GCP":"GC","Azure":"AZ","Linux":"LX",
  "GSAP":"GS","Svelte":"SV","Astro":"AS","Vite":"VI",
};

function abbr(name: string) {
  if (ABBR[name]) return ABBR[name];
  const w = name.split(/[\s\/\.\-]+/).filter(Boolean);
  return w.length >= 2
    ? (w[0][0] + w[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

/* ── fallback skills ───────────────────────────────────────────────────── */
const FALLBACK: Skill[] = [
  {id:"f1",name:"React",     category:"Frontend",   proficiency:95,icon:null,order:0},
  {id:"f2",name:"TypeScript",category:"Frontend",   proficiency:92,icon:null,order:1},
  {id:"f3",name:"Three.js",  category:"Frontend",   proficiency:85,icon:null,order:2},
  {id:"f4",name:"Tailwind",  category:"Frontend",   proficiency:90,icon:null,order:3},
  {id:"f5",name:"Next.js",   category:"Frontend",   proficiency:88,icon:null,order:4},
  {id:"f6",name:"Framer",    category:"Frontend",   proficiency:80,icon:null,order:5},
  {id:"f7",name:"CSS",       category:"Frontend",   proficiency:93,icon:null,order:6},
  {id:"f8",name:"Vite",      category:"Frontend",   proficiency:87,icon:null,order:7},
  {id:"b1",name:"Node.js",   category:"Backend",    proficiency:88,icon:null,order:0},
  {id:"b2",name:"PostgreSQL",category:"Backend",    proficiency:82,icon:null,order:1},
  {id:"b3",name:"Redis",     category:"Backend",    proficiency:75,icon:null,order:2},
  {id:"b4",name:"Express",   category:"Backend",    proficiency:90,icon:null,order:3},
  {id:"b5",name:"GraphQL",   category:"Backend",    proficiency:78,icon:null,order:4},
  {id:"b6",name:"Docker",    category:"Backend",    proficiency:72,icon:null,order:5},
  {id:"b7",name:"MongoDB",   category:"Backend",    proficiency:76,icon:null,order:6},
  {id:"b8",name:"Prisma",    category:"Backend",    proficiency:83,icon:null,order:7},
  {id:"g1",name:"WebGL",     category:"3D/Graphics",proficiency:80,icon:null,order:0},
  {id:"g2",name:"Blender",   category:"3D/Graphics",proficiency:70,icon:null,order:1},
  {id:"g3",name:"GSAP",      category:"3D/Graphics",proficiency:83,icon:null,order:2},
  {id:"g4",name:"Three.js",  category:"3D/Graphics",proficiency:85,icon:null,order:3},
  {id:"t1",name:"Git",       category:"Tools",      proficiency:95,icon:null,order:0},
  {id:"t2",name:"Figma",     category:"Tools",      proficiency:88,icon:null,order:1},
  {id:"t3",name:"VS Code",   category:"Tools",      proficiency:98,icon:null,order:2},
  {id:"t4",name:"Linux",     category:"Tools",      proficiency:82,icon:null,order:3},
];

/* ─────────────────────────────────────────────────────────────────────── */

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
      setTimeout(() => { setCatIdx(i => (i + 1) % cats.length); setFading(false); }, 380);
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

        {/* ── Category banner ── */}
        <div
          className="mt-10 flex items-center justify-between"
          style={{ border: `2px solid ${INK}`, padding: "14px 20px" }}
        >
          {/* Left: active category name */}
          <div className="flex items-center gap-4">
            <span
              className="inline-block h-2.5 w-2.5 brut-blink"
              style={{ background: ACCENT, borderRadius: 1 }}
              aria-hidden
            />
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.4rem, 3.5vw, 2.6rem)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                opacity: fading ? 0 : 1,
                transform: fading ? "translateY(6px)" : "translateY(0)",
                transition: "opacity 0.38s cubic-bezier(0.4,0,0.2,1), transform 0.38s",
              }}
            >
              {activeCat || "LOADING…"}
            </div>
            <span
              className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-40"
              style={{ marginLeft: 4 }}
            >
              {String(catIdx + 1).padStart(2,"0")}/{String(cats.length).padStart(2,"0")}
            </span>
          </div>

          {/* Right: dot selector + avg */}
          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] opacity-50 sm:inline">
              AVG <span style={{ color: ACCENT }}>{avgProf}%</span>
            </span>
            <div className="flex items-center gap-1.5">
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
        </div>

        {/* ── Full-width icon field ── */}
        <div
          style={{
            border: `2px solid ${INK}`,
            borderTop: "none",
            padding: "28px 20px",
            display: "flex",
            flexWrap: "wrap",
            gap: "12px 8px",
            justifyContent: "flex-start",
            alignContent: "flex-start",
            minHeight: 360,
          }}
        >
          {source.length === 0 ? (
            <div className="w-full py-16 text-center font-mono text-[11px] uppercase tracking-[0.3em] opacity-30">
              LOADING STACK…
            </div>
          ) : (
            source.map((skill) => (
              <SkillNode
                key={skill.id}
                skill={skill}
                active={skill.category === activeCat}
                fading={fading}
              />
            ))
          )}
        </div>

        {/* ── Telemetry strip ── */}
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

/* ─── SkillNode ─────────────────────────────────────────────────────────── */

function SkillNode({
  skill, active, fading,
}: { skill: Skill; active: boolean; fading: boolean }) {
  const size    = 80;
  const strokeW = 2.5;
  const r       = (size - strokeW * 2) / 2;
  const circ    = 2 * Math.PI * r;
  const prof    = Math.min(100, Math.max(0, skill.proficiency));
  const dash    = (prof / 100) * circ;
  const cx      = size / 2;

  /* glow when active and not in the middle of a transition */
  const glowing = active && !fading;

  return (
    <div
      title={`${skill.name} — ${prof}%`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        opacity: fading ? 0.08 : active ? 1 : 0.12,
        filter: glowing
          ? `drop-shadow(0 0 6px ${ACCENT}) drop-shadow(0 0 14px ${ACCENT}66)`
          : "none",
        transition: "opacity 0.45s cubic-bezier(0.4,0,0.2,1), filter 0.45s cubic-bezier(0.4,0,0.2,1)",
        flexShrink: 0,
      }}
    >
      {/* Ring + icon */}
      <div style={{ position: "relative", width: size, height: size }}>

        {/* SVG proficiency arc */}
        <svg
          width={size}
          height={size}
          style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}
        >
          {/* track */}
          <circle
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke={`${INK}14`}
            strokeWidth={strokeW}
          />
          {/* filled arc */}
          <circle
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke={active ? ACCENT : `${INK}30`}
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
            border: `1.5px solid ${active ? ACCENT : `${INK}20`}`,
            background: active ? `${ACCENT}10` : BG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "border-color 0.45s, background 0.45s",
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: 13,
              color: active ? ACCENT : INK,
              letterSpacing: "-0.01em",
              transition: "color 0.45s",
            }}
          >
            {abbr(skill.name)}
          </span>
        </div>
      </div>

      {/* Name label */}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 8,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: active ? ACCENT : INK,
          textAlign: "center",
          maxWidth: 72,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          transition: "color 0.45s",
        }}
      >
        {skill.name.split(/\s+/)[0].slice(0, 8)}
      </div>
    </div>
  );
}

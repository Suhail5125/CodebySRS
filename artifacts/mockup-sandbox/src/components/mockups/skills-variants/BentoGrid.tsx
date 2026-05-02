import { useState } from "react";

const BG = "#0A0A0A";
const INK = "#F2EFE6";
const ACCENT = "#FF3D00";

const SKILLS = [
  { name: "React", category: "Frontend", proficiency: 95 },
  { name: "TypeScript", category: "Frontend", proficiency: 90 },
  { name: "Next.js", category: "Frontend", proficiency: 88 },
  { name: "Tailwind CSS", category: "Frontend", proficiency: 93 },
  { name: "Three.js", category: "Frontend", proficiency: 72 },
  { name: "Node.js", category: "Backend", proficiency: 85 },
  { name: "PostgreSQL", category: "Backend", proficiency: 80 },
  { name: "GraphQL", category: "Backend", proficiency: 75 },
  { name: "REST APIs", category: "Backend", proficiency: 92 },
  { name: "Redis", category: "Backend", proficiency: 68 },
  { name: "WebGL", category: "3D / Graphics", proficiency: 70 },
  { name: "Blender", category: "3D / Graphics", proficiency: 65 },
  { name: "GSAP", category: "3D / Graphics", proficiency: 82 },
  { name: "Framer Motion", category: "3D / Graphics", proficiency: 88 },
  { name: "Figma", category: "Tools", proficiency: 90 },
  { name: "Git", category: "Tools", proficiency: 95 },
  { name: "Docker", category: "Tools", proficiency: 72 },
  { name: "Vite", category: "Tools", proficiency: 85 },
];

const CATEGORIES = ["Frontend", "Backend", "3D / Graphics", "Tools"];

function ProficiencyArc({ pct, size = 56 }: { pct: number; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(242,239,230,0.12)" strokeWidth={3} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={ACCENT} strokeWidth={3}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="butt"
      />
    </svg>
  );
}

export function BentoGrid() {
  const [active, setActive] = useState("Frontend");
  const [hovered, setHovered] = useState<string | null>(null);
  const list = SKILLS.filter((s) => s.category === active).sort((a, b) => b.proficiency - a.proficiency);
  const [hero, ...rest] = list;

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: BG, color: INK, fontFamily: "Inter, sans-serif" }}
    >
      {/* header */}
      <div
        className="flex items-center justify-between px-8 py-5"
        style={{ borderBottom: `2px solid ${INK}` }}
      >
        <div>
          <div
            className="text-[10px] uppercase tracking-[0.3em] opacity-50"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            // CAPABILITY MATRIX
          </div>
          <div style={{ fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", lineHeight: 1, marginTop: 4 }}>
            STACK INVENTORY
          </div>
        </div>
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, textAlign: "right" }}>
          <div style={{ color: ACCENT }} className="uppercase tracking-[0.2em]">03 / SKILLS</div>
          <div className="mt-1 uppercase tracking-[0.15em] opacity-50">{SKILLS.length} TECHNOLOGIES</div>
        </div>
      </div>

      {/* category tabs */}
      <div className="flex" style={{ borderBottom: `2px solid ${INK}` }}>
        {CATEGORIES.map((cat, i) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="flex-1 px-4 py-3"
              style={{
                background: isActive ? INK : "transparent",
                color: isActive ? BG : INK,
                borderRight: i < CATEGORIES.length - 1 ? `2px solid ${INK}` : "none",
                transition: "none",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.22em",
              }}
            >
              <span style={{ color: isActive ? ACCENT : ACCENT, marginRight: 6 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {cat}
            </button>
          );
        })}
      </div>

      {/* bento grid */}
      <div className="flex-1 p-5" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gridAutoRows: "64px", gap: 8 }}>
        {/* hero block — highest proficiency, spans 5×5 */}
        {hero && (
          <div
            onMouseEnter={() => setHovered(hero.name)}
            onMouseLeave={() => setHovered(null)}
            style={{
              gridColumn: "span 5",
              gridRow: "span 5",
              border: `2px solid ${INK}`,
              background: hovered === hero.name ? ACCENT : "transparent",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "none",
              cursor: "default",
            }}
          >
            <div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.22em", color: hovered === hero.name ? BG : INK }}>
                01 / TOP SKILL
              </div>
              <div style={{ fontWeight: 800, fontSize: 42, letterSpacing: "-0.03em", lineHeight: 0.95, textTransform: "uppercase", marginTop: 12, color: hovered === hero.name ? BG : INK }}>
                {hero.name}
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 64, lineHeight: 1, letterSpacing: "-0.04em", color: hovered === hero.name ? BG : ACCENT }}>
                  {hero.proficiency}
                </div>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 18, opacity: 0.6, paddingBottom: 8, color: hovered === hero.name ? BG : INK }}>%</div>
              </div>
              <div style={{ height: 3, background: "rgba(242,239,230,0.15)", marginTop: 8 }}>
                <div style={{ height: "100%", width: `${hero.proficiency}%`, background: hovered === hero.name ? BG : ACCENT }} />
              </div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, opacity: 0.45, textTransform: "uppercase", letterSpacing: "0.2em", marginTop: 6, color: hovered === hero.name ? BG : INK }}>
                PROFICIENCY
              </div>
            </div>
          </div>
        )}

        {/* remaining skills — variable sizing based on proficiency */}
        {rest.map((skill, i) => {
          const big = skill.proficiency >= 85;
          const col = big ? 4 : 3;
          const row = big ? 3 : 2;
          const isHov = hovered === skill.name;
          return (
            <div
              key={skill.name}
              onMouseEnter={() => setHovered(skill.name)}
              onMouseLeave={() => setHovered(null)}
              style={{
                gridColumn: `span ${col}`,
                gridRow: `span ${row}`,
                border: `2px solid ${INK}`,
                background: isHov ? ACCENT : "transparent",
                padding: 16,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "none",
                cursor: "default",
                overflow: "hidden",
              }}
            >
              <div>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, opacity: 0.45, textTransform: "uppercase", letterSpacing: "0.2em", color: isHov ? BG : INK }}>
                  {String(i + 2).padStart(2, "0")}
                </div>
                <div style={{ fontWeight: 800, fontSize: big ? 20 : 15, letterSpacing: "-0.02em", lineHeight: 1.05, textTransform: "uppercase", marginTop: 6, color: isHov ? BG : INK }}>
                  {skill.name}
                </div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <ProficiencyArc pct={skill.proficiency} size={big ? 48 : 36} />
                  <div style={{ fontWeight: 800, fontSize: big ? 22 : 16, color: isHov ? BG : ACCENT, letterSpacing: "-0.02em" }}>
                    {skill.proficiency}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* bottom strip */}
      <div
        className="grid grid-cols-3"
        style={{ borderTop: `2px solid ${INK}`, fontFamily: "JetBrains Mono, monospace", fontSize: 10 }}
      >
        {[
          { k: "ACTIVE_CAT", v: active.toUpperCase() },
          { k: "ITEMS", v: String(list.length).padStart(2, "0") },
          { k: "AVG_LVL", v: `${Math.round(list.reduce((a, s) => a + s.proficiency, 0) / list.length)}%` },
        ].map((t, i) => (
          <div
            key={t.k}
            className="flex items-center justify-between px-5 py-3 uppercase tracking-[0.18em]"
            style={{ borderRight: i < 2 ? `2px solid ${INK}` : "none" }}
          >
            <span className="opacity-50">{t.k}</span>
            <span style={{ color: ACCENT }}>{t.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

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

export function DiagnosticRows() {
  const [active, setActive] = useState("Frontend");
  const [hovered, setHovered] = useState<number | null>(null);
  const list = SKILLS.filter((s) => s.category === active);
  const avg = Math.round(list.reduce((a, s) => a + s.proficiency, 0) / list.length);

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: BG, color: INK, fontFamily: "'Inter', sans-serif" }}
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
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: 28,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              marginTop: 4,
            }}
          >
            STACK INVENTORY
          </div>
        </div>
        <div
          className="text-right"
          style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11 }}
        >
          <div style={{ color: ACCENT }} className="uppercase tracking-[0.2em]">
            03 / SKILLS
          </div>
          <div className="mt-1 uppercase tracking-[0.15em] opacity-50">
            {SKILLS.length} TECHNOLOGIES
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* left — category sidebar */}
        <div
          className="flex w-[220px] shrink-0 flex-col"
          style={{ borderRight: `2px solid ${INK}` }}
        >
          <div
            className="px-5 py-3 text-[9px] uppercase tracking-[0.28em] opacity-40"
            style={{ fontFamily: "JetBrains Mono, monospace", borderBottom: `1px solid rgba(242,239,230,0.12)` }}
          >
            CATEGORY
          </div>
          {CATEGORIES.map((cat, i) => {
            const isActive = cat === active;
            const count = SKILLS.filter((s) => s.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="flex items-center justify-between px-5 py-4 text-left"
                style={{
                  background: isActive ? ACCENT : "transparent",
                  color: isActive ? BG : INK,
                  borderBottom: `1px solid rgba(242,239,230,0.12)`,
                  transition: "none",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                <div>
                  <div className="text-[9px] uppercase tracking-[0.22em] opacity-60 mb-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.18em] font-bold">
                    {cat}
                  </div>
                </div>
                <div
                  className="text-[18px] font-black tabular-nums"
                  style={{ opacity: isActive ? 0.6 : 0.3, fontFamily: "Inter, sans-serif" }}
                >
                  {count}
                </div>
              </button>
            );
          })}

          {/* sidebar bottom telemetry */}
          <div className="mt-auto" style={{ borderTop: `2px solid ${INK}` }}>
            <div className="px-5 py-4">
              <div
                className="text-[9px] uppercase tracking-[0.22em] opacity-40 mb-1"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                AVG PROFICIENCY
              </div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 800,
                  fontSize: 36,
                  lineHeight: 1,
                  color: ACCENT,
                  letterSpacing: "-0.03em",
                }}
              >
                {avg}
                <span style={{ fontSize: 16 }}>%</span>
              </div>
              {/* mini bar */}
              <div
                className="mt-2 h-1 w-full"
                style={{ background: "rgba(242,239,230,0.12)" }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${avg}%`,
                    background: ACCENT,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* right — skill rows */}
        <div className="flex flex-1 flex-col">
          {list.map((skill, i) => {
            const isHov = hovered === i;
            return (
              <div
                key={skill.name}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="relative flex flex-1 items-center overflow-hidden"
                style={{
                  borderBottom: i < list.length - 1 ? `1px solid rgba(242,239,230,0.1)` : "none",
                  minHeight: 56,
                }}
              >
                {/* proficiency fill */}
                <div
                  className="absolute inset-y-0 left-0"
                  style={{
                    width: `${skill.proficiency}%`,
                    background: isHov ? ACCENT : "rgba(242,239,230,0.06)",
                    transition: "none",
                  }}
                />
                {/* content */}
                <div className="relative flex w-full items-center px-6">
                  <span
                    className="mr-5 shrink-0 tabular-nums"
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 10,
                      opacity: 0.4,
                      color: isHov ? BG : INK,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="flex-1"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 800,
                      fontSize: 22,
                      letterSpacing: "-0.025em",
                      textTransform: "uppercase",
                      color: isHov ? BG : INK,
                    }}
                  >
                    {skill.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 13,
                      fontWeight: 700,
                      color: isHov ? BG : ACCENT,
                      opacity: isHov ? 0.8 : 1,
                    }}
                  >
                    {skill.proficiency}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* bottom strip */}
      <div
        className="grid grid-cols-3"
        style={{
          borderTop: `2px solid ${INK}`,
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 10,
        }}
      >
        {[
          { k: "ACTIVE_CAT", v: active.toUpperCase() },
          { k: "ITEMS", v: String(list.length).padStart(2, "0") },
          { k: "STATUS", v: "OPERATIONAL" },
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

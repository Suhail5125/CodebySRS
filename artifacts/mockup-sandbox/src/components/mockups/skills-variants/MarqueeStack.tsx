import { useState, useEffect } from "react";

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

function Marquee({ items }: { items: string[] }) {
  const content = items.map((item, i) => (
    <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 32 }}>
      <span>{item.toUpperCase()}</span>
      <span style={{ color: ACCENT, fontSize: "0.6em" }}>◆</span>
    </span>
  ));
  return (
    <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
      <div
        style={{
          display: "inline-flex",
          animation: "marquee-scroll 18s linear infinite",
          fontFamily: "Inter, sans-serif",
          fontWeight: 800,
          fontSize: 13,
          letterSpacing: "0.12em",
          gap: 32,
        }}
      >
        <span style={{ display: "inline-flex", gap: 32, paddingRight: 32 }}>{content}</span>
        <span aria-hidden style={{ display: "inline-flex", gap: 32, paddingRight: 32 }}>{content}</span>
      </div>
    </div>
  );
}

export function MarqueeStack() {
  const [active, setActive] = useState("Frontend");
  const [focused, setFocused] = useState(0);
  const list = SKILLS.filter((s) => s.category === active).sort((a, b) => b.proficiency - a.proficiency);
  const skill = list[focused] ?? list[0];

  useEffect(() => { setFocused(0); }, [active]);

  const size = 140;
  const r = 58;
  const circ = 2 * Math.PI * r;
  const dash = skill ? (skill.proficiency / 100) * circ : 0;

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: BG, color: INK, fontFamily: "Inter, sans-serif" }}
    >
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      {/* top marquee strip */}
      <div
        style={{
          borderBottom: `2px solid ${INK}`,
          paddingTop: 10,
          paddingBottom: 10,
          opacity: 0.35,
        }}
      >
        <Marquee items={SKILLS.map((s) => s.name)} />
      </div>

      {/* header */}
      <div
        className="flex items-center justify-between px-8 py-4"
        style={{ borderBottom: `2px solid ${INK}` }}
      >
        <div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.3em" }}>
            // CAPABILITY MATRIX
          </div>
          <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: "-0.03em", lineHeight: 1, marginTop: 3 }}>
            STACK INVENTORY
          </div>
        </div>
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, textAlign: "right" }}>
          <div style={{ color: ACCENT, textTransform: "uppercase", letterSpacing: "0.2em" }}>03 / SKILLS</div>
          <div style={{ opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 2 }}>{SKILLS.length} TECHNOLOGIES</div>
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
                background: isActive ? ACCENT : "transparent",
                color: isActive ? BG : INK,
                borderRight: i < CATEGORIES.length - 1 ? `2px solid ${INK}` : "none",
                transition: "none",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.22em",
              }}
            >
              <span style={{ marginRight: 6, opacity: isActive ? 0.6 : 1, color: isActive ? BG : ACCENT }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {cat}
            </button>
          );
        })}
      </div>

      {/* main body: dial + list */}
      <div className="flex flex-1">
        {/* left — big dial + featured skill */}
        <div
          className="flex w-[340px] shrink-0 flex-col items-center justify-center"
          style={{ borderRight: `2px solid ${INK}`, padding: 32 }}
        >
          {skill && (
            <>
              {/* circular arc */}
              <div style={{ position: "relative", width: size * 1.4, height: size * 1.4 }}>
                <svg
                  width={size * 1.4}
                  height={size * 1.4}
                  style={{ transform: "rotate(-90deg)" }}
                >
                  <circle
                    cx={size * 0.7} cy={size * 0.7} r={r + 12}
                    fill="none" stroke="rgba(242,239,230,0.07)" strokeWidth={2}
                  />
                  <circle
                    cx={size * 0.7} cy={size * 0.7} r={r}
                    fill="none" stroke="rgba(242,239,230,0.08)" strokeWidth={20}
                  />
                  <circle
                    cx={size * 0.7} cy={size * 0.7} r={r}
                    fill="none" stroke={ACCENT} strokeWidth={20}
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="butt"
                  />
                </svg>
                {/* center content */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 52, lineHeight: 1, letterSpacing: "-0.04em", color: ACCENT }}>
                    {skill.proficiency}
                  </div>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.2em", marginTop: 2 }}>
                    %
                  </div>
                </div>
              </div>

              {/* skill name */}
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.25em" }}>
                  {String(focused + 1).padStart(2, "0")} / {active.toUpperCase()}
                </div>
                <div style={{ fontWeight: 800, fontSize: 28, letterSpacing: "-0.025em", textTransform: "uppercase", lineHeight: 1.05, marginTop: 6 }}>
                  {skill.name}
                </div>
              </div>
            </>
          )}
        </div>

        {/* right — skill stack */}
        <div className="flex flex-1 flex-col">
          {list.map((s, i) => {
            const isFocused = i === focused;
            return (
              <button
                key={s.name}
                onClick={() => setFocused(i)}
                className="flex items-center gap-4 px-6 text-left"
                style={{
                  background: isFocused ? "rgba(242,239,230,0.05)" : "transparent",
                  borderBottom: `1px solid rgba(242,239,230,0.09)`,
                  borderLeft: isFocused ? `3px solid ${ACCENT}` : "3px solid transparent",
                  minHeight: 58,
                  transition: "none",
                  flex: 1,
                }}
              >
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, opacity: 0.35, minWidth: 22, color: INK }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em", textTransform: "uppercase", flex: 1, color: isFocused ? INK : INK, opacity: isFocused ? 1 : 0.65 }}>
                  {s.name}
                </span>
                {/* inline mini bar */}
                <div style={{ width: 80, height: 3, background: "rgba(242,239,230,0.1)", flexShrink: 0 }}>
                  <div style={{ height: "100%", width: `${s.proficiency}%`, background: isFocused ? ACCENT : "rgba(242,239,230,0.3)" }} />
                </div>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: isFocused ? ACCENT : "rgba(242,239,230,0.4)", minWidth: 36, textAlign: "right" }}>
                  {s.proficiency}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* bottom strip */}
      <div
        className="grid grid-cols-3"
        style={{ borderTop: `2px solid ${INK}`, fontFamily: "JetBrains Mono, monospace", fontSize: 10 }}
      >
        {[
          { k: "ACTIVE_CAT", v: active.toUpperCase() },
          { k: "FOCUSED", v: skill?.name.toUpperCase() ?? "—" },
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

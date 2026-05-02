import { useState, useEffect } from "react";
import type { Skill } from "@shared";
import { Reveal, useReveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

const BG = "#0A0A0A";
const INK = "#F2EFE6";
const ACCENT = "#FF3D00";

interface SkillsSectionProps {
  skills: Skill[];
  isLoading: boolean;
}

export function SkillsSection({ skills, isLoading }: SkillsSectionProps) {
  const grouped = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, Skill[]>);

  const fallback = ["Frontend", "Backend", "3D/Graphics", "Tools"];
  const categories = Object.keys(grouped).length > 0 ? Object.keys(grouped) : fallback;
  const [active, setActive] = useState(categories[0] || "Frontend");

  useEffect(() => {
    if (!categories.includes(active) && categories.length) setActive(categories[0]);
  }, [categories, active]);

  const list = grouped[active] || [];

  return (
    <section
      id="skills"
      className="snap-screen relative flex min-h-screen flex-col justify-center px-6 py-20 lg:px-10"
      style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <Reveal>
          <SectionHeader
            num="03"
            name="SKILLS"
            kicker="// CAPABILITY MATRIX"
            headline="STACK INVENTORY"
            right={`${skills.length} TECHNOLOGIES`}
            variant="right"
          />
        </Reveal>

        <Reveal delay={160}>
        {/* Category tabs */}
        <div
          className="mt-10 flex flex-wrap gap-0"
          style={{ border: `2px solid ${INK}` }}
        >
          {categories.map((cat, i) => {
            const isActive = cat === active;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="flex-1 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.22em]"
                style={{
                  background: isActive ? INK : "transparent",
                  color: isActive ? BG : INK,
                  borderRight: i < categories.length - 1 ? `2px solid ${INK}` : "none",
                  transition: "none",
                  minWidth: "20%",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = ACCENT;
                    e.currentTarget.style.color = BG;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = INK;
                  }
                }}
              >
                <span style={{ color: isActive ? BG : ACCENT, marginRight: 8 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {cat}
              </button>
            );
          })}
        </div>

        {/* Skills grid */}
        <div
          className="grid grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-3"
          style={{ border: `2px solid ${INK}`, borderTop: "none" }}
        >
          {isLoading ? (
            <div className="col-span-full px-6 py-12 text-center font-mono text-[11px] uppercase tracking-[0.2em] opacity-60">
              LOADING SKILLS…
            </div>
          ) : list.length === 0 ? (
            <div className="col-span-full px-6 py-12 text-center font-mono text-[11px] uppercase tracking-[0.2em] opacity-60">
              NO ENTRIES IN /{active}
            </div>
          ) : (
            list.map((skill, i) => <SkillRow key={skill.id ?? i} skill={skill} index={i} />)
          )}
        </div>

        {/* Telemetry strip */}
        <div
          className="grid grid-cols-2 gap-0 font-mono text-[11px] uppercase tracking-[0.2em] md:grid-cols-4"
          style={{ border: `2px solid ${INK}`, borderTop: "none" }}
        >
          {[
            { k: "ACTIVE_CAT", v: active },
            { k: "ITEMS", v: String(list.length).padStart(2, "0") },
            { k: "AVG_LVL", v: list.length ? `${Math.round(list.reduce((a, s) => a + (s.proficiency ?? 0), 0) / list.length)}%` : "—" },
            { k: "STATUS", v: "OPERATIONAL" },
          ].map((t, i) => (
            <div
              key={t.k}
              className="flex items-center justify-between px-4 py-3"
              style={{
                borderRight: i < 3 ? `2px solid ${INK}` : "none",
              }}
            >
              <span className="opacity-60">{t.k}</span>
              <span style={{ color: ACCENT }}>{t.v}</span>
            </div>
          ))}
        </div>
        </Reveal>
      </div>
    </section>
  );
}

function SkillRow({ skill, index }: { skill: Skill; index: number }) {
  const [hover, setHover] = useState(false);
  const { ref, style: revealStyle } = useReveal({ delay: index * 60, variant: "slide-right" });
  const prof = skill.proficiency ?? 0;
  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative px-5 py-5"
      style={{
        background: hover ? INK : "transparent",
        color: hover ? BG : INK,
        borderRight: `2px solid ${INK}`,
        borderBottom: `2px solid ${INK}`,
        transition: "none",
        ...revealStyle,
      }}
    >
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
        <span style={{ color: hover ? ACCENT : ACCENT }}>{num}</span>
        <span style={{ opacity: hover ? 0.6 : 0.5 }}>{skill.category}</span>
      </div>
      <div
        className="mb-3"
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 800,
          fontSize: "20px",
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
        }}
      >
        {skill.name}
      </div>
      {/* Proficiency bar */}
      <div
        className="relative h-2 w-full"
        style={{ background: hover ? "rgba(10,10,10,0.15)" : "rgba(242,239,230,0.15)" }}
      >
        <div
          className="absolute left-0 top-0 h-full"
          style={{
            width: `${Math.min(100, Math.max(0, prof))}%`,
            background: hover ? BG : ACCENT,
            transition: "none",
          }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
        <span style={{ opacity: hover ? 0.7 : 0.55 }}>PROFICIENCY</span>
        <span className="font-bold">{prof}%</span>
      </div>
    </div>
  );
}


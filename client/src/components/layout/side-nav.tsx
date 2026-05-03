import { useEffect, useState } from "react";

const INK    = "#F2EFE6";
const BG     = "#0A0A0A";
const ACCENT = "#FF3D00";

const SECTIONS = [
  { id: "projects",     num: "02", label: "PROJECTS"     },
  { id: "skills",       num: "03", label: "SKILLS"        },
  { id: "services",     num: "04", label: "SERVICES"      },
  { id: "process",      num: "05", label: "PROCESS"       },
  { id: "about",        num: "06", label: "ABOUT"         },
  { id: "testimonials", num: "07", label: "TESTIMONIALS"  },
  { id: "contact",      num: "08", label: "CONTACT"       },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function SideNav() {
  const [visible, setVisible]   = useState(false);
  const [active, setActive]     = useState<string>("");
  const [hovered, setHovered]   = useState<string | null>(null);

  /* Show side nav once hero scrolls out of view */
  useEffect(() => {
    const hero = document.getElementById("hero") ?? document.querySelector("section");
    if (!hero) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  /* Track active section */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.35 }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div
      aria-label="Section navigation"
      style={{
        position: "fixed",
        right: 0,
        top: "50%",
        transform: `translateY(-50%) translateX(${visible ? "0%" : "110%"})`,
        transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        borderLeft: `2px solid ${INK}`,
        background: BG,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* Top cap */}
      <div
        style={{
          height: 4,
          background: ACCENT,
          borderBottom: `2px solid ${INK}`,
        }}
      />

      {SECTIONS.map((s, i) => {
        const isActive  = active === s.id;
        const isHovered = hovered === s.id;
        const lit       = isActive || isHovered;

        return (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollTo(s.id)}
            onMouseEnter={() => setHovered(s.id)}
            onMouseLeave={() => setHovered(null)}
            aria-label={s.label}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 0,
              padding: 0,
              background: isActive ? ACCENT : "transparent",
              borderTop: i === 0 ? "none" : `1px solid ${INK}22`,
              cursor: "pointer",
              outline: "none",
              overflow: "hidden",
              height: 44,
              transition: "background 0s",
            }}
          >
            {/* Label — slides in on hover */}
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: isActive ? BG : INK,
                whiteSpace: "nowrap",
                padding: "0 12px",
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "translateX(0)" : "translateX(8px)",
                transition: "opacity 0.22s ease, transform 0.22s ease",
                pointerEvents: "none",
              }}
            >
              {s.label}
            </span>

            {/* Number pill */}
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: isActive ? BG : lit ? ACCENT : `${INK}88`,
                borderLeft: `2px solid ${INK}22`,
                flexShrink: 0,
              }}
            >
              {s.num}
            </span>

            {/* Active left accent bar */}
            {isActive && (
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 3,
                  background: BG,
                }}
              />
            )}
          </button>
        );
      })}

      {/* Bottom cap */}
      <div
        style={{
          height: 4,
          background: ACCENT,
          borderTop: `2px solid ${INK}`,
        }}
      />
    </div>
  );
}

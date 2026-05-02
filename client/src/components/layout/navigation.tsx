import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Menu, X, ArrowUpRight } from "lucide-react";

/**
 * Brutalist top navigation — matches the hero language:
 * dark BG (#0A0A0A), cream INK (#F2EFE6), accent (#FF3D00),
 * hard 2-px border, JetBrains Mono / Inter type, no gradients,
 * instant or sharp animations only.
 *
 * Public testid contract preserved:
 *   link-home, link-projects, link-services, link-about, link-contact,
 *   button-lets-work-together, button-menu-toggle,
 *   link-mobile-{name} (lowercase).
 */

const INK = "#F2EFE6";
const BG = "#0A0A0A";
const ACCENT = "#FF3D00";

const NAV_ITEMS = [
  { name: "Projects", href: "#projects" },
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (href: string) => {
    if (!href.startsWith("#")) return;
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsOpen(false);
  };

  return (
    <nav
      className="relative z-50"
      style={{
        background: BG,
        color: INK,
        borderBottom: `2px solid ${INK}`,
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        boxShadow: scrolled ? `0 1px 0 0 ${ACCENT}` : "none",
        transition: "box-shadow 0.18s ease-out",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-4 lg:px-10">
        {/* ====== Logo: orange square + wordmark ====== */}
        <Link
          href="/"
          data-testid="link-home"
          aria-label="CodebySRS — Home"
          className="group inline-flex items-center gap-3 no-underline"
        >
          <span
            className="relative grid h-9 w-9 shrink-0 place-items-center text-[14px] font-bold leading-none transition-transform duration-200 ease-out group-hover:rotate-[-6deg]"
            style={{ background: ACCENT, color: BG }}
            aria-hidden
          >
            S
            {/* accent dot — pulses on hover */}
            <span
              className="absolute -right-1 -top-1 h-2 w-2"
              style={{ background: INK, border: `1px solid ${BG}` }}
            />
          </span>
          <span
            className="text-[13px] font-bold uppercase tracking-[0.2em]"
            style={{ color: INK }}
          >
            Codeby<span style={{ color: ACCENT }}>SRS</span>
            <span style={{ color: ACCENT }}>.</span>
          </span>
        </Link>

        {/* ====== Desktop nav ====== */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item, i) => (
            <NavLink
              key={item.name}
              label={item.name}
              index={i}
              onClick={() => scrollToSection(item.href)}
            />
          ))}

          <div className="mx-4 h-5 w-px" style={{ background: `${INK}55` }} aria-hidden />

          <CtaButton onClick={() => scrollToSection("#contact")} />
        </div>

        {/* ====== Mobile toggle ====== */}
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          data-testid="button-menu-toggle"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="grid h-10 w-10 place-items-center md:hidden"
          style={{
            background: isOpen ? INK : "transparent",
            color: isOpen ? BG : INK,
            border: `2px solid ${INK}`,
          }}
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* ====== Mobile menu ====== */}
      {isOpen && (
        <div
          className="md:hidden"
          style={{
            background: BG,
            borderTop: `1px solid ${INK}33`,
            borderBottom: `2px solid ${INK}`,
          }}
        >
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item, i) => (
              <li
                key={item.name}
                style={{
                  borderTop: i === 0 ? "none" : `1px solid ${INK}22`,
                }}
              >
                <button
                  type="button"
                  onClick={() => scrollToSection(item.href)}
                  data-testid={`link-mobile-${item.name.toLowerCase()}`}
                  className="flex w-full items-center justify-between px-6 py-4 text-left text-[12px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: INK }}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="tabular-nums"
                      style={{ color: `${INK}66` }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{item.name}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4" style={{ color: ACCENT }} />
                </button>
              </li>
            ))}
            <li style={{ borderTop: `1px solid ${INK}22` }}>
              <div className="px-6 py-4">
                <CtaButton onClick={() => scrollToSection("#contact")} fullWidth />
              </div>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

/* ============================================================
 * NavLink — brutalist hover: top tick + bottom underline that
 * sweeps in from the left, plus a [NN] section index prefix.
 * ============================================================ */
interface NavLinkProps {
  label: string;
  index: number;
  onClick: () => void;
}
function NavLink({ label, index, onClick }: NavLinkProps) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={`link-${label.toLowerCase()}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="group relative inline-flex items-center gap-2 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{ color: INK }}
    >
      {/* top tick — appears on hover */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-[2px]"
        style={{
          width: hover ? "100%" : "0%",
          background: ACCENT,
          transition: "width 0.22s cubic-bezier(0.2,0.8,0.2,1)",
        }}
      />
      <span
        className="tabular-nums"
        style={{ color: hover ? ACCENT : `${INK}55`, transition: "color 0.18s" }}
      >
        [{String(index + 1).padStart(2, "0")}]
      </span>
      <span style={{ position: "relative", display: "inline-block" }}>
        {label}
        {/* bottom underline — slides from left */}
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 h-[2px]"
          style={{
            width: hover ? "100%" : "0%",
            background: INK,
            transition: "width 0.24s cubic-bezier(0.2,0.8,0.2,1)",
          }}
        />
      </span>
    </button>
  );
}

/* ============================================================
 * CtaButton — brutalist primary with three layered hover effects:
 *   1. Accent block slides in from the bottom (color invert)
 *   2. Label "swap": current label rises out, duplicate rises in
 *   3. Arrow translates up-right and rotates
 * ============================================================ */
interface CtaButtonProps {
  onClick: () => void;
  fullWidth?: boolean;
}
function CtaButton({ onClick, fullWidth }: CtaButtonProps) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid="button-lets-work-together"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className={`group relative inline-flex items-center justify-center gap-3 overflow-hidden px-5 py-3 text-[11px] font-bold uppercase tracking-[0.22em] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] ${
        fullWidth ? "w-full" : ""
      }`}
      style={{
        background: INK,
        color: BG,
        border: `2px solid ${INK}`,
      }}
    >
      {/* accent block — sweeps up from bottom on hover */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0"
        style={{
          height: "100%",
          background: ACCENT,
          transform: hover ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.32s cubic-bezier(0.2,0.8,0.2,1)",
        }}
      />
      {/* label-swap stack — single fixed-height window, two stacked spans.
          Second span is decorative (mirror for the rise-in), hidden from
          assistive tech so the label is only announced once. */}
      <span
        className="relative inline-block overflow-hidden"
        style={{ height: "1em", lineHeight: "1em" }}
      >
        <span
          className="block"
          style={{
            transform: hover ? "translateY(-100%)" : "translateY(0%)",
            transition: "transform 0.28s cubic-bezier(0.2,0.8,0.2,1)",
            color: BG,
          }}
        >
          LET&apos;S WORK
        </span>
        <span
          aria-hidden="true"
          className="block"
          style={{
            transform: hover ? "translateY(-100%)" : "translateY(0%)",
            transition: "transform 0.28s 0.04s cubic-bezier(0.2,0.8,0.2,1)",
            color: BG,
          }}
        >
          LET&apos;S WORK
        </span>
      </span>
      <ArrowUpRight
        className="relative h-4 w-4"
        style={{
          color: BG,
          transform: hover
            ? "translate(2px,-2px) rotate(0deg)"
            : "translate(0,0) rotate(0deg)",
          transition: "transform 0.22s cubic-bezier(0.2,0.8,0.2,1)",
        }}
      />
    </button>
  );
}

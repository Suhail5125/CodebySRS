import type { CSSProperties } from "react";

const BG = "#0A0A0A";
const INK = "#F2EFE6";
const ACCENT = "#FF3D00";

const HEADLINE_BASE: CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontWeight: 800,
  fontSize: "clamp(40px, 7vw, 96px)",
  lineHeight: 0.92,
  letterSpacing: "-0.035em",
  textTransform: "uppercase",
};

export type SectionHeaderVariant =
  | "left"
  | "right"
  | "center"
  | "banner"
  | "split";

interface Props {
  num: string;
  name: string;
  kicker: string;
  headline: string;
  right?: string;
  variant?: SectionHeaderVariant;
}

/**
 * Brutalist section header with five layout variants, used to give each
 * page section a distinct visual rhythm while sharing the same
 * typographic system.
 */
export function SectionHeader({
  num,
  name,
  kicker,
  headline,
  right,
  variant = "left",
}: Props) {
  if (variant === "right") {
    return (
      <header className="grid grid-cols-12 gap-x-6">
        <div className="order-2 col-span-12 lg:order-1 lg:col-span-10">
          <div className="flex items-baseline justify-between gap-4">
            <span
              className="font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: ACCENT }}
            >
              {kicker}
            </span>
            {right && (
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-70">
                {right}
              </span>
            )}
          </div>
          <h2 className="mt-2 lg:text-right" style={HEADLINE_BASE}>
            {headline}
          </h2>
        </div>
        <aside className="order-1 col-span-12 mb-6 lg:order-2 lg:col-span-2 lg:mb-0 lg:text-right">
          <div
            className="font-mono text-[11px] uppercase tracking-[0.22em]"
            style={{ color: ACCENT }}
          >
            [ SECTION {num} ]
          </div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] opacity-70">
            / {name}
          </div>
          <div className="mt-3 h-[2px] w-12 lg:ml-auto" style={{ background: ACCENT }} />
        </aside>
      </header>
    );
  }

  if (variant === "center") {
    return (
      <header className="text-center">
        <div
          className="mx-auto mb-3 flex flex-wrap items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em]"
          style={{ color: ACCENT }}
        >
          <span>[ SECTION {num} ]</span>
          <span className="opacity-50">/</span>
          <span>{name}</span>
        </div>
        <h2 className="mx-auto" style={{ ...HEADLINE_BASE, fontSize: "clamp(44px, 8vw, 112px)" }}>
          {headline}
        </h2>
        <div className="mx-auto mt-4 flex flex-wrap items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em]">
          <span style={{ color: ACCENT }}>{kicker}</span>
          {right && (
            <>
              <span className="opacity-50">·</span>
              <span className="opacity-70">{right}</span>
            </>
          )}
        </div>
        <div className="mx-auto mt-4 h-[2px] w-16" style={{ background: ACCENT }} />
      </header>
    );
  }

  if (variant === "banner") {
    return (
      <header
        className="grid grid-cols-12 items-end gap-x-6 pb-5"
        style={{ borderBottom: `2px solid ${INK}` }}
      >
        <div
          className="col-span-3 lg:col-span-1"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(56px, 6vw, 88px)",
            lineHeight: 0.85,
            color: ACCENT,
            letterSpacing: "-0.04em",
          }}
        >
          {num}
        </div>
        <div className="col-span-9 lg:col-span-3">
          <div
            className="font-mono text-[11px] uppercase tracking-[0.22em]"
            style={{ color: ACCENT }}
          >
            [ SECTION ]
          </div>
          <div className="mt-1 font-mono text-[14px] font-bold uppercase tracking-[0.18em]">
            / {name}
          </div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] opacity-60">
            {kicker}
          </div>
        </div>
        <div className="col-span-12 mt-4 lg:col-span-8 lg:mt-0 lg:text-right">
          <h2 style={{ ...HEADLINE_BASE, fontSize: "clamp(36px, 6vw, 84px)" }}>{headline}</h2>
          {right && (
            <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] opacity-70">
              {right}
            </div>
          )}
        </div>
      </header>
    );
  }

  if (variant === "split") {
    return (
      <header className="grid grid-cols-12 gap-0" style={{ border: `2px solid ${INK}` }}>
        <div
          className="col-span-12 flex items-center justify-center px-6 py-8 lg:col-span-3"
          style={{ background: ACCENT, color: BG, borderRight: `2px solid ${INK}` }}
        >
          <div className="text-center">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em]">[ SECTION ]</div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(72px, 10vw, 144px)",
                lineHeight: 0.85,
                letterSpacing: "-0.05em",
              }}
            >
              {num}
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em]">/ {name}</div>
          </div>
        </div>
        <div className="col-span-12 flex flex-col justify-center px-6 py-8 lg:col-span-9">
          <div className="flex items-baseline justify-between gap-4">
            <span
              className="font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: ACCENT }}
            >
              {kicker}
            </span>
            {right && (
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-70">
                {right}
              </span>
            )}
          </div>
          <h2 className="mt-2" style={HEADLINE_BASE}>
            {headline}
          </h2>
        </div>
      </header>
    );
  }

  // default: "left"
  return (
    <header className="grid grid-cols-12 gap-x-6">
      <aside className="col-span-12 mb-6 lg:col-span-2 lg:mb-0">
        <div
          className="font-mono text-[11px] uppercase tracking-[0.22em]"
          style={{ color: ACCENT }}
        >
          [ SECTION {num} ]
        </div>
        <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] opacity-70">
          / {name}
        </div>
        <div className="mt-3 h-[2px] w-12" style={{ background: ACCENT }} />
      </aside>
      <div className="col-span-12 lg:col-span-10">
        <div className="flex items-baseline justify-between gap-4">
          <span
            className="font-mono text-[11px] uppercase tracking-[0.22em]"
            style={{ color: ACCENT }}
          >
            {kicker}
          </span>
          {right && (
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-70">
              {right}
            </span>
          )}
        </div>
        <h2 className="mt-2" style={HEADLINE_BASE}>
          {headline}
        </h2>
      </div>
    </header>
  );
}

import { useState } from "react";
import { Quote } from "lucide-react";
import type { Testimonial as TestimonialRecord } from "@shared";
import { Reveal } from "@/components/reveal";

const BG = "#0A0A0A";
const INK = "#F2EFE6";
const ACCENT = "#FF3D00";

interface TestimonialsSectionProps {
  testimonials?: TestimonialRecord[];
  isLoading?: boolean;
}

const getInitials = (v: string) =>
  v
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((c) => c[0]?.toUpperCase() ?? "")
    .join("") || "?";

export function TestimonialsSection({
  testimonials = [],
  isLoading = false,
}: TestimonialsSectionProps) {
  const visible = testimonials.filter((t) => t.isVisible);
  const source = (visible.length > 0 ? visible : testimonials)
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 12);

  const dataset = source.map((t) => ({
    id: t.id,
    name: t.name,
    role: t.role ?? "",
    company: t.company ?? "",
    content: t.content,
    rating: t.rating ?? 5,
    avatarUrl: t.avatarUrl ?? null,
  }));

  // Build two marquee tracks
  const trackA = [...dataset, ...dataset];
  const trackB = [...dataset, ...dataset].reverse();
  const [paused, setPaused] = useState(false);

  return (
    <section
      id="testimonials"
      className="snap-screen relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-20 lg:px-10"
      style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <Reveal>
          <SectionHeader
            num="07"
            name="TESTIMONIALS"
            kicker="// FIELD REPORTS"
            headline="WHAT THE PEOPLE I SHIPPED FOR SAY"
            right={`${dataset.length} ON RECORD`}
          />
        </Reveal>

        {/* Marquee shell */}
        <div
          className="mt-10"
          style={{ border: `2px solid ${INK}` }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <Bar paused={paused} />

          {isLoading ? (
            <div className="px-6 py-12 text-center font-mono text-[11px] uppercase tracking-[0.2em] opacity-60">
              LOADING TESTIMONIALS…
            </div>
          ) : dataset.length === 0 ? (
            <div className="px-6 py-12 text-center font-mono text-[11px] uppercase tracking-[0.2em] opacity-60">
              NO ENTRIES
            </div>
          ) : (
            <>
              <Track items={trackA} paused={paused} duration={50} />
              <div style={{ borderTop: `2px solid ${INK}` }} />
              <Track items={trackB} paused={paused} duration={65} reverse />
            </>
          )}

          <Bar paused={paused} bottom />
        </div>
      </div>
    </section>
  );
}

function Bar({ paused, bottom }: { paused: boolean; bottom?: boolean }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em]"
      style={
        bottom
          ? { borderTop: `2px solid ${INK}` }
          : { borderBottom: `2px solid ${INK}` }
      }
    >
      <div className="flex items-center gap-3">
        <span style={{ color: ACCENT }}>●</span>
        <span>{paused ? "FEED PAUSED" : "FEED LIVE"}</span>
      </div>
      <span className="opacity-60">SCROLL ON HOVER → PAUSE</span>
    </div>
  );
}

function Track({
  items,
  paused,
  duration,
  reverse,
}: {
  items: ReturnType<typeof Array.prototype.slice>;
  paused: boolean;
  duration: number;
  reverse?: boolean;
}) {
  return (
    <div className="relative overflow-hidden py-4">
      <div
        className="flex w-max gap-0"
        style={{
          animation: `${reverse ? "brut-marquee-rev" : "brut-marquee"} ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {items.map((t: any, i: number) => (
          <Card key={`${t.id}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

function Card({ t }: { t: any }) {
  const [hover, setHover] = useState(false);
  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="mx-3 flex w-[360px] shrink-0 flex-col p-5"
      style={{
        background: hover ? INK : "transparent",
        color: hover ? BG : INK,
        border: `2px solid ${INK}`,
        transition: "none",
        height: 240,
      }}
    >
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
        <Quote className="h-4 w-4" style={{ color: hover ? ACCENT : ACCENT }} />
        <span style={{ opacity: hover ? 0.7 : 0.55 }}>RATING {t.rating}/5</span>
      </div>
      <p
        className="line-clamp-5 text-[13px] leading-snug"
        style={{ flex: 1, opacity: 0.9 }}
      >
        “{t.content}”
      </p>
      <div
        className="mt-3 flex items-center gap-3 pt-3"
        style={{ borderTop: `2px solid ${hover ? BG : INK}` }}
      >
        {t.avatarUrl ? (
          <img
            src={t.avatarUrl}
            alt={t.name}
            className="h-9 w-9 object-cover"
            style={{ border: `2px solid ${hover ? BG : INK}`, filter: "grayscale(100%)" }}
          />
        ) : (
          <div
            className="flex h-9 w-9 items-center justify-center font-mono text-[11px] font-bold"
            style={{
              background: ACCENT,
              color: BG,
              border: `2px solid ${hover ? BG : INK}`,
            }}
          >
            {getInitials(t.name)}
          </div>
        )}
        <div className="min-w-0">
          <div
            className="truncate"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
            }}
          >
            {t.name}
          </div>
          <div
            className="truncate font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ opacity: 0.7 }}
          >
            {[t.role, t.company].filter(Boolean).join(" · ")}
          </div>
        </div>
      </div>
    </article>
  );
}

function SectionHeader({
  num,
  name,
  kicker,
  headline,
  right,
}: {
  num: string;
  name: string;
  kicker: string;
  headline: string;
  right?: string;
}) {
  return (
    <header className="grid grid-cols-12 gap-x-6">
      <aside className="col-span-12 mb-6 lg:col-span-2 lg:mb-0">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
          [ SECTION {num} ]
        </div>
        <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] opacity-70">
          / {name}
        </div>
        <div className="mt-3 h-[2px] w-12" style={{ background: ACCENT }} />
      </aside>
      <div className="col-span-12 lg:col-span-10">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
            {kicker}
          </span>
          {right && (
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-70">
              {right}
            </span>
          )}
        </div>
        <h2
          className="mt-2"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(40px, 7vw, 96px)",
            lineHeight: 0.92,
            letterSpacing: "-0.035em",
            textTransform: "uppercase",
          }}
        >
          {headline}
        </h2>
      </div>
    </header>
  );
}

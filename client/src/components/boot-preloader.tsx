import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * BootPreloader — Section 00 / BOOT.
 *
 * A brutalist, full-screen splash that shows on the first visit per
 * browser session. While it animates (~1.6s), the rest of the app
 * tree mounts behind it so React Query fetches run in parallel — the
 * boot is decorative, not a data gate. After the count finishes, a
 * top-down hard-cut wipe slides the panel up and unmounts.
 *
 * Honors `prefers-reduced-motion`: shows a static frame for ~250ms
 * then unmounts instantly.
 *
 * Session-only memory: a namespaced sessionStorage flag prevents the
 * boot from re-triggering on subsequent navigations within the same
 * tab session.
 */

const INK = "#F2EFE6";
const BG = "#0A0A0A";
const ACCENT = "#FF3D00";

const SESSION_KEY = "codebysrs:boot-seen:v1";

const SYSTEM_CHECKS = [
  "MOUNTING / UI",
  "FETCHING / DATA",
  "RENDERING / HERO",
];

const COUNT_DURATION_MS = 1300;
const HOLD_AFTER_FULL_MS = 180;
const WIPE_DURATION_MS = 320;
const REDUCED_MOTION_HOLD_MS = 250;

export function BootPreloader() {
  const reducedMotion = !!useReducedMotion();

  // Read the session flag once at mount. SSR-safe.
  const [mounted, setMounted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(SESSION_KEY) !== "1";
    } catch {
      return true;
    }
  });
  const [count, setCount] = useState(reducedMotion ? 100 : 0);
  const [checkIndex, setCheckIndex] = useState(0);
  const [wiping, setWiping] = useState(false);

  // Mark the boot as seen as soon as we decide to show it, so a
  // mid-boot refresh still skips on the next navigation.
  useEffect(() => {
    if (!mounted) return;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* sessionStorage may be blocked (incognito, strict mode) — ok. */
    }
  }, [mounted]);

  // Lock body scroll while the preloader is on screen.
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  // Boot timeline.
  useEffect(() => {
    if (!mounted) return;

    if (reducedMotion) {
      const t = window.setTimeout(() => setMounted(false), REDUCED_MOTION_HOLD_MS);
      return () => window.clearTimeout(t);
    }

    // Count-up 0 → 100 over COUNT_DURATION_MS (eased).
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_DURATION_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Cycle the system-check label so all three lines flash by.
    const checkInterval = window.setInterval(() => {
      setCheckIndex((i) => (i + 1) % SYSTEM_CHECKS.length);
    }, COUNT_DURATION_MS / SYSTEM_CHECKS.length);

    // Hold a beat at 100, then trigger the wipe, then unmount.
    const wipeAt = window.setTimeout(() => setWiping(true), COUNT_DURATION_MS + HOLD_AFTER_FULL_MS);
    const unmountAt = window.setTimeout(
      () => setMounted(false),
      COUNT_DURATION_MS + HOLD_AFTER_FULL_MS + WIPE_DURATION_MS,
    );

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(checkInterval);
      window.clearTimeout(wipeAt);
      window.clearTimeout(unmountAt);
    };
  }, [mounted, reducedMotion]);

  if (!mounted) return null;

  const padded = String(count).padStart(3, "0");

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[100] flex flex-col"
      style={{
        background: BG,
        color: INK,
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        // Hard-cut wipe — the whole panel slides up and out. The
        // ease is intentionally snappy ("hard-cut") not springy.
        transform: wiping ? "translateY(-101%)" : "translateY(0)",
        transition: reducedMotion
          ? "none"
          : `transform ${WIPE_DURATION_MS}ms cubic-bezier(0.85,0,0.15,1)`,
        willChange: "transform",
      }}
    >
      {/* ====== Top status row ====== */}
      <div
        className="flex w-full items-center justify-between border-b border-[#F2EFE6]/20 px-6 py-3 text-[11px] uppercase tracking-[0.18em] lg:px-10"
      >
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="inline-block h-2 w-2 brut-blink"
            style={{ background: ACCENT }}
          />
          <span className="opacity-80">BOOT</span>
          <span className="opacity-30">/</span>
          <span className="opacity-80">CodebySRS · DEV-OS</span>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <span className="opacity-60">[ SECTION 00 / BOOT ]</span>
        </div>
      </div>

      {/* ====== Center stage ====== */}
      <div className="relative flex flex-1 items-center justify-center px-6 lg:px-10">
        {/* Subtle hairline grid — matches the hero's GridLines feel. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {[16.66, 33.33, 50, 66.66, 83.33].map((x) => (
            <div
              key={x}
              className="absolute inset-y-0 w-px"
              style={{ left: `${x}%`, background: "rgba(242,239,230,0.04)" }}
            />
          ))}
        </div>

        <div className="relative z-[1] flex w-full max-w-[1600px] flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
          {/* Logo + label */}
          <div className="flex items-center gap-5">
            <span
              className="grid h-16 w-16 shrink-0 place-items-center text-[28px] font-bold leading-none lg:h-20 lg:w-20 lg:text-[36px]"
              style={{ background: ACCENT, color: BG }}
              aria-hidden
            >
              S
            </span>
            <div className="flex flex-col gap-2">
              <div className="text-[10px] uppercase tracking-[0.32em] opacity-60">
                <span style={{ color: ACCENT }}>{"//"}</span> CODEBYSRS
              </div>
              <div className="text-[14px] font-bold uppercase tracking-[0.18em]">
                CREATIVE / DEV / OS
              </div>
              <div className="text-[10px] uppercase tracking-[0.32em] opacity-50">
                {SYSTEM_CHECKS[checkIndex]}
              </div>
            </div>
          </div>

          {/* Giant count + label */}
          <div className="flex flex-col items-start lg:items-end">
            <div className="text-[10px] uppercase tracking-[0.32em] opacity-60">
              BOOT PROGRESS
            </div>
            <div
              className="tabular-nums leading-none"
              style={{
                fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(5rem, 14vw, 12rem)",
                fontWeight: 800,
                color: INK,
              }}
            >
              {padded}
              <span style={{ color: ACCENT }}>%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ====== Bottom progress bar ====== */}
      <div className="border-t border-[#F2EFE6]/20 px-6 py-4 lg:px-10">
        <div
          aria-hidden
          className="relative h-[3px] w-full overflow-hidden bg-[#F2EFE6]/15"
        >
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width: `${count}%`,
              background: ACCENT,
              transition: reducedMotion ? "none" : "width 80ms linear",
            }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.32em] opacity-60">
          <span>SYS / READY · STAND BY</span>
          <span className="tabular-nums">{padded}/100</span>
        </div>
      </div>
    </div>
  );
}

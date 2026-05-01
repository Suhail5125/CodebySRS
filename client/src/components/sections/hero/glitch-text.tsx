import { useEffect, useRef, useState } from "react";

interface GlitchTextProps {
  text: string;
  duration?: number;
  className?: string;
  reducedMotion?: boolean;
  /** characters used while scrambling */
  charset?: string;
}

const DEFAULT_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+=<>/\\|";

/**
 * Scramble-into-target decode effect.
 * Each character locks in over time. Spaces stay as spaces.
 */
export function GlitchText({
  text,
  duration = 900,
  className,
  reducedMotion = false,
  charset = DEFAULT_CHARSET,
}: GlitchTextProps) {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text);
      return;
    }
    const start = performance.now();
    const len = text.length;
    // Pre-compute lock-in times so each char "settles" at a different moment
    const lockTimes = Array.from({ length: len }, () =>
      Math.random() * duration * 0.9,
    );

    const tick = (now: number) => {
      const elapsed = now - start;
      let out = "";
      for (let i = 0; i < len; i++) {
        const ch = text[i];
        if (ch === " " || ch === "\n") {
          out += ch;
          continue;
        }
        if (elapsed >= lockTimes[i]) {
          out += ch;
        } else {
          out += charset[Math.floor(Math.random() * charset.length)];
        }
      }
      setDisplay(out);
      if (elapsed < duration) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [text, duration, reducedMotion, charset]);

  return (
    <span className={className} aria-label={text}>
      {display}
    </span>
  );
}

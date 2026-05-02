import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

export type RevealVariant = "rise" | "fade" | "slide-left" | "slide-right" | "scale" | "clip";

interface UseRevealOptions {
  delay?: number;
  variant?: RevealVariant;
  threshold?: number;
}

function hiddenStyle(variant: RevealVariant): CSSProperties {
  switch (variant) {
    case "slide-left":  return { opacity: 0, transform: "translateX(-52px)" };
    case "slide-right": return { opacity: 0, transform: "translateX(52px)" };
    case "scale":       return { opacity: 0, transform: "scale(0.93)" };
    case "clip":        return { opacity: 0, clipPath: "inset(0 0 100% 0)" };
    case "fade":        return { opacity: 0 };
    default:            return { opacity: 0, transform: "translateY(10px)" };
  }
}

function animName(v: RevealVariant): string {
  const names: Record<RevealVariant, string> = {
    rise:           "brut-rise",
    fade:           "brut-fade",
    "slide-left":   "brut-slide-left",
    "slide-right":  "brut-slide-right",
    scale:          "brut-scale",
    clip:           "brut-clip",
  };
  return names[v];
}

/**
 * IntersectionObserver-based reveal hook. Returns a ref to attach to the
 * target element and a style object that holds the element invisible until
 * it enters the viewport, then plays the chosen animation with the given
 * delay. Honours prefers-reduced-motion and has a 1.5 s safety fallback so
 * content can never be permanently invisible.
 */
export function useReveal({
  delay = 0,
  variant = "rise",
  threshold = 0.12,
}: UseRevealOptions = {}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(node);

    const fallback = window.setTimeout(() => setVisible(true), 1500);

    return () => {
      obs.disconnect();
      window.clearTimeout(fallback);
    };
  }, [threshold]);

  const style: CSSProperties = visible
    ? {
        animation: `${animName(variant)} 0.82s ${delay}ms cubic-bezier(0.85, 0, 0.15, 1) backwards`,
        opacity: 1,
      }
    : hiddenStyle(variant);

  return { ref, style, visible };
}

interface RevealProps {
  children: ReactNode;
  delay?: number;
  variant?: RevealVariant;
  className?: string;
  threshold?: number;
}

/** Wrapper component version of useReveal. */
export function Reveal({
  children,
  delay = 0,
  variant = "rise",
  className,
  threshold = 0.12,
}: RevealProps) {
  const { ref, style } = useReveal({ delay, variant, threshold });
  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

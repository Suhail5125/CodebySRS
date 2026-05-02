import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

type RevealVariant = "rise" | "fade";

interface UseRevealOptions {
  delay?: number;
  variant?: RevealVariant;
  threshold?: number;
}

/**
 * IntersectionObserver-based reveal hook. Returns a ref to attach to the
 * target element and a style object that holds the element invisible until
 * it enters the viewport, then plays brut-rise / brut-fade with the given
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
        animation: `${variant === "rise" ? "brut-rise" : "brut-fade"} 0.85s cubic-bezier(0.85, 0, 0.15, 1) backwards`,
        animationDelay: `${delay}ms`,
        opacity: 1,
      }
    : { opacity: 0, transform: "translateY(10px)" };

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

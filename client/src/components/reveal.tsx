import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  variant?: "rise" | "fade";
  className?: string;
  threshold?: number;
}

/**
 * IntersectionObserver-based reveal wrapper.
 * Plays brut-rise or brut-fade once the element enters the viewport.
 * Honours prefers-reduced-motion and falls back to immediate reveal
 * after a short timeout if the observer never fires.
 */
export function Reveal({
  children,
  delay = 0,
  variant = "rise",
  className,
  threshold = 0.12,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
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
    : { opacity: 0, transform: "translateY(12px)" };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

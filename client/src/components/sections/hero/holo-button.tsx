import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HoloButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  children: ReactNode;
}

/**
 * Glassy holographic button with hover scanline sweep + outer glow.
 * Pure CSS — respects reduced motion via media query.
 */
export const HoloButton = forwardRef<HTMLButtonElement, HoloButtonProps>(
  function HoloButton({ variant = "primary", children, className, ...rest }, ref) {
    const isPrimary = variant === "primary";
    return (
      <button
        ref={ref}
        {...rest}
        className={cn(
          "group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-md border px-6 font-mono text-sm font-medium uppercase tracking-[0.18em] transition-all duration-300",
          "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-transform before:duration-700 before:content-['']",
          "hover:before:translate-x-full motion-reduce:before:hidden",
          isPrimary
            ? [
                "border-cyan-300/60 bg-cyan-400/10 text-cyan-50",
                "shadow-[0_0_20px_rgba(0,240,255,0.25),inset_0_0_20px_rgba(0,240,255,0.08)]",
                "hover:border-cyan-200 hover:bg-cyan-400/20 hover:text-white",
                "hover:shadow-[0_0_35px_rgba(0,240,255,0.55),inset_0_0_25px_rgba(0,240,255,0.18)]",
              ]
            : [
                "border-fuchsia-300/40 bg-fuchsia-400/5 text-fuchsia-100",
                "shadow-[0_0_15px_rgba(255,92,240,0.18),inset_0_0_15px_rgba(255,92,240,0.05)]",
                "hover:border-fuchsia-300/80 hover:bg-fuchsia-400/15 hover:text-white",
                "hover:shadow-[0_0_28px_rgba(255,92,240,0.45),inset_0_0_22px_rgba(255,92,240,0.15)]",
              ],
          className,
        )}
      >
        {/* Corner brackets */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute left-1 top-1 h-2 w-2 border-l border-t",
            isPrimary ? "border-cyan-200" : "border-fuchsia-200",
          )}
        />
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute right-1 top-1 h-2 w-2 border-r border-t",
            isPrimary ? "border-cyan-200" : "border-fuchsia-200",
          )}
        />
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute bottom-1 left-1 h-2 w-2 border-b border-l",
            isPrimary ? "border-cyan-200" : "border-fuchsia-200",
          )}
        />
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute bottom-1 right-1 h-2 w-2 border-b border-r",
            isPrimary ? "border-cyan-200" : "border-fuchsia-200",
          )}
        />
        <span className="relative z-10 inline-flex items-center gap-2">
          {children}
        </span>
      </button>
    );
  },
);

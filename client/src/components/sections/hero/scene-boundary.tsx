import { Component, type ReactNode } from "react";

interface State {
  hasError: boolean;
}

/**
 * Catches WebGL initialization failures (e.g. headless browsers, no GPU,
 * blocked canvas) so the hero falls back to a CSS-only scene instead of
 * triggering the global error boundary.
 */
export class SceneErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Keep silent in production, useful in dev.
    if (typeof console !== "undefined") {
      // eslint-disable-next-line no-console
      console.warn("[HeroScene] WebGL unavailable, using CSS fallback:", error.message);
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

/**
 * Pre-flight check for WebGL support. Returns false in headless / unsupported
 * environments so we can skip mounting <Canvas> entirely.
 */
export function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

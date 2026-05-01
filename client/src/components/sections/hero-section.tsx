import { lazy, Suspense, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Send,
  ArrowUpRight,
  Instagram,
  Twitter,
  ChevronDown,
} from "lucide-react";
import type { AboutInfo } from "@shared";
import { Skeleton } from "@/components/ui/skeleton";
import { GlitchText } from "./hero/glitch-text";
import { HoloButton } from "./hero/holo-button";
import {
  CornerBrackets,
  ScanLines,
  StatusPanel,
  Terminal,
  TechChips,
} from "./hero/hud";
import { SceneErrorBoundary, detectWebGL } from "./hero/scene-boundary";
import { SceneCssFallback } from "./hero/scene-css-fallback";

// Lazy-load the heavy 3D scene so it doesn't block first paint.
// Uses the manual chunk split (`3d-vendor`) configured in vite.config.ts.
const HeroScene = lazy(() => import("./hero/scene"));

interface HeroSectionProps {
  aboutInfo: AboutInfo | null;
  isLoading: boolean;
}

const ROLES = [
  "Creative Developer",
  "3D Enthusiast",
  "UI / UX Designer",
  "Full-Stack Engineer",
];

const TECH = [
  "React",
  "TypeScript",
  "Three.js",
  "Node",
  "WebGL",
  "Tailwind",
];

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);
  return isMobile;
}

/**
 * Returns 0..1 scroll progress through the hero (0 = top, 1 = scrolled
 * one full viewport). Used to dim HUD overlays as the next section approaches.
 */
function useHeroScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = Math.max(window.innerHeight, 1);
      const p = Math.min(Math.max(window.scrollY / vh, 0), 1);
      setProgress(p);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return progress;
}

export function HeroSection({ aboutInfo, isLoading }: HeroSectionProps) {
  const reducedMotion = !!useReducedMotion();
  const isMobile = useIsMobile();
  const [roleIndex, setRoleIndex] = useState(0);
  const [scenePaused, setScenePaused] = useState(false);
  const [webglOk, setWebglOk] = useState<boolean | null>(null);
  const scrollProgress = useHeroScrollProgress();
  // HUD opacity: full at top, ~0.05 at bottom of hero (reduced-motion stays full).
  const hudOpacity = reducedMotion ? 1 : Math.max(0.05, 1 - scrollProgress * 1.1);
  // Scene gets a slight darken too as user descends.
  const sceneOpacity = reducedMotion ? 1 : Math.max(0.4, 1 - scrollProgress * 0.55);

  // Detect WebGL support on mount (client only). Skip mounting <Canvas>
  // entirely if not supported — saves the 3D bundle download too.
  useEffect(() => {
    setWebglOk(detectWebGL());
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(
      () => setRoleIndex((i) => (i + 1) % ROLES.length),
      3400,
    );
    return () => clearInterval(id);
  }, [reducedMotion]);

  // Pause the WebGL canvas (visibility:hidden) once the user has scrolled past the
  // hero, to free GPU. R3F internally throttles offscreen, but this is belt+braces.
  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 1.2;
      setScenePaused(past);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  const socialLinks = aboutInfo
    ? [
        aboutInfo.githubUrl && { icon: Github, href: aboutInfo.githubUrl, label: "GitHub" },
        aboutInfo.linkedinUrl && { icon: Linkedin, href: aboutInfo.linkedinUrl, label: "LinkedIn" },
        aboutInfo.email && { icon: Mail, href: `mailto:${aboutInfo.email}`, label: "Email" },
        aboutInfo.twitterUrl && { icon: Twitter, href: aboutInfo.twitterUrl, label: "Twitter" },
        aboutInfo.instagramUrl && { icon: Instagram, href: aboutInfo.instagramUrl, label: "Instagram" },
      ].filter((l): l is { icon: typeof Github; href: string; label: string } => Boolean(l))
    : [];

  const firstName = aboutInfo?.name?.split(" ")[0] ?? "DEVELOPER";
  const fullName = aboutInfo?.name ?? "Welcome";
  const bio =
    aboutInfo?.bio ??
    "I design and build modern web experiences — interfaces, interactions, and the systems that hold them together.";
  const location = aboutInfo?.location ?? "EARTH / GLOBAL";
  const available = aboutInfo?.availableForWork ?? true;

  const stats = [
    { value: aboutInfo?.yearsExperience ?? 0, label: "Years" },
    { value: aboutInfo?.completedProjects ?? 0, label: "Projects" },
    { value: aboutInfo?.totalClients ?? 0, label: "Clients" },
    { value: aboutInfo?.technologiesCount ?? 0, label: "Stack" },
  ];

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#070512] text-white">
      {/* ============== 3D SCENE LAYER ============== */}
      <div
        className="absolute inset-0 z-0"
        style={{
          visibility: scenePaused ? "hidden" : "visible",
          opacity: sceneOpacity,
          transition: "opacity 200ms linear",
        }}
        aria-hidden
      >
        {webglOk === false || reducedMotion ? (
          <SceneCssFallback />
        ) : webglOk === true ? (
          <SceneErrorBoundary fallback={<SceneCssFallback />}>
            <Suspense fallback={<SceneLoading />}>
              <HeroScene
                isMobile={isMobile}
                reducedMotion={reducedMotion}
                paused={scenePaused}
              />
            </Suspense>
          </SceneErrorBoundary>
        ) : (
          <SceneLoading />
        )}
      </div>

      {/* Vignette gradient over the canvas to anchor text */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 30% 50%, rgba(7,5,18,0.85) 0%, rgba(7,5,18,0.55) 35%, rgba(7,5,18,0) 70%), linear-gradient(180deg, rgba(7,5,18,0.55) 0%, rgba(7,5,18,0) 30%, rgba(7,5,18,0) 70%, rgba(7,5,18,0.95) 100%)",
        }}
      />

      {/* HUD: corner brackets + scanlines (decorative) — fades on scroll */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ opacity: hudOpacity, transition: "opacity 150ms linear" }}
      >
        <CornerBrackets />
        <ScanLines reducedMotion={reducedMotion} />
        {/* fixed-position label markers */}
        <div className="absolute left-4 top-20 -translate-y-7 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300/50">
          ◢ NODE-01 / HERO
        </div>
        <div className="absolute right-4 top-20 -translate-y-7 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300/50">
          REC ● {new Date().getFullYear()}.{String(new Date().getMonth() + 1).padStart(2, "0")} ◣
        </div>
      </div>

      {/* ============== CONTENT ============== */}
      <div className="relative z-[3] mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-32 lg:px-10 lg:pt-36">
        <div className="grid flex-1 grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* ===== LEFT: HEADLINE ===== */}
          <div className="lg:col-span-8">
            {/* Tag line */}
            {isLoading ? (
              <Skeleton className="mb-6 h-5 w-64 bg-white/10" />
            ) : (
              <p className="hero-fade-in mb-5 font-mono text-xs uppercase tracking-[0.4em] text-cyan-300/80">
                <span className="text-cyan-400">[</span> hello.world{" "}
                <span className="text-cyan-400">::</span> identity ={" "}
                <span className="text-fuchsia-300">"{fullName}"</span>{" "}
                <span className="text-cyan-400">]</span>
              </p>
            )}

            {/* Glitch headline */}
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-3/4 bg-white/10" />
                <Skeleton className="h-16 w-1/2 bg-white/10" />
              </div>
            ) : (
              <h1
                data-testid="hero-name"
                className="font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl xl:text-[6rem]"
                style={{ textShadow: "0 0 30px rgba(0, 240, 255, 0.18)" }}
              >
                <span className="block text-white">
                  <GlitchText
                    text={firstName.toUpperCase()}
                    duration={1100}
                    reducedMotion={reducedMotion}
                  />
                </span>
                <span
                  className="block bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-purple-300 bg-clip-text text-transparent"
                  style={{
                    filter:
                      "drop-shadow(0 0 24px rgba(0, 240, 255, 0.35)) drop-shadow(0 0 40px rgba(255, 92, 240, 0.25))",
                  }}
                >
                  <GlitchText
                    text="// CONSTRUCT"
                    duration={1300}
                    reducedMotion={reducedMotion}
                  />
                </span>
              </h1>
            )}

            {/* Rotating role decode */}
            {!isLoading && (
              <div className="hero-fade-in mt-6 flex items-center gap-3 font-mono text-sm">
                <span className="h-px w-10 bg-cyan-300/60" />
                <span className="uppercase tracking-[0.25em] text-cyan-300/70">
                  Mode
                </span>
                <span
                  className="text-cyan-50"
                  style={{ textShadow: "0 0 12px rgba(0,240,255,0.5)" }}
                >
                  <GlitchText
                    key={roleIndex}
                    text={ROLES[roleIndex]}
                    duration={700}
                    reducedMotion={reducedMotion}
                  />
                </span>
              </div>
            )}

            {/* Bio */}
            {isLoading ? (
              <div className="mt-8 space-y-2">
                <Skeleton className="h-4 w-full max-w-xl bg-white/10" />
                <Skeleton className="h-4 w-4/5 max-w-xl bg-white/10" />
              </div>
            ) : (
              <p
                data-testid="hero-bio"
                className="hero-fade-in mt-8 max-w-xl text-base leading-relaxed text-cyan-50/80 sm:text-lg"
                style={{ animationDelay: "0.15s" }}
              >
                {bio}
              </p>
            )}

            {/* CTAs */}
            <div
              className="hero-fade-in mt-10 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "0.3s" }}
            >
              <HoloButton
                onClick={() => scrollTo("#contact")}
                data-testid="button-lets-work-together"
                variant="primary"
              >
                Start a project
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </HoloButton>
              <HoloButton
                onClick={() => scrollTo("#projects")}
                data-testid="button-view-work"
                variant="ghost"
              >
                View work
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </HoloButton>
            </div>

            {/* Tech chips */}
            <div
              className="hero-fade-in mt-8 max-w-2xl"
              style={{ animationDelay: "0.45s" }}
            >
              <TechChips items={TECH} reducedMotion={reducedMotion} />
            </div>

            {/* Social row */}
            {socialLinks.length > 0 && (
              <div
                className="hero-fade-in mt-8 flex items-center gap-1"
                style={{ animationDelay: "0.55s" }}
              >
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    data-testid={`link-${label.toLowerCase()}`}
                    className="group inline-flex h-10 w-10 items-center justify-center rounded-sm border border-cyan-300/0 text-cyan-200/70 transition-all hover:border-cyan-300/50 hover:bg-cyan-400/5 hover:text-cyan-100 hover:shadow-[0_0_15px_rgba(0,240,255,0.35)]"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ===== RIGHT: HUD STACK ===== fades on scroll */}
          <div
            className="hero-fade-in space-y-4 lg:col-span-4"
            style={{
              animationDelay: "0.4s",
              opacity: hudOpacity,
              transition: "opacity 150ms linear",
            }}
          >
            <StatusPanel
              available={available}
              location={location}
              role={ROLES[roleIndex]}
              reducedMotion={reducedMotion}
            />
            <Terminal reducedMotion={reducedMotion} />

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2">
              {stats.map((s) => (
                <div
                  key={s.label}
                  data-testid={`hero-stat-${s.label.toLowerCase()}`}
                  className="rounded-md border border-cyan-300/25 bg-black/40 p-3 backdrop-blur-md shadow-[inset_0_0_15px_rgba(0,240,255,0.06)]"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-400/70">
                    {s.label}
                  </div>
                  <div className="mt-1 font-display text-2xl font-bold text-cyan-50 tabular-nums">
                    {String(s.value).padStart(2, "0")}
                    <span className="text-fuchsia-300">+</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll affordance */}
        <div className="hero-fade-in mt-10 flex items-center justify-between" style={{ animationDelay: "0.7s" }}>
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300/60">
            <span className="h-px w-10 bg-cyan-300/40" />
            Scroll :: descend
            <ChevronDown className="h-3 w-3 motion-safe:animate-bounce" />
          </div>
          <div className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300/40 md:block">
            cursor.move :: parallax_active
          </div>
        </div>
      </div>
    </section>
  );
}

/** Spinner shown while the WebGL bundle is being downloaded. */
function SceneLoading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#070512]">
      <div className="relative h-64 w-64">
        <div
          className="absolute inset-0 animate-pulse rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,240,255,0.4) 0%, rgba(255,92,240,0.2) 40%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div className="absolute inset-8 animate-spin rounded-full border border-cyan-300/30 border-t-cyan-300 [animation-duration:3s]" />
      </div>
    </div>
  );
}

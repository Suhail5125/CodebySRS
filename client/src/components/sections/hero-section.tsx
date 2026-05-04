import { Suspense, useEffect, useRef, useState, useMemo, Component, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

/* ── WebGL error boundary — if GPU isn't available the 3D layer
       simply vanishes; all text / animations continue normally. ── */
class WebGLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

/** Returns true only when a real WebGL context can be created. */
function webGLAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(
      c.getContext("webgl2") ||
      c.getContext("webgl") ||
      c.getContext("experimental-webgl")
    );
  } catch { return false; }
}
import {
  Github,
  Linkedin,
  Mail,
  Twitter,
  Instagram,
  ArrowUpRight,
  ArrowDown,
} from "lucide-react";
import type { AboutInfo } from "@shared";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/reveal";

interface HeroSectionProps {
  aboutInfo: AboutInfo | null;
  isLoading: boolean;
}

const INK    = "#F2EFE6";
const BG     = "#0A0A0A";
const ACCENT = "#FF3D00";

const ROLES = [
  "Creative Developer",
  "3D Generalist",
  "UI / UX Designer",
  "Full-Stack Engineer",
  "Motion Designer",
  "Product Engineer",
  "Frontend Architect",
  "Interaction Designer",
  "WebGL Specialist",
  "Brand Engineer",
  "Systems Designer",
  "Generative Artist",
  "Prototyper",
  "React Specialist",
  "Type-Safe Builder",
  "Performance Nerd",
];

const FOCUS_KEYWORDS = ["INTERFACES", "MOTION", "3D / WEBGL", "DESIGN SYSTEMS", "DX"];

const FALLBACK_SOCIAL = {
  github:    "https://github.com",
  linkedin:  "https://linkedin.com",
  twitter:   "https://twitter.com",
  instagram: "https://instagram.com",
  email:     "hello@codebysrs.dev",
};

const STATEMENTS = [
  "DESIGN SYSTEMS", "MOTION FIRST", "PIXEL PERFECT",
  "PERFORMANCE BUDGET", "SHIP > PERFECT", "ACCESSIBILITY",
  "TYPE-SAFE", "EDGE-NATIVE",
];

const DATA_FEED = [
  "BUILD #1024", "UPTIME 99.98%", "NODE v22",
  "RESPONSE <24H", "TZ UTC+05", "STACK TS+RS",
];

/* ── ease curve: expo out ── */
const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function HeroSection({ aboutInfo, isLoading }: HeroSectionProps) {
  const reducedMotion = !!useReducedMotion();

  const fullName  = aboutInfo?.name ?? "DEVELOPER";
  const firstName = (aboutInfo?.name?.split(" ")[0] ?? "DEVELOPER").toUpperCase();
  const lastName  = (aboutInfo?.name?.split(" ").slice(1).join(" ") ?? "ENGINEER").toUpperCase() || "ENGINEER";
  const bio       = aboutInfo?.bio ?? "I design and build modern web experiences — interfaces, interactions, and the systems that hold them together.";
  const location  = (aboutInfo?.location ?? "EARTH / GLOBAL").toUpperCase();
  const available = aboutInfo?.availableForWork ?? true;

  /* role cycling */
  const [roleIndex, setRoleIndex] = useState(0);
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setRoleIndex(i => (i + 1) % ROLES.length), 1600);
    return () => clearInterval(id);
  }, [reducedMotion]);
  const roleSlotCh = Math.max(...ROLES.map(r => r.length));

  const socialLinks: { Icon: typeof Github; href: string; label: string }[] = [
    { Icon: Github,    href: aboutInfo?.githubUrl    || FALLBACK_SOCIAL.github,    label: "GitHub"    },
    { Icon: Linkedin,  href: aboutInfo?.linkedinUrl  || FALLBACK_SOCIAL.linkedin,  label: "LinkedIn"  },
    { Icon: Twitter,   href: aboutInfo?.twitterUrl   || FALLBACK_SOCIAL.twitter,   label: "Twitter"   },
    { Icon: Instagram, href: aboutInfo?.instagramUrl || FALLBACK_SOCIAL.instagram, label: "Instagram" },
    { Icon: Mail,      href: aboutInfo?.email ? `mailto:${aboutInfo.email}` : `mailto:${FALLBACK_SOCIAL.email}`, label: "Email" },
  ];

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  const now          = useNowEverySecond();
  const feedItem     = useRotator(DATA_FEED,    2400, reducedMotion);
  const nowStatement = useRotator(STATEMENTS,   2200, reducedMotion);

  /* mouse parallax for the name block */
  const sectionRef = useRef<HTMLElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) return;
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setMouse({
        x: ((e.clientX - r.left) / r.width  - 0.5) * 2,
        y: ((e.clientY - r.top)  / r.height - 0.5) * 2,
      });
    };
    const onLeave = () => setMouse({ x: 0, y: 0 });
    el.addEventListener("mousemove",  onMove,  { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove",  onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col overflow-hidden"
      style={{ background: BG, color: INK, fontFamily: "var(--font-sans)" }}
    >
      {/* ══════════ LAYER 0 — 3D CANVAS ════════════════════════════
          Wrapped in an error boundary so a missing GPU never breaks
          the rest of the hero — text / animations work regardless.
      ════════════════════════════════════════════════════════════ */}
      {!reducedMotion && webGLAvailable() && (
        <WebGLBoundary>
          <div className="pointer-events-none absolute inset-0 z-[0]">
            <Canvas
              camera={{ position: [0, 0, 10], fov: 55 }}
              gl={{ antialias: true, alpha: true }}
              style={{ background: "transparent" }}
              onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 0);
              }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={0.4} />
                <pointLight position={[6, 6, 6]} intensity={2.5} color={ACCENT} />
                <pointLight position={[-6, -4, -6]} intensity={0.8} color={INK} />
                <BrandParticles />
                <WireframeTorus />
                <EffectComposer>
                  <Bloom
                    intensity={1.2}
                    luminanceThreshold={0.25}
                    luminanceSmoothing={0.85}
                    blendFunction={BlendFunction.ADD}
                  />
                </EffectComposer>
              </Suspense>
            </Canvas>
          </div>
        </WebGLBoundary>
      )}

      {/* ══════════ LAYER 1 — NOISE / SCANLINE / CURSOR ════════════ */}
      <NoiseOverlay />
      <GridLines />
      {!reducedMotion && <Scanline />}
      {!reducedMotion && <HeroCursor container={sectionRef} />}

      {/* ══════════ TOP STATUS BAR ══════════════════════════════════ */}
      <div
        className="relative z-[4] flex w-full shrink-0 items-center justify-between px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] lg:px-10"
        style={{ borderBottom: `2px solid ${INK}` }}
      >
        <div className="flex items-center gap-3">
          <span className="inline-block h-2 w-2 brut-blink" style={{ background: available ? ACCENT : "#666" }} aria-hidden />
          <span className="opacity-80">{available ? "LIVE" : "OFFLINE"}</span>
          <span className="opacity-20">·</span>
          <span className="hidden tabular-nums opacity-55 sm:inline-block" style={{ minWidth: "16ch" }}>
            <ScrambleText text={feedItem} runKey={feedItem} durationMs={420} paused={reducedMotion} />
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span style={{ color: ACCENT }}>[ SECTION 01 ]</span>
          <span className="opacity-30">/</span>
          <span className="opacity-60">HERO</span>
          <span className="hidden tabular-nums opacity-40 md:inline-block" style={{ minWidth: "8ch" }}>{now}</span>
        </div>
      </div>

      {/* ══════════ MAIN EDITORIAL COMPOSITION ══════════════════════ */}
      <main className="relative z-[4] flex flex-1 flex-col px-6 lg:px-10">

        {/* ── NAME BLOCK — vertically centered, fills all available space ── */}
        <div className="flex flex-1 flex-col justify-center py-8">

          {/* identity kicker — tiny annotation above the name */}
          {isLoading ? (
            <Skeleton className="mb-6 h-3 w-56 bg-white/10" />
          ) : (
            <motion.p
              className="mb-5 font-mono text-[10px] uppercase tracking-[0.42em] opacity-40"
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 0.4, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: EXPO }}
            >
              <span style={{ color: ACCENT }}>{"//"}</span> identity = &ldquo;{fullName}&rdquo;
            </motion.p>
          )}

          {/* ─── THE NAME — editorial left/right split with mouse parallax ─── */}
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-3/4 bg-white/10" />
              <Skeleton className="h-32 w-2/3 bg-white/10" />
            </div>
          ) : (
            <div
              style={{
                transform: `translate(${mouse.x * 14}px, ${mouse.y * 7}px)`,
                transition: "transform 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              <h1
                data-testid="hero-name"
                className="select-none uppercase"
                style={{
                  fontFamily:    "'Inter', 'Helvetica Neue', Arial, sans-serif",
                  fontWeight:    800,
                  fontSize:      "clamp(4rem, 14vw, 14rem)",
                  lineHeight:    0.87,
                  letterSpacing: "-0.035em",
                  color:         INK,
                }}
              >
                {/* FIRST NAME — slides in from the left */}
                <motion.span
                  className="block text-left"
                  initial={reducedMotion ? false : { x: -120, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.0, delay: 0.12, ease: EXPO }}
                >
                  <ScrambleText text={firstName} paused={reducedMotion} durationMs={900} />
                </motion.span>

                {/* LAST NAME — slides in from the right, accent square as prefix */}
                <motion.span
                  className="flex items-baseline justify-end gap-[0.18em]"
                  initial={reducedMotion ? false : { x: 120, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.0, delay: 0.22, ease: EXPO }}
                >
                  {/* Accent square — scales with the font */}
                  <motion.span
                    aria-hidden
                    className="inline-block shrink-0"
                    style={{
                      width:      "0.38em",
                      height:     "0.38em",
                      background: ACCENT,
                      translateY: "-0.04em",
                    }}
                    animate={reducedMotion ? {} : { opacity: [1, 0.4, 1] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <ScrambleText text={lastName} paused={reducedMotion} durationMs={1100} />
                </motion.span>
              </h1>
            </div>
          )}

          {/* bio — screen-reader only */}
          {!isLoading && <p data-testid="hero-bio" className="sr-only">{bio}</p>}

          {/* ── ROLE + FOCUS — annotation strip beneath the name ── */}
          {!isLoading && (
            <Reveal variant="rise" delay={360}>
              <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em]">
                <span className="opacity-35">ROLE</span>
                <span className="opacity-15">[</span>
                <span className="inline-block" style={{ minWidth: `${roleSlotCh}ch`, color: INK }}>
                  <ScrambleText
                    text={ROLES[roleIndex].toUpperCase()}
                    runKey={roleIndex}
                    paused={reducedMotion}
                    durationMs={520}
                  />
                </span>
                <span className="opacity-15">]</span>
                <span className="opacity-15">·</span>
                <span className="tabular-nums opacity-30">
                  {String(roleIndex + 1).padStart(2, "0")}/{String(ROLES.length).padStart(2, "0")}
                </span>

                {/* thin divider */}
                <span className="mx-1 opacity-15">|</span>

                {FOCUS_KEYWORDS.map((kw, i) => (
                  <span key={kw} className="inline-flex items-center gap-2">
                    <span className="opacity-65">{kw}</span>
                    {i < FOCUS_KEYWORDS.length - 1 && (
                      <span style={{ color: ACCENT }} className="opacity-45">/</span>
                    )}
                  </span>
                ))}
              </div>
            </Reveal>
          )}

          {/* NOW statement — floating annotation, right-aligned */}
          {!isLoading && (
            <Reveal variant="rise" delay={420}>
              <div className="mt-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] opacity-50">
                <span style={{ color: ACCENT }}>{"//"}</span>
                <span>NOW SHIPPING</span>
                <span className="opacity-50">·</span>
                <span style={{ color: INK, opacity: 0.8 }}>
                  <ScrambleText text={nowStatement} runKey={nowStatement} paused={reducedMotion} durationMs={380} />
                </span>
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 brut-blink"
                  style={{ background: ACCENT }}
                />
              </div>
            </Reveal>
          )}
        </div>

        {/* ══════════ BOTTOM STRIP ════════════════════════════════════
            Three zones: availability · social channels · CTAs + scroll
            Separated by a full-width 2px border from the name block
        ══════════════════════════════════════════════════════════ */}
        <div
          className="shrink-0 grid grid-cols-1 gap-y-4 py-4 font-mono text-[11px] uppercase tracking-[0.2em] lg:grid-cols-3 lg:gap-y-0 lg:items-center"
          style={{ borderTop: `2px solid ${INK}` }}
        >
          {/* Zone 1 — availability + location */}
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 brut-blink" style={{ background: available ? ACCENT : "#666" }} aria-hidden />
            <span className="opacity-75">
              {available ? "AVAILABLE FOR WORK" : "BOOKED — JOIN WAITLIST"}
            </span>
            <span className="opacity-20">·</span>
            <span className="opacity-40">{location}</span>
          </div>

          {/* Zone 2 — social row, centered on desktop */}
          <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-1 lg:justify-center">
            {socialLinks.map(({ Icon, href, label }, i) => (
              <span key={label} className="inline-flex items-center gap-1.5">
                <SocialLink Icon={Icon} href={href} label={label} />
                {i < socialLinks.length - 1 && (
                  <span className="opacity-15" aria-hidden>·</span>
                )}
              </span>
            ))}
          </div>

          {/* Zone 3 — CTAs + scroll, right-aligned on desktop */}
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <BrutButton
              label="START PROJECT"
              onClick={() => scrollTo("#contact")}
              data-testid="button-lets-work-together"
              variant="solid"
            />
            <BrutButton
              label="VIEW WORK"
              onClick={() => scrollTo("#projects")}
              data-testid="button-view-work"
              variant="ghost"
            />
            <button
              type="button"
              onClick={() => scrollTo("#about")}
              className="flex items-center gap-2 opacity-50 hover:opacity-100"
              style={{ transition: "none" }}
              aria-label="Scroll down"
            >
              <ArrowDown className={`h-3.5 w-3.5 ${reducedMotion ? "" : "motion-safe:animate-bounce"}`} />
            </button>
          </div>
        </div>
      </main>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   3D SCENE COMPONENTS
══════════════════════════════════════════════════════════════════ */

/** Sparse particle cloud using only brand colors — cream + orange */
function BrandParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 700;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread wide — fill the viewport depth
      positions[i3]     = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = (Math.random() - 0.5) * 25;
      positions[i3 + 2] = (Math.random() - 0.5) * 15 - 4;

      if (Math.random() < 0.12) {
        // Orange — rare, vibrant
        colors[i3]     = 1.0;
        colors[i3 + 1] = 0.24;
        colors[i3 + 2] = 0.0;
      } else {
        // Cream — dim, most particles
        const brightness = 0.12 + Math.random() * 0.28;
        colors[i3]     = 0.95 * brightness;
        colors[i3 + 1] = 0.94 * brightness;
        colors[i3 + 2] = 0.90 * brightness;
      }
    }
    return { positions, colors };
  }, []);

  useFrame(({ clock, mouse }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.rotation.y = t * 0.018 + mouse.x * 0.08;
    ref.current.rotation.x = Math.sin(t * 0.04) * 0.06 + mouse.y * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]}    count={count} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/** Wireframe torus knot — the signature 3D shape, responds to mouse */
function WireframeTorus() {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame(({ clock, mouse }) => {
    const t = clock.elapsedTime;
    if (outer.current) {
      outer.current.rotation.x = t * 0.07  + mouse.y * 0.18;
      outer.current.rotation.y = t * 0.11  + mouse.x * 0.18;
      outer.current.rotation.z = t * 0.035;
      const pulse = 1 + Math.sin(t * 0.6) * 0.025;
      outer.current.scale.setScalar(pulse * 2.6);
    }
    if (inner.current) {
      inner.current.rotation.x = -(t * 0.09  + mouse.y * 0.12);
      inner.current.rotation.y =   t * 0.06  + mouse.x * 0.12;
      inner.current.rotation.z = -(t * 0.05);
      inner.current.scale.setScalar(1.4);
    }
  });

  return (
    <group>
      {/* Outer torus knot — orange wireframe, the hero shape */}
      <mesh ref={outer}>
        <torusKnotGeometry args={[1, 0.28, 180, 20]} />
        <meshStandardMaterial
          color={ACCENT}
          wireframe
          transparent
          opacity={0.22}
          emissive={ACCENT}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Inner solid torus knot — subtle, cream */}
      <mesh ref={inner}>
        <torusKnotGeometry args={[1, 0.15, 100, 12]} />
        <meshStandardMaterial
          color={INK}
          wireframe
          transparent
          opacity={0.06}
          emissive={INK}
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════
   UI SUB-COMPONENTS
══════════════════════════════════════════════════════════════════ */

interface BrutButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "solid" | "ghost";
  "data-testid"?: string;
}
function BrutButton({ label, onClick, variant = "solid", "data-testid": testid }: BrutButtonProps) {
  const [hover, setHover] = useState(false);
  const isSolid = variant === "solid";
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testid}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="inline-flex items-center gap-3 px-5 py-3 font-mono text-[12px] font-bold uppercase tracking-[0.22em] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
      style={{
        background:  isSolid ? (hover ? ACCENT : INK)  : (hover ? INK  : "transparent"),
        color:       isSolid ? (hover ? INK   : BG)    : (hover ? BG   : INK),
        border:      `2px solid ${INK}`,
        transition:  "none",
      }}
    >
      <span>{label}</span>
      <ArrowUpRight className="h-4 w-4" />
    </button>
  );
}

interface SocialLinkProps { Icon: typeof Github; href: string; label: string; }
function SocialLink({ Icon, href, label }: SocialLinkProps) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-testid={`link-${label.toLowerCase()}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="inline-flex items-center gap-1.5 outline-none focus-visible:underline"
      style={{
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        color:      hover ? ACCENT : INK,
        opacity:    hover ? 1 : 0.65,
        transition: "none",
      }}
    >
      <Icon className="h-3 w-3 shrink-0" />
      <span>{label}</span>
    </a>
  );
}

function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[2] opacity-[0.07]"
      style={{
        backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        backgroundRepeat: "repeat",
      }}
    />
  );
}

function GridLines() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[2]">
      {[16.66, 33.33, 50, 66.66, 83.33].map(x => (
        <div
          key={x}
          className="absolute inset-y-0 w-px"
          style={{ left: `${x}%`, background: "rgba(242,239,230,0.035)" }}
        />
      ))}
    </div>
  );
}

function Scanline() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
      <div
        className="absolute inset-x-0 h-px brut-scan"
        style={{ background: ACCENT, opacity: 0.5, boxShadow: `0 0 6px ${ACCENT}` }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   HOOKS
══════════════════════════════════════════════════════════════════ */

function useNowEverySecond() {
  const [s, setS] = useState(() => fmtClock(new Date()));
  useEffect(() => {
    const id = setInterval(() => setS(fmtClock(new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  return s;
}
function fmtClock(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function useScramble(target: string, durationMs: number, runKey: number | string, paused: boolean) {
  const [out, setOut] = useState<string>(target);
  useEffect(() => {
    if (paused) { setOut(target); return; }
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░<>/\\\\";
    const start  = performance.now();
    let raf      = 0;
    const tick   = (now: number) => {
      const t          = Math.min(1, (now - start) / durationMs);
      const revealHead = Math.floor(t * (target.length + 4));
      let s = "";
      for (let i = 0; i < target.length; i++) {
        const ch = target[i];
        if (i < revealHead - 4) s += ch;
        else if (ch === " ")    s += " ";
        else s += glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      setOut(s);
      if (t < 1) raf = requestAnimationFrame(tick);
      else       setOut(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs, runKey, paused]);
  return out;
}

interface ScrambleTextProps { text: string; runKey?: number | string; durationMs?: number; paused?: boolean; }
function ScrambleText({ text, runKey = 0, durationMs = 900, paused = false }: ScrambleTextProps) {
  const out = useScramble(text, durationMs, runKey, paused);
  return <span style={{ display: "inline-block", whiteSpace: "pre" }}>{out || "\u00A0"}</span>;
}

function useRotator<T>(items: T[], intervalMs: number, paused: boolean) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (paused || items.length <= 1) return;
    const id = setInterval(() => setI(n => (n + 1) % items.length), intervalMs);
    return () => clearInterval(id);
  }, [items.length, intervalMs, paused]);
  return items[i];
}

interface HeroCursorProps { container: React.RefObject<HTMLElement | null>; }
function HeroCursor({ container }: HeroCursorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const root = container.current;
    if (!root) return;
    let raf = 0;
    let p   = { x: 0, y: 0 };
    const apply = () => {
      raf = 0;
      if (ref.current) ref.current.style.transform = `translate(${p.x - 14}px, ${p.y - 14}px)`;
    };
    const onMove  = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      p = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);
    root.addEventListener("mousemove",  onMove,  { passive: true });
    root.addEventListener("mouseenter", onEnter);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      root.removeEventListener("mousemove",  onMove);
      root.removeEventListener("mouseenter", onEnter);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, [container]);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-[6] h-7 w-7"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.18s", willChange: "transform", mixBlendMode: "difference" }}
    >
      <span className="absolute inset-0 border" style={{ borderColor: ACCENT }} />
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2" style={{ background: ACCENT, opacity: 0.7 }} />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2"  style={{ background: ACCENT, opacity: 0.7 }} />
    </div>
  );
}

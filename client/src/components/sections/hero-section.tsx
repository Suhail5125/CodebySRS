import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Github,
  Linkedin,
  Mail,
  Send,
  ArrowUpRight,
  Instagram,
  Twitter,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import type { AboutInfo } from "@shared";
import { Skeleton } from "@/components/ui/skeleton";

interface HeroSectionProps {
  aboutInfo: AboutInfo | null;
  isLoading: boolean;
}

const ROLES = [
  "Creative Developer",
  "3D Enthusiast",
  "UI/UX Designer",
  "Full-Stack Engineer",
];

export function HeroSection({ aboutInfo, isLoading }: HeroSectionProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => {
      setRoleIndex((i) => (i + 1) % ROLES.length);
    }, 3200);
    return () => clearInterval(id);
  }, [prefersReducedMotion]);

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

  const firstName = aboutInfo?.name?.split(" ")[0] ?? null;
  const fullName = aboutInfo?.name ?? "Welcome";
  const bio =
    aboutInfo?.bio ??
    "I design and build modern web experiences — interfaces, interactions, and the systems that hold them together.";
  const location = aboutInfo?.location;
  const available = aboutInfo?.availableForWork ?? true;

  const stats = [
    { value: aboutInfo?.yearsExperience ?? 0, label: "Years" },
    { value: aboutInfo?.completedProjects ?? 0, label: "Projects" },
    { value: aboutInfo?.totalClients ?? 0, label: "Clients" },
    { value: aboutInfo?.technologiesCount ?? 0, label: "Stack" },
  ];

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* --- Background: subtle, refined, no neon noise --- */}
      <div className="pointer-events-none absolute inset-0">
        {/* Soft radial wash */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(60% 50% at 15% 10%, hsl(var(--chart-1) / 0.12), transparent 60%), radial-gradient(50% 40% at 90% 80%, hsl(var(--chart-3) / 0.10), transparent 60%)",
          }}
        />
        {/* Faint dot grid */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(hsl(var(--foreground) / 0.18) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 80%)",
          }}
        />
        {/* Decorative blurred orb */}
        {!prefersReducedMotion && (
          <motion.div
            aria-hidden
            className="absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full blur-3xl"
            style={{
              background:
                "conic-gradient(from 90deg at 50% 50%, hsl(var(--chart-1) / 0.25), hsl(var(--chart-3) / 0.18), hsl(var(--chart-2) / 0.18), hsl(var(--chart-1) / 0.25))",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 pt-32 pb-20 lg:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
          {/* ============== LEFT COLUMN ============== */}
          <div className="lg:col-span-7 xl:col-span-7">
            {/* Status pill */}
            {isLoading ? (
              <Skeleton className="mb-8 h-7 w-48 rounded-full" />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1.5 backdrop-blur-md"
                data-testid="hero-status-pill"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  {available && !prefersReducedMotion && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${
                      available ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                </span>
                <span className="whitespace-nowrap text-xs font-medium tracking-wide text-foreground/80">
                  {available ? "Available for new projects" : "Currently booked"}
                </span>
                {location && (
                  <>
                    <span className="text-border">•</span>
                    <span className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{location}</span>
                    </span>
                  </>
                )}
              </motion.div>
            )}

            {/* Greeting */}
            {isLoading ? (
              <Skeleton className="mb-4 h-6 w-40" />
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="mb-3 font-mono text-sm text-muted-foreground"
              >
                <span className="text-chart-1">$</span> hello world — I'm
              </motion.p>
            )}

            {/* Name */}
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-3/4" />
                <Skeleton className="h-16 w-1/2" />
              </div>
            ) : (
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-6xl md:text-7xl xl:text-[5.5rem]"
                data-testid="hero-name"
              >
                {firstName && <>{firstName}.{" "}</>}
                <span className="inline-block bg-gradient-to-r from-chart-1 via-chart-3 to-chart-2 bg-clip-text text-transparent">
                  Building
                </span>
                <br />
                things for the web.
              </motion.h1>
            )}

            {/* Rotating role */}
            {!isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 flex items-center gap-3"
              >
                <span className="h-px w-10 bg-foreground/30" />
                <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                  Currently
                </span>
                <span className="relative inline-block h-6 overflow-hidden text-sm font-medium text-foreground">
                  <motion.span
                    key={roleIndex}
                    initial={{ y: 22, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -22, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="block"
                  >
                    {ROLES[roleIndex]}
                  </motion.span>
                </span>
              </motion.div>
            )}

            {/* Bio */}
            {isLoading ? (
              <div className="mt-8 space-y-2">
                <Skeleton className="h-4 w-full max-w-xl" />
                <Skeleton className="h-4 w-4/5 max-w-xl" />
              </div>
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
                data-testid="hero-bio"
              >
                {bio}
              </motion.p>
            )}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <Button
                size="lg"
                onClick={() => scrollTo("#contact")}
                data-testid="button-lets-work-together"
                className="group h-12 gap-2 rounded-full bg-foreground px-6 text-background hover:bg-foreground/90"
              >
                Start a project
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => scrollTo("#projects")}
                data-testid="button-view-work"
                className="group h-12 gap-2 rounded-full px-6 text-foreground hover:bg-foreground/5"
              >
                View work
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </motion.div>

            {/* Social row */}
            {socialLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-10 flex items-center gap-1"
              >
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    data-testid={`link-${label.toLowerCase()}`}
                    className="group inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                ))}
              </motion.div>
            )}
          </div>

          {/* ============== RIGHT COLUMN ============== */}
          <div className="lg:col-span-5 xl:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              {/* Code card */}
              <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-2xl backdrop-blur-xl">
                {/* Window chrome */}
                <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    ~/about-me.ts
                  </span>
                  <Sparkles className="h-3.5 w-3.5 text-chart-1" />
                </div>

                {/* Code body */}
                <div className="px-5 py-5 font-mono text-[13px] leading-relaxed">
                  <CodeLine n={1}>
                    <span className="text-chart-3">const</span>{" "}
                    <span className="text-chart-1">developer</span>{" "}
                    <span className="text-foreground/60">=</span>{" "}
                    <span className="text-foreground/60">{"{"}</span>
                  </CodeLine>
                  <CodeLine n={2}>
                    {"  "}
                    <span className="text-chart-2">name</span>
                    <span className="text-foreground/60">:</span>{" "}
                    <span className="text-emerald-400">"{fullName}"</span>
                    <span className="text-foreground/60">,</span>
                  </CodeLine>
                  <CodeLine n={3}>
                    {"  "}
                    <span className="text-chart-2">role</span>
                    <span className="text-foreground/60">:</span>{" "}
                    <span className="text-emerald-400">"{ROLES[roleIndex]}"</span>
                    <span className="text-foreground/60">,</span>
                  </CodeLine>
                  <CodeLine n={4}>
                    {"  "}
                    <span className="text-chart-2">stack</span>
                    <span className="text-foreground/60">:</span>{" "}
                    <span className="text-foreground/60">[</span>
                  </CodeLine>
                  <CodeLine n={5}>
                    {"    "}
                    <span className="text-emerald-400">"React"</span>
                    <span className="text-foreground/60">,</span>{" "}
                    <span className="text-emerald-400">"TypeScript"</span>
                    <span className="text-foreground/60">,</span>
                  </CodeLine>
                  <CodeLine n={6}>
                    {"    "}
                    <span className="text-emerald-400">"Three.js"</span>
                    <span className="text-foreground/60">,</span>{" "}
                    <span className="text-emerald-400">"Node"</span>
                    <span className="text-foreground/60">,</span>
                  </CodeLine>
                  <CodeLine n={7}>
                    {"  "}
                    <span className="text-foreground/60">],</span>
                  </CodeLine>
                  <CodeLine n={8}>
                    {"  "}
                    <span className="text-chart-2">available</span>
                    <span className="text-foreground/60">:</span>{" "}
                    <span className="text-amber-400">{String(available)}</span>
                    <span className="text-foreground/60">,</span>
                  </CodeLine>
                  <CodeLine n={9}>
                    <span className="text-foreground/60">{"};"}</span>
                  </CodeLine>
                  <CodeLine n={10}>
                    <span
                      className={`inline-block h-4 w-2 translate-y-0.5 bg-chart-1 ${
                        prefersReducedMotion ? "" : "animate-pulse"
                      }`}
                    />
                  </CodeLine>
                </div>
              </div>

              {/* Floating tech chips */}
              {!prefersReducedMotion && (
                <>
                  <FloatingChip
                    label="React"
                    className="-left-4 top-10 hidden md:flex"
                    delay={0}
                  />
                  <FloatingChip
                    label="TypeScript"
                    className="-right-3 top-24 hidden md:flex"
                    delay={1}
                  />
                  <FloatingChip
                    label="Three.js"
                    className="-left-3 bottom-32 hidden md:flex"
                    delay={2}
                  />
                </>
              )}
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-6 grid grid-cols-2 divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md sm:grid-cols-4 sm:divide-x"
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="px-3 py-4 text-center"
                  data-testid={`hero-stat-${s.label.toLowerCase()}`}
                >
                  <div className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                    {s.value}
                    <span className="text-chart-1">+</span>
                  </div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll affordance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted-foreground lg:mt-20"
        >
          <span className="h-px w-10 bg-foreground/20" />
          Scroll to explore
        </motion.div>
      </div>
    </section>
  );
}

function CodeLine({
  n,
  children,
}: {
  n: number;
  children: ReactNode;
}) {
  return (
    <div className="flex">
      <span className="mr-4 w-5 select-none text-right text-foreground/30">
        {n}
      </span>
      <span className="text-foreground/90">{children}</span>
    </div>
  );
}

function FloatingChip({
  label,
  className,
  delay = 0,
}: {
  label: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
      className={`absolute z-10 inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-foreground shadow-lg backdrop-blur-md ${className ?? ""}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-chart-1" />
      {label}
    </motion.div>
  );
}

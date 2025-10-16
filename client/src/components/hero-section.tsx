import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, Github, Linkedin, Mail } from "lucide-react";
import { HeroScene } from "@/components/3d-fallback/hero-scene";
import { Suspense } from "react";

export function HeroSection() {
  const scrollToProjects = () => {
    document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-8">
      {/* 3D Background */}
      <Suspense
        fallback={
          <div className="absolute inset-0 bg-gradient-to-b from-background to-card" />
        }
      >
        <HeroScene />
      </Suspense>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="glass px-6 py-2 rounded-full border border-chart-1/30">
              <span className="text-sm font-medium text-muted-foreground">
                Welcome to my portfolio
              </span>
            </div>
          </motion.div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6">
            <motion.span
              className="block gradient-text-cyan-magenta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Creative Developer
            </motion.span>
            <motion.span
              className="block mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              & 3D Enthusiast
            </motion.span>
          </h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            Crafting immersive web experiences with cutting-edge technologies.
            Specializing in WebGL, Three.js, and modern web development.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Button
              size="lg"
              onClick={scrollToProjects}
              data-testid="button-view-work"
              className="relative overflow-hidden group"
            >
              <span className="relative z-10">View My Work</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-chart-1 to-chart-2"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToContact}
              data-testid="button-get-in-touch"
              className="glass border-chart-1/30"
            >
              Get In Touch
            </Button>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-github"
              className="p-3 rounded-full glass border border-border/50 hover-elevate active-elevate-2 transition-all group"
            >
              <Github className="h-5 w-5 transition-colors group-hover:text-chart-1" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-linkedin"
              className="p-3 rounded-full glass border border-border/50 hover-elevate active-elevate-2 transition-all group"
            >
              <Linkedin className="h-5 w-5 transition-colors group-hover:text-chart-1" />
            </a>
            <a
              href="mailto:contact@example.com"
              data-testid="link-email"
              className="p-3 rounded-full glass border border-border/50 hover-elevate active-elevate-2 transition-all group"
            >
              <Mail className="h-5 w-5 transition-colors group-hover:text-chart-1" />
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 1.6,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 1,
        }}
      >
        <button
          onClick={scrollToProjects}
          data-testid="button-scroll-down"
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-chart-1 transition-colors group"
        >
          <span className="text-sm font-medium">Scroll Down</span>
          <ChevronDown className="h-6 w-6 group-hover:glow-cyan transition-all" />
        </button>
      </motion.div>
    </section>
  );
}

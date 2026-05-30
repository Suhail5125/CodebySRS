import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Calendar, User, Building2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Project } from "@shared";
import { SEO } from "@/components/seo";

const BG = "#0A0A0A";
const INK = "#F2EFE6";
const ACCENT = "#FF3D00";

function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] opacity-[0.055]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        backgroundRepeat: "repeat",
      }}
    />
  );
}

const parseProjectTechnologies = (value: Project["technologies"]): string[] => {
  if (Array.isArray(value)) {
    return value as string[];
  }
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const parseGallery = (value: string | null | undefined): string[] => {
  if (!value) return [];
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export default function ProjectDetail() {
  const params = useParams();
  const projectId = params.id;

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG, color: INK }}>
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: ACCENT, borderTopColor: "transparent" }} />
          <p className="font-mono text-xs uppercase tracking-wider opacity-50">Loading case study...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG, color: INK }}>
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Project Not Found</h1>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const technologies = parseProjectTechnologies(project.technologies);
  const gallery = parseGallery((project as any).gallery);
  const hasDetailedCaseStudy = (project as any).overview || (project as any).challenge || (project as any).solution || (project as any).results;

  return (
    <>
      <SEO 
        title={`${project.title} - Case Study`}
        description={project.description}
        image={project.imageUrl || undefined}
      />
      
      <div className="min-h-screen relative" style={{ background: BG, color: INK }}>
        <NoiseOverlay />

        {/* Back Button - Fixed */}
        <div className="fixed top-6 left-6 z-50">
          <Link href="/#projects">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider"
              style={{ 
                background: INK, 
                color: BG, 
                border: `2px solid ${INK}`,
                transition: "none"
              }}
              whileHover={{ 
                background: ACCENT,
                color: INK
              }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </motion.button>
          </Link>
        </div>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {(project as any).year && (
                  <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider opacity-60">
                    <Calendar className="h-3.5 w-3.5" />
                    {(project as any).year}
                  </div>
                )}
                {(project as any).client && (
                  <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider opacity-60">
                    <Building2 className="h-3.5 w-3.5" />
                    {(project as any).client}
                  </div>
                )}
                {(project as any).duration && (
                  <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider opacity-60">
                    <Clock className="h-3.5 w-3.5" />
                    {(project as any).duration}
                  </div>
                )}
                {(project as any).role && (
                  <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider opacity-60">
                    <User className="h-3.5 w-3.5" />
                    {(project as any).role}
                  </div>
                )}
              </div>

              {/* Title */}
              <h1
                className="font-display font-black text-5xl md:text-7xl lg:text-8xl mb-6 leading-[0.9]"
                style={{ letterSpacing: "-0.04em" }}
              >
                {project.title}
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl opacity-80 max-w-3xl mb-8 leading-relaxed">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-8">
                {technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="font-mono text-xs px-3 py-1"
                    style={{ borderColor: ACCENT, color: ACCENT }}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Button
                      size="lg"
                      className="gap-2 font-mono text-xs uppercase tracking-wider"
                      style={{ background: INK, color: BG, border: `2px solid ${INK}` }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </Button>
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-2 font-mono text-xs uppercase tracking-wider"
                      style={{ borderColor: INK, color: INK }}
                    >
                      <Github className="h-4 w-4" />
                      Source Code
                    </Button>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Hero Image */}
        {project.imageUrl && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="px-6 lg:px-10 mb-20"
          >
            <div className="max-w-7xl mx-auto">
              <div className="relative aspect-video overflow-hidden" style={{ border: `2px solid ${INK}` }}>
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(20%) contrast(1.1)" }}
                />
              </div>
            </div>
          </motion.section>
        )}

        {/* Case Study Content */}
        {hasDetailedCaseStudy && (
          <section className="px-6 lg:px-10 pb-20">
            <div className="max-w-4xl mx-auto space-y-16">
              {/* Overview */}
              {(project as any).overview && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2
                    className="font-display font-bold text-3xl md:text-4xl mb-6"
                    style={{ color: ACCENT }}
                  >
                    Overview
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg leading-relaxed opacity-85 whitespace-pre-wrap">
                      {(project as any).overview}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Challenge */}
              {(project as any).challenge && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2
                    className="font-display font-bold text-3xl md:text-4xl mb-6"
                    style={{ color: ACCENT }}
                  >
                    The Challenge
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg leading-relaxed opacity-85 whitespace-pre-wrap">
                      {(project as any).challenge}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Solution */}
              {(project as any).solution && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2
                    className="font-display font-bold text-3xl md:text-4xl mb-6"
                    style={{ color: ACCENT }}
                  >
                    The Solution
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg leading-relaxed opacity-85 whitespace-pre-wrap">
                      {(project as any).solution}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Results */}
              {(project as any).results && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2
                    className="font-display font-bold text-3xl md:text-4xl mb-6"
                    style={{ color: ACCENT }}
                  >
                    Results & Impact
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg leading-relaxed opacity-85 whitespace-pre-wrap">
                      {(project as any).results}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </section>
        )}

        {/* Gallery */}
        {gallery.length > 0 && (
          <section className="px-6 lg:px-10 pb-20">
            <div className="max-w-7xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display font-bold text-3xl md:text-4xl mb-10"
                style={{ color: ACCENT }}
              >
                Project Gallery
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {gallery.map((imageUrl, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative aspect-video overflow-hidden"
                    style={{ border: `2px solid ${INK}` }}
                  >
                    <img
                      src={imageUrl}
                      alt={`${project.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      style={{ filter: "grayscale(20%) contrast(1.1)" }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Footer CTA */}
        <section className="px-6 lg:px-10 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-12"
              style={{ border: `2px solid ${INK}` }}
            >
              <h3 className="font-display font-bold text-2xl md:text-3xl mb-4">
                Interested in working together?
              </h3>
              <p className="text-lg opacity-70 mb-6">
                Let's build something amazing.
              </p>
              <Link href="/#contact">
                <Button
                  size="lg"
                  className="gap-2 font-mono text-xs uppercase tracking-wider"
                  style={{ background: ACCENT, color: INK, border: `2px solid ${ACCENT}` }}
                >
                  Get In Touch
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}

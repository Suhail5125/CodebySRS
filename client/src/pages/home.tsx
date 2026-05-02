import { Navigation } from "@/components/layout/navigation";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ServicesSection } from "@/components/sections/services-section";
import { WorkProcessSection } from "@/components/sections/work-process-section";
import { AboutSection } from "@/components/sections/about-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ContactSection } from "@/components/sections/contact-section";
import { Footer } from "@/components/layout/footer";
import { SEO } from "@/components/seo";
import { BootPreloader } from "@/components/boot-preloader";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Project, Skill, AboutInfo, InsertContactMessage, Testimonial } from "@shared";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ScrollIndicator } from "@/components/scroll-indicator";

export default function Home() {
  const { toast } = useToast();

  // Fetch projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  // Fetch skills
  const { data: skills = [], isLoading: skillsLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  // Fetch about info
  const { data: aboutInfo, isLoading: aboutLoading } = useQuery<AboutInfo>({
    queryKey: ["/api/about"],
  });

  const { data: testimonials = [], isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  // Contact form mutation
  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      // No toast notification - success is shown in the form itself
    },
    onError: (error: Error) => {
      console.error("Failed to send message:", error);
      // Show user-facing error message
      const message = error.message || "";
      if (message.includes("429")) {
        toast({
          title: "Too many requests",
          description: "Please wait a while before sending another message.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to send message",
          description: "Something went wrong. Please try again later.",
          variant: "destructive",
        });
      }
    },
  });

  const handleContactSubmit = async (data: InsertContactMessage) => {
    await contactMutation.mutateAsync(data);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <SEO />
      <ScrollIndicator />

      {/* Section 00 / BOOT — first-visit splash. Mounted as a sibling
          (not a wrapper) so React Query fetches and the rest of the
          page mount in parallel behind it. Self-gates via
          sessionStorage and unmounts itself after the wipe. */}
      <BootPreloader />

      <main>
        {/* Brutalist top nav now sits ABOVE the hero (not overlaid),
            so the hero's LIVE status bar is no longer hidden. */}
        <Navigation />
        <div id="hero" className="relative">
          <HeroSection aboutInfo={aboutInfo || null} isLoading={aboutLoading} />
        </div>

        <div id="projects">
          <ProjectsSection projects={projects} isLoading={projectsLoading} />
        </div>

        <div id="skills">
          <SkillsSection skills={skills} isLoading={skillsLoading} />
        </div>

        <div id="services">
          <ServicesSection />
        </div>

        <div>
          <WorkProcessSection />
        </div>

        <div id="about">
          <AboutSection aboutInfo={aboutInfo || null} isLoading={aboutLoading} />
        </div>

        <div>
          <TestimonialsSection testimonials={testimonials} isLoading={testimonialsLoading} />
        </div>

        <div id="contact">
          <ContactSection
            onSubmit={handleContactSubmit}
            isSubmitting={contactMutation.isPending}
          />
        </div>

        <div>
          <Footer aboutInfo={aboutInfo || null} />
        </div>
      </main>
    </div>
  );
}

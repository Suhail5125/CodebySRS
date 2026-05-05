import { useEffect } from "react";
import { SideHeader } from "@/components/layout/side-header";
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
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Project, Skill, AboutInfo, InsertContactMessage, Testimonial } from "@shared";
import { useToast } from "@/hooks/use-toast";
import { ScrollIndicator } from "@/components/scroll-indicator";
import {
  DUMMY_ABOUT,
  DUMMY_PROJECTS,
  DUMMY_SKILLS,
  DUMMY_TESTIMONIALS,
} from "@/lib/dummy-data";

export default function Home() {
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.classList.add("snap-sections");
    return () => {
      document.documentElement.classList.remove("snap-sections");
    };
  }, []);

  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });
  const { data: skills = [], isLoading: skillsLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });
  const { data: aboutInfo, isLoading: aboutLoading } = useQuery<AboutInfo>({
    queryKey: ["/api/about"],
  });
  const { data: testimonials = [], isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const safeAbout: AboutInfo = aboutInfo ?? DUMMY_ABOUT;
  const safeProjects: Project[] = projects.length > 0 ? projects : DUMMY_PROJECTS;
  const safeSkills: Skill[] = skills.length > 0 ? skills : DUMMY_SKILLS;
  const safeTestimonials: Testimonial[] =
    testimonials.length > 0 ? testimonials : DUMMY_TESTIMONIALS;

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onError: (error: Error) => {
      console.error("Failed to send message:", error);
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

      <SideHeader />

      <main>
        <HeroSection aboutInfo={safeAbout} isLoading={aboutLoading} />
        <ProjectsSection projects={safeProjects} isLoading={projectsLoading} />
        <SkillsSection skills={safeSkills} isLoading={skillsLoading} />
        <ServicesSection />
        <WorkProcessSection />
        <AboutSection aboutInfo={safeAbout} isLoading={aboutLoading} />
        <TestimonialsSection testimonials={safeTestimonials} isLoading={testimonialsLoading} />
        <ContactSection
          onSubmit={handleContactSubmit}
          isSubmitting={contactMutation.isPending}
        />
        <Footer aboutInfo={safeAbout} />
      </main>
    </div>
  );
}

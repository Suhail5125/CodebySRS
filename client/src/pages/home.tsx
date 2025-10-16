import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { SkillsSection } from "@/components/skills-section";
import { AboutSection } from "@/components/about-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Project, Skill, AboutInfo, InsertContactMessage } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

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

  // Contact form mutation
  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleContactSubmit = async (data: InsertContactMessage) => {
    await contactMutation.mutateAsync(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="snap-y snap-mandatory h-screen overflow-y-scroll">
        <HeroSection />
        <ProjectsSection projects={projects} isLoading={projectsLoading} />
        <SkillsSection skills={skills} isLoading={skillsLoading} />
        <AboutSection aboutInfo={aboutInfo || null} isLoading={aboutLoading} />
        <TestimonialsSection />
        <ContactSection
          onSubmit={handleContactSubmit}
          isSubmitting={contactMutation.isPending}
        />
      </main>
      <Footer />
    </div>
  );
}

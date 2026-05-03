import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  FolderKanban, 
  Wrench, 
  User, 
  Plus, 
  TrendingUp,
  MessageSquare,
  Shield,
  FileText,
  Quote,
  Briefcase
} from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Project, Skill, ContactMessage, Testimonial } from "@shared";

export default function AdminDashboard() {
  const [location, setLocation] = useLocation();

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: skills = [] } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const { data: messages = [] } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact/messages"],
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const unreadMessages = messages.filter((m) => !m.read).length;
  const featuredProjects = projects.filter((p) => p.featured).length;
  const testimonialsCount = testimonials.length;

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      setLocation("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader 
        title="Admin Dashboard" 
        description="Manage your portfolio content" 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 glass border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-chart-1/20">
                  <FolderKanban className="h-5 w-5 text-chart-1" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{projects.length}</p>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6 glass border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-chart-2/20">
                  <Wrench className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{skills.length}</p>
                  <p className="text-sm text-muted-foreground">Skills Listed</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6 glass border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-chart-3/20">
                  <MessageSquare className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{messages.length}</p>
                  <p className="text-sm text-muted-foreground">Messages</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6 glass border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-chart-4/20">
                  <Quote className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{testimonialsCount}</p>
                  <p className="text-sm text-muted-foreground">Testimonials</p>
                </div>
              </div>
            </Card>
          </motion.div>

        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-6 glass border-border/50 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FolderKanban className="h-6 w-6 text-chart-1" />
                  <h2 className="font-display text-xl font-bold">Projects</h2>
                </div>
                <Link href="/admin/projects">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </Link>
              </div>
              <p className="text-muted-foreground mb-4">
                Showcase your work with detailed project information, images, and technology stacks.
              </p>
              <Link href="/admin/projects">
                <Button variant="outline" className="w-full">
                  Manage Projects
                </Button>
              </Link>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card className="p-6 glass border-border/50 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Wrench className="h-6 w-6 text-chart-2" />
                  <h2 className="font-display text-xl font-bold">Skills</h2>
                </div>
                <Link href="/admin/skills">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </Link>
              </div>
              <p className="text-muted-foreground mb-4">
                Organize your technical skills by category with proficiency levels for 3D visualization.
              </p>
              <Link href="/admin/skills">
                <Button variant="outline" className="w-full">
                  Manage Skills
                </Button>
              </Link>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <Card className="p-6 glass border-border/50 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-chart-3" />
                  <h2 className="font-display text-xl font-bold">Messages</h2>
                  {unreadMessages > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadMessages} new
                    </span>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                View and respond to contact form submissions from potential clients and collaborators.
              </p>
              <Link href="/admin/messages">
                <Button variant="outline" className="w-full">
                  View Messages
                </Button>
              </Link>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
            <Card className="p-6 glass border-border/50 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Quote className="h-6 w-6 text-chart-1" />
                  <h2 className="font-display text-xl font-bold">Testimonials</h2>
                </div>
                <Link href="/admin/testimonials">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </Link>
              </div>
              <p className="text-muted-foreground mb-4">
                Collect client feedback to showcase social proof and success stories.
              </p>
              <Link href="/admin/testimonials">
                <Button variant="outline" className="w-full">
                  Manage Testimonials
                </Button>
              </Link>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
            <Card className="p-6 glass border-border/50 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <User className="h-6 w-6 text-chart-4" />
                  <h2 className="font-display text-xl font-bold">About Info</h2>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                Update your company profile, bio, contact information, and social media links.
              </p>
              <Link href="/admin/about">
                <Button variant="outline" className="w-full">
                  Edit About
                </Button>
              </Link>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
            <Card className="p-6 glass border-border/50 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-6 w-6 text-chart-2" />
                  <h2 className="font-display text-xl font-bold">Experience</h2>
                </div>
                <Link href="/admin/experience">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </Link>
              </div>
              <p className="text-muted-foreground mb-4">
                Manage your job and freelance timeline entries shown in the About section.
              </p>
              <Link href="/admin/experience">
                <Button variant="outline" className="w-full">
                  Manage Experience
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

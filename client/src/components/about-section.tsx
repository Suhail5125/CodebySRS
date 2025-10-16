import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Github, Linkedin, Twitter, Mail, Briefcase, Users, Award, MapPin, Clock } from "lucide-react";
import type { AboutInfo } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AboutSectionProps {
  aboutInfo: AboutInfo | null;
  isLoading: boolean;
}

export function AboutSection({ aboutInfo, isLoading }: AboutSectionProps) {
  if (isLoading) {
    return (
      <section id="about" className="min-h-screen pt-24 pb-16 relative snap-start snap-always flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Skeleton className="h-64 w-64 rounded-full mx-auto" />
              <Skeleton className="h-8 w-3/4 mx-auto" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!aboutInfo) {
    return (
      <section id="about" className="min-h-screen pt-24 pb-16 relative snap-start snap-always flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-lg border border-border/50 p-12 max-w-md mx-auto">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="font-display text-2xl font-bold mb-2">About Info Not Available</h3>
            <p className="text-muted-foreground">
              Information will be added soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  const stats = [
    { icon: Briefcase, label: "Projects Completed", value: "50+", color: "text-chart-1" },
    { icon: Users, label: "Happy Clients", value: "30+", color: "text-chart-2" },
    { icon: Award, label: "Years Experience", value: "5+", color: "text-chart-3" },
    { icon: MapPin, label: "Location", value: "Remote", color: "text-chart-4" },
    { icon: Clock, label: "Availability", value: "Available", color: "text-chart-1" },
  ];

  return (
    <section id="about" className="min-h-screen py-16 relative snap-start snap-always flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-cyan-magenta">About Me</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get to know me better
          </p>
          <motion.div
            className="h-1 w-24 mx-auto mt-6 bg-gradient-to-r from-chart-1 to-chart-2 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1"
          >
            <Card className="p-6 glass border-border/50 text-center">
              <div className="relative inline-block mb-6">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-chart-1 to-chart-2 rounded-full blur-2xl opacity-50"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.7, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <Avatar className="h-40 w-40 border-4 border-chart-1/30 relative">
                  <AvatarImage src={aboutInfo.avatarUrl || undefined} alt={aboutInfo.name} />
                  <AvatarFallback className="text-4xl font-display gradient-text-cyan-purple">
                    {aboutInfo.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </div>

              <h3
                className="font-display text-2xl font-bold mb-2"
                data-testid="text-about-name"
              >
                {aboutInfo.name}
              </h3>
              <p
                className="text-lg text-chart-1 mb-6"
                data-testid="text-about-title"
              >
                {aboutInfo.title}
              </p>

              <div className="flex items-center justify-center gap-3 mb-6">
                {aboutInfo.githubUrl && (
                  <a
                    href={aboutInfo.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-about-github"
                  >
                    <Button variant="outline" size="icon" className="glass">
                      <Github className="h-5 w-5" />
                    </Button>
                  </a>
                )}
                {aboutInfo.linkedinUrl && (
                  <a
                    href={aboutInfo.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-about-linkedin"
                  >
                    <Button variant="outline" size="icon" className="glass">
                      <Linkedin className="h-5 w-5" />
                    </Button>
                  </a>
                )}
                {aboutInfo.twitterUrl && (
                  <a
                    href={aboutInfo.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-about-twitter"
                  >
                    <Button variant="outline" size="icon" className="glass">
                      <Twitter className="h-5 w-5" />
                    </Button>
                  </a>
                )}
                {aboutInfo.email && (
                  <a href={`mailto:${aboutInfo.email}`} data-testid="link-about-email">
                    <Button variant="outline" size="icon" className="glass">
                      <Mail className="h-5 w-5" />
                    </Button>
                  </a>
                )}
              </div>

              {aboutInfo.resumeUrl && (
                <a
                  href={aboutInfo.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="button-download-resume"
                  className="inline-block w-full"
                >
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                </a>
              )}
            </Card>
          </motion.div>

          {/* Bio & Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="p-6 glass border-border/50">
              <h4 className="font-display text-xl font-bold mb-4">About</h4>
              <p
                className="text-muted-foreground leading-relaxed whitespace-pre-line"
                data-testid="text-about-bio"
              >
                {aboutInfo.bio}
              </p>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-4 glass border-border/50 hover-elevate transition-all text-center">
                    <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                    <div className="font-display text-2xl font-bold mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

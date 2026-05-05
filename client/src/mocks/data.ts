import type { AboutInfo, Project, Skill, Testimonial, Experience } from "@shared";

export const DUMMY_ABOUT: AboutInfo = {
  id: "dummy-about",
  name: "Studio Codebysrs",
  title: "Full-Stack Engineer · 3D Web Specialist",
  bio: "Studio Codebysrs is a digital production house specializing in high-performance web applications and immersive 3D experiences.",
  avatarUrl: null,
  resumeUrl: "#",
  email: "hello@codebysrs.dev",
  phone: "+1 (555) 010-2026",
  location: "Berlin · Remote-first",
  githubUrl: "https://github.com/codebysrs",
  linkedinUrl: "https://linkedin.com/in/codebysrs",
  twitterUrl: "https://twitter.com/codebysrs",
  instagramUrl: "https://instagram.com/codebysrs",
  availableForWork: true,
  responseTime: "< 24h",
  workingHours: "09:00 – 18:00 CET",
  completedProjects: 87,
  totalClients: 42,
  yearsExperience: 10,
  technologiesCount: 36,
  updatedAt: new Date(),
};

export const DUMMY_PROJECTS: Project[] = [
  {
    id: "p-001",
    title: "Atlas Configurator",
    description: "Real-time 3D product configurator for an industrial OEM.",
    imageUrl: null,
    technologies: JSON.stringify(["React", "Three.js", "WebGL"]),
    githubUrl: "#",
    liveUrl: "#",
    featured: true,
    order: 1,
    createdAt: new Date(),
  }
];

export const DUMMY_SKILLS: Skill[] = [
  { id: "s-1", name: "React", category: "Frontend", proficiency: 95, icon: null, order: 1 }
];

export const DUMMY_EXPERIENCE: Experience[] = [
  {
    id: "e-001",
    role: "Senior Full Stack Engineer",
    company: "Tech Corp",
    type: "JOB",
    startYear: 2021,
    endYear: 2024,
    description: "Led frontend architecture and built scalable React applications.",
    order: 1,
    createdAt: new Date(),
  }
];

export const DUMMY_TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    name: "Lena Kohler",
    role: "VP Product",
    company: "Helix Labs",
    content: "The team rebuilt our checkout in three weeks. Conversion went up 22%.",
    rating: 5,
    avatarUrl: null,
    isVisible: true,
    order: 1,
    createdAt: new Date(),
  }
];

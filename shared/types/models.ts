import { pgTable, text, integer, boolean, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";

// Projects table for portfolio showcases
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  technologies: text("technologies").notNull(), // JSON stringified array
  featured: boolean("featured").default(false).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // Case Study fields
  overview: text("overview"), // Detailed project overview
  challenge: text("challenge"), // Problem/challenge faced
  solution: text("solution"), // Solution implemented
  results: text("results"), // Results/outcomes achieved
  duration: text("duration"), // Project duration (e.g., "3 months")
  role: text("role"), // Your role in the project
  client: text("client"), // Client name
  year: integer("year"), // Project year
  gallery: text("gallery"), // JSON stringified array of image URLs
});

// Skills table for skill visualization
export const skills = pgTable("skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  category: text("category").notNull(), // e.g., "Frontend", "Backend", "3D/Graphics", "Tools"
  proficiency: integer("proficiency").notNull(), // 1-100
  icon: text("icon"), // Icon name from lucide-react
  order: integer("order").default(0).notNull(),
});

// Testimonials table for client feedback
export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  role: text("role"),
  company: text("company"),
  content: text("content").notNull(),
  rating: integer("rating").default(5).notNull(),
  avatarUrl: text("avatar_url"),
  isVisible: boolean("is_visible").default(false).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Contact messages from the contact form
export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  projectType: text("project_type"),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  starred: boolean("starred").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// About info (single record)
export const aboutInfo = pgTable("about_info", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  avatarUrl: text("avatar_url"),
  resumeUrl: text("resume_url"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  instagramUrl: text("instagram_url"),
  email: text("email"),
  phone: text("phone"),
  location: text("location"),
  availableForWork: boolean("available_for_work").default(true),
  responseTime: text("response_time").default("24 hours"),
  workingHours: text("working_hours").default("9 AM - 6 PM EST"),
  // Metrics
  completedProjects: integer("completed_projects").default(0),
  totalClients: integer("total_clients").default(0),
  yearsExperience: integer("years_experience").default(0),
  technologiesCount: integer("technologies_count").default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Admin users for content management
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(true).notNull(),
});

export const experienceTypeEnum = pgEnum("experience_type", ["JOB", "FREELANCE"]);

// Experience entries for the timeline
export const experience = pgTable("experience", {
  id: uuid("id").primaryKey().defaultRandom(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  type: experienceTypeEnum("type").notNull(),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year"), // nullable = ongoing
  description: text("description").notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// TypeScript types
export type Project = typeof projects.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type AboutInfo = typeof aboutInfo.$inferSelect;
export type User = typeof users.$inferSelect;
export type Experience = typeof experience.$inferSelect;

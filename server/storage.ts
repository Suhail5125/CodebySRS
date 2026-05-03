import {
  type User,
  type InsertUser,
  type Project,
  type InsertProject,
  type Skill,
  type InsertSkill,
  type ContactMessage,
  type InsertContactMessage,
  type AboutInfo,
  type InsertAboutInfo,
  type Testimonial,
  type InsertTestimonial,
  type Experience,
  type InsertExperience,
  users,
  projects,
  skills,
  contactMessages,
  aboutInfo,
  testimonials,
  experience,
} from "@shared";
import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { config } from "./config";

const { Pool } = pg;

// Create PostgreSQL connection pool using centralized configuration
const pool = new Pool({
  connectionString: config.database.url,
});

const db = drizzle(pool);

// Helper functions for JSON serialization
function serializeProject(project: InsertProject): any {
  return {
    ...project,
    technologies: JSON.stringify(project.technologies),
  };
}

function deserializeProject(project: any): Project {
  return {
    ...project,
    technologies: JSON.parse(project.technologies),
  };
}

function sanitizeValues<T extends Record<string, any>>(values: T): T {
  const entries = Object.entries(values).filter(([, value]) => value !== undefined);
  return Object.fromEntries(entries) as T;
}

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project methods
  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Skill methods
  getAllSkills(): Promise<Skill[]>;
  getSkill(id: string): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: string, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: string): Promise<boolean>;
  reorderSkills(skills: { id: string; category: string; order: number }[]): Promise<void>;

  // Testimonial methods
  getAllTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: string): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: string): Promise<boolean>;

  // Contact message methods
  getAllContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: string): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markMessageAsRead(id: string): Promise<boolean>;
  toggleMessageStarred(id: string, starred: boolean): Promise<boolean>;
  deleteContactMessage(id: string): Promise<boolean>;

  // About info methods
  getAboutInfo(): Promise<AboutInfo | undefined>;
  updateAboutInfo(info: InsertAboutInfo): Promise<AboutInfo>;

  // Experience methods
  getExperiences(): Promise<Experience[]>;
  getExperience(id: string): Promise<Experience | undefined>;
  createExperience(exp: InsertExperience): Promise<Experience>;
  updateExperience(id: string, exp: Partial<InsertExperience>): Promise<Experience | undefined>;
  deleteExperience(id: string): Promise<boolean>;
  reorderExperiences(updates: { id: string; order: number }[]): Promise<void>;
}

export class DbStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    const results = await db.select().from(projects).orderBy(projects.order);
    return results.map(deserializeProject);
  }

  async getProject(id: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return result[0] ? deserializeProject(result[0]) : undefined;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const serialized = serializeProject(project);
    const result = await db.insert(projects).values(serialized).returning();
    return deserializeProject(result[0]);
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const serialized = project.technologies 
      ? { ...project, technologies: JSON.stringify(project.technologies) }
      : project;
    const result = await db
      .update(projects)
      .set(serialized as any)
      .where(eq(projects.id, id))
      .returning();
    return result[0] ? deserializeProject(result[0]) : undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }

  // Skill methods
  async getAllSkills(): Promise<Skill[]> {
    return await db.select().from(skills).orderBy(skills.order);
  }

  async getSkill(id: string): Promise<Skill | undefined> {
    const result = await db.select().from(skills).where(eq(skills.id, id));
    return result[0];
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const result = await db.insert(skills).values(skill).returning();
    return result[0];
  }

  async updateSkill(id: string, skill: Partial<InsertSkill>): Promise<Skill | undefined> {
    const result = await db
      .update(skills)
      .set(skill)
      .where(eq(skills.id, id))
      .returning();
    return result[0];
  }

  async deleteSkill(id: string): Promise<boolean> {
    const result = await db.delete(skills).where(eq(skills.id, id)).returning();
    return result.length > 0;
  }

  async reorderSkills(updates: { id: string; category: string; order: number }[]): Promise<void> {
    await Promise.all(
      updates.map(({ id, category, order }) =>
        db
          .update(skills)
          .set({ category, order })
          .where(eq(skills.id, id))
      )
    );
  }

  // Testimonial methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(testimonials.order);
  }

  async getTestimonial(id: string): Promise<Testimonial | undefined> {
    const result = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return result[0];
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const result = await db.insert(testimonials).values({
      ...testimonial,
      isVisible: testimonial.isVisible ?? false,
    }).returning();
    return result[0];
  }

  async updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const payload = sanitizeValues(testimonial);
    const result = await db
      .update(testimonials)
      .set(payload as any)
      .where(eq(testimonials.id, id))
      .returning();
    return result[0];
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id)).returning();
    return result.length > 0;
  }

  // Contact message methods
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(contactMessages.createdAt);
  }

  async getContactMessage(id: string): Promise<ContactMessage | undefined> {
    const result = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return result[0];
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const result = await db.insert(contactMessages).values(message).returning();
    return result[0];
  }

  async markMessageAsRead(id: string): Promise<boolean> {
    const result = await db
      .update(contactMessages)
      .set({ read: true })
      .where(eq(contactMessages.id, id))
      .returning();
    return result.length > 0;
  }

  async toggleMessageStarred(id: string, starred: boolean): Promise<boolean> {
    const result = await db
      .update(contactMessages)
      .set({ starred })
      .where(eq(contactMessages.id, id))
      .returning();
    return result.length > 0;
  }

  async deleteContactMessage(id: string): Promise<boolean> {
    const result = await db.delete(contactMessages).where(eq(contactMessages.id, id)).returning();
    return result.length > 0;
  }

  // About info methods
  async getAboutInfo(): Promise<AboutInfo | undefined> {
    const result = await db.select().from(aboutInfo);
    return result[0];
  }

  async updateAboutInfo(info: InsertAboutInfo): Promise<AboutInfo> {
    const existing = await this.getAboutInfo();
    
    if (existing) {
      const result = await db
        .update(aboutInfo)
        .set({ ...info, updatedAt: new Date() })
        .where(eq(aboutInfo.id, existing.id))
        .returning();
      return result[0];
    } else {
      const result = await db
        .insert(aboutInfo)
        .values({ ...info, updatedAt: new Date() })
        .returning();
      return result[0];
    }
  }

  // Experience methods
  async getExperiences(): Promise<Experience[]> {
    return await db.select().from(experience).orderBy(experience.order);
  }

  async getExperience(id: string): Promise<Experience | undefined> {
    const result = await db.select().from(experience).where(eq(experience.id, id));
    return result[0];
  }

  async createExperience(exp: InsertExperience): Promise<Experience> {
    const result = await db.insert(experience).values(exp).returning();
    return result[0];
  }

  async updateExperience(id: string, exp: Partial<InsertExperience>): Promise<Experience | undefined> {
    const payload = sanitizeValues(exp) as Partial<typeof experience.$inferInsert>;
    const result = await db
      .update(experience)
      .set(payload)
      .where(eq(experience.id, id))
      .returning();
    return result[0];
  }

  async deleteExperience(id: string): Promise<boolean> {
    const result = await db.delete(experience).where(eq(experience.id, id)).returning();
    return result.length > 0;
  }

  async reorderExperiences(updates: { id: string; order: number }[]): Promise<void> {
    await Promise.all(
      updates.map(({ id, order }) =>
        db.update(experience).set({ order }).where(eq(experience.id, id))
      )
    );
  }
}

export const storage = new DbStorage();

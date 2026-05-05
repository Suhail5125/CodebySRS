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

export class MockStorage implements IStorage {
  private users: User[] = [];
  private projects: Project[] = [];
  private skills: Skill[] = [];
  private testimonials: Testimonial[] = [];
  private experiences: Experience[] = [];
  private contactMessages: ContactMessage[] = [];
  private about: AboutInfo | undefined;

  constructor() {
    // Load mock data
    import("./mocks").then((mocks) => {
      this.projects = [...mocks.MOCK_PROJECTS];
      this.skills = [...mocks.MOCK_SKILLS];
      this.testimonials = [...mocks.MOCK_TESTIMONIALS];
      this.experiences = [...mocks.MOCK_EXPERIENCE];
      this.about = { ...mocks.MOCK_ABOUT };
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find((u) => u.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser = { ...user, id: `u-${Date.now()}` } as User;
    this.users.push(newUser);
    return newUser;
  }

  async getAllProjects(): Promise<Project[]> {
    return this.projects;
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.find((p) => p.id === id);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const newProject = {
      ...project,
      id: `p-${Date.now()}`,
      technologies: JSON.stringify(project.technologies),
      featured: project.featured ?? false,
      order: project.order ?? 0,
      createdAt: new Date(),
    } as unknown as Project;
    this.projects.push(newProject);
    return newProject;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return undefined;
    
    const updatePayload = { ...project } as any;
    if (project.technologies) {
      updatePayload.technologies = JSON.stringify(project.technologies);
    }
    
    this.projects[index] = { ...this.projects[index], ...updatePayload } as Project;
    return this.projects[index];
  }

  async deleteProject(id: string): Promise<boolean> {
    const initialLen = this.projects.length;
    this.projects = this.projects.filter((p) => p.id !== id);
    return this.projects.length < initialLen;
  }

  async getAllSkills(): Promise<Skill[]> {
    return this.skills;
  }

  async getSkill(id: string): Promise<Skill | undefined> {
    return this.skills.find((s) => s.id === id);
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const newSkill = {
      ...skill,
      id: `s-${Date.now()}`,
      order: skill.order ?? 0,
      icon: skill.icon ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Skill;
    this.skills.push(newSkill);
    return newSkill;
  }

  async updateSkill(id: string, skill: Partial<InsertSkill>): Promise<Skill | undefined> {
    const index = this.skills.findIndex((s) => s.id === id);
    if (index === -1) return undefined;
    this.skills[index] = { ...this.skills[index], ...skill, updatedAt: new Date() } as Skill;
    return this.skills[index];
  }

  async deleteSkill(id: string): Promise<boolean> {
    const initialLen = this.skills.length;
    this.skills = this.skills.filter((s) => s.id !== id);
    return this.skills.length < initialLen;
  }

  async reorderSkills(updates: { id: string; category: string; order: number }[]): Promise<void> {
    updates.forEach((u) => {
      const s = this.skills.find((sk) => sk.id === u.id);
      if (s) {
        s.category = u.category;
        s.order = u.order;
      }
    });
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return this.testimonials;
  }

  async getTestimonial(id: string): Promise<Testimonial | undefined> {
    return this.testimonials.find((t) => t.id === id);
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const newT = {
      ...testimonial,
      id: `t-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVisible: testimonial.isVisible ?? true,
      order: testimonial.order ?? 0,
      rating: testimonial.rating ?? 5,
      role: testimonial.role ?? null,
      company: testimonial.company ?? null,
      avatarUrl: testimonial.avatarUrl ?? null,
    } as Testimonial;
    this.testimonials.push(newT);
    return newT;
  }

  async updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const index = this.testimonials.findIndex((t) => t.id === id);
    if (index === -1) return undefined;
    this.testimonials[index] = { ...this.testimonials[index], ...testimonial, updatedAt: new Date() } as Testimonial;
    return this.testimonials[index];
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const initialLen = this.testimonials.length;
    this.testimonials = this.testimonials.filter((t) => t.id !== id);
    return this.testimonials.length < initialLen;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return this.contactMessages;
  }

  async getContactMessage(id: string): Promise<ContactMessage | undefined> {
    return this.contactMessages.find((m) => m.id === id);
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const newM = {
      ...message,
      id: `m-${Date.now()}`,
      createdAt: new Date(),
      read: false,
      starred: false,
    } as ContactMessage;
    this.contactMessages.push(newM);
    return newM;
  }

  async markMessageAsRead(id: string): Promise<boolean> {
    const m = this.contactMessages.find((msg) => msg.id === id);
    if (m) {
      m.read = true;
      return true;
    }
    return false;
  }

  async toggleMessageStarred(id: string, starred: boolean): Promise<boolean> {
    const m = this.contactMessages.find((msg) => msg.id === id);
    if (m) {
      m.starred = starred;
      return true;
    }
    return false;
  }

  async deleteContactMessage(id: string): Promise<boolean> {
    const initialLen = this.contactMessages.length;
    this.contactMessages = this.contactMessages.filter((m) => m.id !== id);
    return this.contactMessages.length < initialLen;
  }

  async getAboutInfo(): Promise<AboutInfo | undefined> {
    return this.about;
  }

  async updateAboutInfo(info: InsertAboutInfo): Promise<AboutInfo> {
    this.about = { ...this.about, ...info, updatedAt: new Date() } as AboutInfo;
    return this.about;
  }

  async getExperiences(): Promise<Experience[]> {
    return this.experiences;
  }

  async getExperience(id: string): Promise<Experience | undefined> {
    return this.experiences.find((e) => e.id === id);
  }

  async createExperience(exp: InsertExperience): Promise<Experience> {
    const newE = {
      ...exp,
      id: `e-${Date.now()}`,
      order: exp.order ?? 0,
      createdAt: new Date(),
    } as Experience;
    this.experiences.push(newE);
    return newE;
  }

  async updateExperience(id: string, exp: Partial<InsertExperience>): Promise<Experience | undefined> {
    const index = this.experiences.findIndex((e) => e.id === id);
    if (index === -1) return undefined;
    this.experiences[index] = { ...this.experiences[index], ...exp } as Experience;
    return this.experiences[index];
  }

  async deleteExperience(id: string): Promise<boolean> {
    const initialLen = this.experiences.length;
    this.experiences = this.experiences.filter((e) => e.id !== id);
    return this.experiences.length < initialLen;
  }

  async reorderExperiences(updates: { id: string; order: number }[]): Promise<void> {
    updates.forEach((u) => {
      const e = this.experiences.find((ex) => ex.id === u.id);
      if (e) e.order = u.order;
    });
  }
}

// Export storage instance based on configuration
export let storage: IStorage;

if (config.database.storageType === "mock") {
  storage = new MockStorage();
  console.log("✅ Using Mock Storage (In-Memory)");
} else {
  storage = new DbStorage();
  console.log("✅ Using Database Storage (PostgreSQL)");
}

import { z } from "zod";
import type { Express } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../middleware/auth";
import { insertExperienceSchema } from "@shared";
import { fromError } from "zod-validation-error";

const reorderSchema = z.object({
  entries: z.array(
    z.object({
      id: z.string().uuid(),
      order: z.number().int().min(0),
    })
  ).min(1),
});

export function registerExperienceRoutes(app: Express) {
  app.get("/api/experience", async (req, res) => {
    try {
      const entries = await storage.getExperiences();
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/experience", isAuthenticated, async (req, res) => {
    try {
      const validated = insertExperienceSchema.parse(req.body);
      const entry = await storage.createExperience(validated);
      res.status(201).json(entry);
    } catch (error: any) {
      const validationError = fromError(error);
      res.status(400).json({ error: validationError.toString() });
    }
  });

  app.put("/api/experience/:id", isAuthenticated, async (req, res) => {
    try {
      const validated = insertExperienceSchema.partial().parse(req.body);
      const entry = await storage.updateExperience(req.params.id, validated);
      if (!entry) {
        return res.status(404).json({ error: "Experience entry not found" });
      }
      res.json(entry);
    } catch (error: any) {
      const validationError = fromError(error);
      res.status(400).json({ error: validationError.toString() });
    }
  });

  app.delete("/api/experience/:id", isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteExperience(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Experience entry not found" });
      }
      res.json({ message: "Experience entry deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/experience/reorder", isAuthenticated, async (req, res) => {
    try {
      const { entries } = reorderSchema.parse(req.body);
      await storage.reorderExperiences(entries);
      res.json({ message: "Reordered successfully" });
    } catch (error: any) {
      const validationError = fromError(error);
      res.status(400).json({ error: validationError.toString() });
    }
  });
}

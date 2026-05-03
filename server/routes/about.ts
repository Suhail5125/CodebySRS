import type { Express } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../middleware/auth";
import { insertAboutInfoSchema } from "@shared";
import { fromError } from "zod-validation-error";

export function registerAboutRoutes(app: Express) {
  // Public routes - Get about info
  app.get("/api/about", async (req, res) => {
    try {
      const info = await storage.getAboutInfo();
      res.json(info ?? null);
    } catch (error: any) {
      console.error('Error fetching about info:', error); // Debug log
      res.status(500).json({ error: error.message });
    }
  });

  // Protected routes - Update about info (admin only)
  app.put("/api/about", isAuthenticated, async (req, res) => {
    try {
      const validated = insertAboutInfoSchema.parse(req.body);
      const info = await storage.updateAboutInfo(validated);
      res.json(info);
    } catch (error: any) {
      const validationError = fromError(error);
      res.status(400).json({ error: validationError.toString() });
    }
  });
}

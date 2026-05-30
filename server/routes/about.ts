import type { Express } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../middleware/auth";
import { uploadResume } from "../middleware/upload";
import { insertAboutInfoSchema } from "@shared";
import { fromError } from "zod-validation-error";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  // Resume upload endpoint
  app.post("/api/upload/resume", isAuthenticated, uploadResume.single('resume'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      const resumeUrl = `/uploads/${req.file.filename}`;
      res.json({ resumeUrl });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete resume endpoint
  app.delete("/api/resume", isAuthenticated, async (req, res) => {
    try {
      const { resumeUrl } = req.body;
      
      if (!resumeUrl) {
        return res.status(400).json({ error: "Resume URL is required" });
      }

      // Extract filename from URL
      const filename = resumeUrl.split('/').pop();
      if (!filename) {
        return res.status(400).json({ error: "Invalid resume URL" });
      }

      // Delete the file from uploads directory
      const filePath = path.join(__dirname, '..', '..', 'uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Update about info to remove resume URL
      const aboutInfo = await storage.getAboutInfo();
      if (aboutInfo) {
        await storage.updateAboutInfo({ ...aboutInfo, resumeUrl: "" });
      }

      res.json({ message: "Resume deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}

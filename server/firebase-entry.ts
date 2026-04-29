/**
 * Firebase Cloud Functions Entry Point
 * 
 * This wraps the existing Express application as a Firebase Cloud Function.
 * Firebase Hosting routes /api/** requests to this function,
 * while serving the React frontend as static files.
 */
import { onRequest } from "firebase-functions/v2/https";
import express, { type Request, Response, NextFunction } from "express";
import { config } from "./config";
import { setupAuth } from "./middleware/auth";
import { setupSecurity } from "./middleware/security";
import { registerAllRoutes } from "./routes/index";
import { logger } from "./logger";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app (same setup as server/index.ts but without listen())
const app = express();

// Trust Firebase/Google Cloud proxy so rate limiting uses real client IPs
app.set('trust proxy', true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      logger.info(logLine);
    }
  });

  next();
});

// Setup security middleware (CORS, headers, rate limiting)
setupSecurity(app);

// Setup authentication middleware
setupAuth(app);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Register all API routes
registerAllRoutes(app);

// Error handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  logger.error('Request error', {
    method: req.method,
    path: req.path,
    status,
    message: err.message,
    stack: err.stack,
    user: req.user ? (req.user as any).id : 'anonymous'
  });

  res.status(status).json({ message });
});

// Export the Express app as a Firebase Cloud Function (Gen 2)
export const api = onRequest(
  {
    region: "us-central1",
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  app
);

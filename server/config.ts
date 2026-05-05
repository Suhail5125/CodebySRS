import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * Server configuration interface
 */
interface ServerConfig {
  port: number;
  nodeEnv: "development" | "production" | "test";
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

/**
 * Database configuration interface
 */
interface DatabaseConfig {
  url?: string;
  storageType: "db" | "mock";
}

/**
 * Session configuration interface
 */
interface SessionConfig {
  secret: string;
  maxAge: number;
  checkPeriod: number;
}

/**
 * Security configuration interface
 */
interface SecurityConfig {
  corsOrigin: string;
  rateLimitWindow: number;
  rateLimitMax: number;
}

/**
 * Upload configuration interface
 */
interface UploadConfig {
  uploadDir: string;
  maxFileSize: number;
  allowedTypes: RegExp;
}

/**
 * Complete application configuration interface
 */
export interface Config {
  server: ServerConfig;
  database: DatabaseConfig;
  session: SessionConfig;
  security: SecurityConfig;
  upload: UploadConfig;
}

/**
 * Configuration error class for missing or invalid environment variables
 */
export class ConfigurationError extends Error {
  constructor(missingVars: string[]) {
    super(`Missing required environment variables: ${missingVars.join(", ")}`);
    this.name = "ConfigurationError";
  }
}

/**
 * Validates that all required configuration values are present
 * @param config - Partial configuration object to validate
 * @throws {ConfigurationError} If required variables are missing
 */
export function validateConfig(config: Partial<Config>): void {
  const missingVars: string[] = [];

  // Check required database configuration
  if (!config.database?.url) {
    missingVars.push("DATABASE_URL");
  }

  // Check required session configuration in production
  if (config.server?.isProduction) {
    if (!config.session?.secret || config.session.secret === "your-super-secret-session-key-change-this-in-production") {
      missingVars.push("SESSION_SECRET (must be changed from default in production)");
    }
    
    // Ensure session secret is strong enough in production
    if (config.session?.secret && config.session.secret.length < 32) {
      missingVars.push("SESSION_SECRET (must be at least 32 characters long)");
    }
  }

  if (missingVars.length > 0) {
    throw new ConfigurationError(missingVars);
  }
}

/**
 * Loads and parses environment variables into a typed configuration object
 * @returns {Config} Complete application configuration
 * @throws {ConfigurationError} If required variables are missing or invalid
 */
export function loadConfig(): Config {
  const nodeEnv = (process.env.NODE_ENV || "development") as "development" | "production" | "test";
  
  const config: Config = {
    server: {
      port: parseInt(process.env.PORT || "5000", 10),
      nodeEnv,
      isDevelopment: nodeEnv === "development",
      isProduction: nodeEnv === "production",
      isTest: nodeEnv === "test",
    },
    database: {
      url: process.env.DATABASE_URL || "postgresql://localhost:5432/portfolio",
    },
    session: {
      secret: process.env.SESSION_SECRET || "your-super-secret-session-key-change-this-in-production",
      maxAge: parseInt(process.env.SESSION_MAX_AGE || "86400000", 10), // 24 hours default
      checkPeriod: parseInt(process.env.SESSION_CHECK_PERIOD || "86400000", 10), // 24 hours default
    },
    security: {
      corsOrigin: process.env.CORS_ORIGIN || "*",
      rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || "900000", 10), // 15 minutes default
      rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "100", 10), // 100 requests default
    },
    upload: {
      uploadDir: process.env.UPLOAD_DIR || "uploads",
      maxFileSize: parseInt(process.env.UPLOAD_MAX_FILE_SIZE || "5242880", 10), // 5MB default
      allowedTypes: /jpeg|jpg|png|gif|webp/,
    },
  };

  // Validate configuration
  validateConfig(config);

  return config;
}

/**
 * Exported configuration object for use throughout the application
 * This is loaded once at startup and cached
 */
export const config = loadConfig();

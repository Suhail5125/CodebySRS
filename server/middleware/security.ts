import { type Express, type Request } from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import cors from 'cors';
import { config } from '../config';
import { logger } from '../logger';

// Replit routes all requests through a proxy,
// so all requests appear to come from the same IP.
// Use X-Forwarded-For to identify real client IPs.
function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    const ip = forwarded.split(',')[0].trim();
    return ipKeyGenerator(req, ip);
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    const ip = forwarded[0].split(',')[0].trim();
    return ipKeyGenerator(req, ip);
  }
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  return ipKeyGenerator(req, ip);
}

// Security headers middleware
export function securityHeaders(app: Express) {
  app.use((req, res, next) => {
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Enable XSS protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Enforce HTTPS in production
    if (config.server.isProduction) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    
    next();
  });
}

// CORS configuration
export function setupCors(app: Express) {
  const corsOptions = {
    origin: config.security.corsOrigin,
    credentials: true,
    optionsSuccessStatus: 200
  };
  
  app.use(cors(corsOptions));
  
  logger.info('CORS configured', { origin: config.security.corsOrigin });
}

// General rate limiter for all API endpoints
export const generalRateLimiter = rateLimit({
  windowMs: config.security.rateLimitWindow,
  max: config.security.rateLimitMax,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIp,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: getClientIp(req),
      path: req.path,
      method: req.method
    });
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later'
    });
  }
});

// Strict rate limiter for authentication endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIp,
  skipSuccessfulRequests: true, // Don't count successful logins
  handler: (req, res) => {
    logger.warn('Auth rate limit exceeded', {
      ip: getClientIp(req),
      path: req.path,
      username: req.body?.username
    });
    res.status(429).json({
      error: 'Too many login attempts, please try again later'
    });
  }
});

// Rate limiter for contact form
export const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // 30 submissions per hour
  message: 'Too many contact form submissions, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIp,
  handler: (req, res) => {
    logger.warn('Contact form rate limit exceeded', {
      ip: getClientIp(req),
      email: req.body?.email
    });
    res.status(429).json({
      error: 'Too many contact form submissions, please try again later'
    });
  }
});

// Setup all security middleware
export function setupSecurity(app: Express) {
  // Apply CORS
  setupCors(app);
  
  // Apply security headers
  securityHeaders(app);
  
  // Apply general rate limiting to all API routes
  app.use('/api', generalRateLimiter);
  
  logger.info('Security middleware configured');
}

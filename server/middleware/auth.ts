import { type Express, type Request, type Response, type NextFunction } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import session from "express-session";
import MemoryStore from "memorystore";
import { storage } from "../storage";
import { config } from "../config";
import { logger } from "../logger";

const SessionStore = MemoryStore(session);

// Configure passport
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        logger.warn('Failed login attempt - user not found', { username });
        return done(null, false, { message: "Incorrect username" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        logger.warn('Failed login attempt - invalid password', { username, userId: user.id });
        return done(null, false, { message: "Incorrect password" });
      }

      logger.info('Successful login', { username, userId: user.id });
      return done(null, user);
    } catch (error) {
      logger.error('Login error', { username, error });
      return done(error);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Middleware to check if user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

// Setup authentication middleware
export function setupAuth(app: Express) {
  // Session configuration using centralized config
  // Config validation ensures SESSION_SECRET is present and secure
  app.use(
    session({
      name: "__session", // Required for Firebase Hosting to preserve the cookie
      secret: config.session.secret,
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({
        checkPeriod: config.session.checkPeriod,
      }),
      cookie: {
        maxAge: config.session.maxAge,
        httpOnly: true,
        secure: config.server.isProduction,
        sameSite: "lax", // Changed from "strict" to "lax" for better compatibility
      },
      proxy: config.server.isProduction, // Trust proxy in production (Railway uses proxies)
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
}

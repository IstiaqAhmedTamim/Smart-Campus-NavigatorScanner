import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import MemoryStore from "memorystore";

const scryptAsync = promisify(scrypt);

// --- Password Hashing Helpers ---
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// --- Auth Middleware ---
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // --- Session & Passport Setup ---
  const SessionStore = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "smart-campus-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 86400000 },
      store: new SessionStore({ checkPeriod: 86400000 }),
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      { usernameField: "studentId" },
      async (studentId, password, done) => {
        try {
          const user = await storage.getUserByStudentId(studentId);
          if (!user || !(await comparePasswords(password, user.password))) {
            return done(null, false, { message: "Invalid credentials" });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // --- Auth Routes ---
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existing = await storage.getUserByStudentId(input.studentId);
      if (existing) {
        return res.status(400).json({ message: "Student ID already registered" });
      }

      const hashedPassword = await hashPassword(input.password);
      const user = await storage.createUser({ ...input, password: hashedPassword });
      
      req.login(user, (err) => {
        if (err) throw err;
        res.status(201).json(user);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.post(api.auth.login.path, (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Login failed" });
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(200).json(user);
      });
    })(req, res, next);
  });

  app.post(api.auth.logout.path, (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.status(200).json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, isAuthenticated, (req, res) => {
    res.json(req.user);
  });

  // --- Location Routes ---
  app.get(api.locations.list.path, isAuthenticated, async (req, res) => {
    const locations = await storage.getLocations();
    res.json(locations);
  });

  app.get(api.locations.get.path, isAuthenticated, async (req, res) => {
    const location = await storage.getLocation(Number(req.params.id));
    if (!location) return res.status(404).json({ message: "Location not found" });
    res.json(location);
  });

  app.get(api.locations.recommend.path, isAuthenticated, async (req, res) => {
    const location = await storage.getBestLocation();
    if (!location) return res.status(404).json({ message: "No locations available" });
    res.json(location);
  });

  // --- Scan Routes ---
  app.post(api.scans.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.scans.create.input.parse(req.body);
      const location = await storage.getLocationByQrCode(input.qrCode);
      
      if (!location) {
        return res.status(404).json({ message: "Invalid QR Code" });
      }

      // Record scan
      await storage.createScan({
        userId: (req.user as any).id,
        locationId: location.id,
        type: input.type,
      });

      // Update crowd count
      const increment = input.type === 'entry' ? 1 : -1;
      const updatedLocation = await storage.updateLocationCount(location.id, increment);

      res.json({ message: "Scan successful", location: updatedLocation });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // --- Seed Data ---
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getLocations();
  if (existing.length === 0) {
    const locations = [
      { name: "Library", capacity: 100, qrCode: "LIB_01", description: "Main Campus Library" },
      { name: "Cafeteria", capacity: 60, qrCode: "CAF_01", description: "Central Cafeteria" },
      { name: "Study Room", capacity: 40, qrCode: "STD_01", description: "Quiet Study Area" },
      { name: "Computer Lab", capacity: 30, qrCode: "LAB_01", description: "CS Department Lab" },
      { name: "Gym", capacity: 50, qrCode: "GYM_01", description: "Campus Gym" }
    ];

    for (const loc of locations) {
      await storage.createLocation(loc);
    }
    
    // Create a demo admin user
    const adminExists = await storage.getUserByStudentId("0112310000");
    if (!adminExists) {
      const hashedPassword = await hashPassword("admin123");
      await storage.createUser({
        studentId: "0112310000",
        email: "admin@uiu.ac.bd",
        password: hashedPassword,
        role: "admin"
      });
    }
  }
}

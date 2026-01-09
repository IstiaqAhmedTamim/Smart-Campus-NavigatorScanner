import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  studentId: text("student_id").notNull().unique(), // Acts as username
  email: text("email").notNull(),
  password: text("password").notNull(),
  role: text("role").default("student").notNull(), // 'student' or 'admin'
});

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g., Library, Cafeteria
  qrCode: text("qr_code").notNull().unique(), // The content of the QR code
  capacity: integer("capacity").notNull(),
  currentCount: integer("current_count").default(0).notNull(),
  description: text("description"),
});

export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Foreign key to users
  locationId: integer("location_id").notNull(), // Foreign key to locations
  type: text("type").notNull(), // 'entry' or 'exit'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// === SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertLocationSchema = createInsertSchema(locations).omit({ id: true, currentCount: true });
export const insertScanSchema = createInsertSchema(scans).omit({ id: true, timestamp: true });

// === EXPLICIT API TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

export type Scan = typeof scans.$inferSelect;
export type InsertScan = z.infer<typeof insertScanSchema>;

export type LoginRequest = {
  studentId: string;
  password: string;
};

export type ScanRequest = {
  qrCode: string;
  type: 'entry' | 'exit';
};

export type LocationStats = Location & {
  status: 'low' | 'medium' | 'high';
  percentage: number;
};

// === ENUMS ===
export const CROWD_LEVELS = {
  LOW: 50,
  MEDIUM: 80,
};

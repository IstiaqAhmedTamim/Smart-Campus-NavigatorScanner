import { db } from "./db";
import {
  users, locations, scans,
  type User, type InsertUser,
  type Location, type InsertLocation,
  type Scan, type InsertScan,
  CROWD_LEVELS,
  type LocationStats
} from "@shared/schema";
import { eq, sql, desc, asc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByStudentId(studentId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Locations
  getLocations(): Promise<LocationStats[]>;
  getLocation(id: number): Promise<LocationStats | undefined>;
  getLocationByQrCode(qrCode: string): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
  updateLocationCount(id: number, increment: number): Promise<Location>;
  
  // Scans
  createScan(scan: InsertScan): Promise<Scan>;
  
  // Recommendations
  getBestLocation(): Promise<LocationStats | undefined>;
}

export class DatabaseStorage implements IStorage {
  
  private calculateStatus(current: number, capacity: number): 'low' | 'medium' | 'high' {
    const percentage = (current / capacity) * 100;
    if (percentage < CROWD_LEVELS.LOW) return 'low';
    if (percentage < CROWD_LEVELS.MEDIUM) return 'medium';
    return 'high';
  }

  private enhanceLocation(loc: Location): LocationStats {
    const percentage = Math.round((loc.currentCount / loc.capacity) * 100);
    return {
      ...loc,
      status: this.calculateStatus(loc.currentCount, loc.capacity),
      percentage
    };
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByStudentId(studentId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.studentId, studentId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Locations
  async getLocations(): Promise<LocationStats[]> {
    const locs = await db.select().from(locations).orderBy(locations.id);
    return locs.map(l => this.enhanceLocation(l));
  }

  async getLocation(id: number): Promise<LocationStats | undefined> {
    const [loc] = await db.select().from(locations).where(eq(locations.id, id));
    return loc ? this.enhanceLocation(loc) : undefined;
  }

  async getLocationByQrCode(qrCode: string): Promise<Location | undefined> {
    const [loc] = await db.select().from(locations).where(eq(locations.qrCode, qrCode));
    return loc;
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const [loc] = await db.insert(locations).values(insertLocation).returning();
    return loc;
  }

  async updateLocationCount(id: number, increment: number): Promise<Location> {
    // Transaction safe update would be better, but for lite build simple increment is okay
    // We fetch first to ensure we don't go below 0 or above capacity (optional but good)
    const [loc] = await db.select().from(locations).where(eq(locations.id, id));
    if (!loc) throw new Error("Location not found");

    let newCount = loc.currentCount + increment;
    if (newCount < 0) newCount = 0;
    // We allow over capacity tracking

    const [updated] = await db.update(locations)
      .set({ currentCount: newCount })
      .where(eq(locations.id, id))
      .returning();
    return updated;
  }

  // Scans
  async createScan(insertScan: InsertScan): Promise<Scan> {
    const [scan] = await db.insert(scans).values(insertScan).returning();
    return scan;
  }

  // Recommendations
  async getBestLocation(): Promise<LocationStats | undefined> {
    // Simple logic: lowest percentage
    const locs = await this.getLocations();
    return locs.sort((a, b) => a.percentage - b.percentage)[0];
  }
}

export const storage = new DatabaseStorage();

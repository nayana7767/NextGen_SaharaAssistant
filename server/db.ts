import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, lawyers, complaints, chatMessages, caseFollowUps } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Lawyer queries
export async function getAllLawyers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(lawyers);
}

export async function getLawyersByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(lawyers).where(eq(lawyers.category, category as any));
}

export async function getLawyerById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(lawyers).where(eq(lawyers.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Chat message queries
export async function saveChatMessage(userId: number, role: "user" | "assistant", content: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(chatMessages).values({ userId, role, content });
  return result;
}

export async function getChatHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(chatMessages).where(eq(chatMessages.userId, userId));
}

// Complaint queries
export async function createComplaint(complaint: any) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(complaints).values(complaint);
  return result;
}

export async function getUserComplaints(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(complaints).where(eq(complaints.userId, userId));
}

export async function getComplaintById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(complaints).where(eq(complaints.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Case follow-up queries
export async function saveCaseFollowUp(userId: number, role: "user" | "assistant", content: string, complaintId?: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(caseFollowUps).values({ userId, role, content, complaintId });
  return result;
}

export async function getCaseFollowUps(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(caseFollowUps).where(eq(caseFollowUps.userId, userId));
}

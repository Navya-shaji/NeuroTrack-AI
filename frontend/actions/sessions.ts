"use server";

import { z } from "zod";
import connectDB from "@/lib/db";
import { Session } from "@/models/Session";
import { requireAuth } from "@/actions/auth";
import "@/models/User";

export interface SessionData {
  _id: string;
  title: string;
  subject: string;
  duration: number;
  date: string;
  notes?: string;
  userId: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SessionActionResult {
  error?: string;
  session?: SessionData;
}

const createSessionSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  subject: z.string().min(1, "Subject is required").max(50, "Subject too long"),
  duration: z.number().min(1, "Minimum 1 minute").max(1440, "Maximum 24 hours"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  notes: z.string().max(2000, "Notes too long").optional(),
});

const updateSessionSchema = createSessionSchema.partial();

interface SessionDocument {
  _id: { toString(): string };
  title: string;
  subject: string;
  duration: number;
  date: Date | string;
  notes?: string;
  userId: { toString(): string };
  completed: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

function serializeSession(doc: SessionDocument): SessionData {
  return {
    _id: doc._id.toString(),
    title: doc.title,
    subject: doc.subject,
    duration: doc.duration,
    date: doc.date instanceof Date ? doc.date.toISOString() : doc.date,
    notes: doc.notes,
    userId: doc.userId.toString(),
    completed: doc.completed ?? false,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : doc.updatedAt,
  };
}

export async function getSessions(): Promise<SessionData[]> {
  const user = await requireAuth();
  await connectDB();
  const sessions = await Session.find({ userId: user.id }).sort({ date: -1 }).lean();
  return sessions.map(serializeSession);
}

export async function createSession(
  data: z.infer<typeof createSessionSchema>
): Promise<SessionActionResult> {
  try {
    const user = await requireAuth();
    const parsed = createSessionSchema.safeParse(data);
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    await connectDB();
    const session = await Session.create({ ...parsed.data, userId: user.id, completed: false });
    return { session: serializeSession(session.toObject()) };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { error: error.message || "Failed to create session" };
  }
}

export async function updateSession(
  id: string,
  data: z.infer<typeof updateSessionSchema>
): Promise<SessionActionResult> {
  try {
    const user = await requireAuth();
    const parsed = updateSessionSchema.safeParse(data);
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    await connectDB();
    const session = await Session.findOneAndUpdate(
      { _id: id, userId: user.id },
      { $set: parsed.data },
      { new: true }
    ).lean();
    if (!session) return { error: "Session not found" };
    return { session: serializeSession(session) };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { error: error.message || "Failed to update session" };
  }
}

export async function toggleSessionComplete(id: string): Promise<SessionActionResult> {
  try {
    const user = await requireAuth();
    await connectDB();
    const existing = await Session.findOne({ _id: id, userId: user.id });
    if (!existing) return { error: "Session not found" };
    const session = await Session.findOneAndUpdate(
      { _id: id, userId: user.id },
      { $set: { completed: !existing.completed } },
      { new: true }
    ).lean();
    if (!session) return { error: "Session not found" };
    return { session: serializeSession(session) };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { error: error.message || "Failed to update session" };
  }
}

export async function deleteSession(id: string): Promise<{ error?: string }> {
  try {
    const user = await requireAuth();
    await connectDB();
    const session = await Session.findOneAndDelete({ _id: id, userId: user.id });
    if (!session) return { error: "Session not found" };
    return {};
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { error: error.message || "Failed to delete session" };
  }
}

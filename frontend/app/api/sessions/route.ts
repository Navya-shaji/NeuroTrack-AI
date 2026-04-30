import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import "@/models/User"; // Ensure User model is registered
import { Session } from "@/models/Session";
import { decrypt } from "@/lib/auth";
import { z } from "zod";
import { cookies } from "next/headers";

const sessionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  date: z.string().or(z.date()),
  notes: z.string().optional(),
});

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const payload = await decrypt(token);
    if (!payload) return null;

    let rawId = payload.id || payload.userId || payload._id;
    
    if (rawId) {
      if (typeof rawId === 'object' && (rawId.buffer || rawId.id)) {
        console.warn("Legacy BSON object found in token, clearing cookie.");
        // We can't easily clear cookies inside a nested function in Next.js 15
        // but we can mark the payload as "expired"
        return { expired: true };
      }
      payload.id = rawId.toString();
    }
    
    if (payload.id === "[object Object]") return { expired: true };
    
    return payload;
  } catch (err) {
    console.error("Auth Decryption Error:", err);
    return null;
  }
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user || user.expired) {
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      if (user?.expired) {
        response.cookies.set("token", "", { expires: new Date(0), path: "/" });
      }
      return response;
    }

    await connectDB();
    const sessions = await Session.find({ userId: user.id }).sort({ date: -1 });

    return NextResponse.json(sessions, { status: 200 });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user || user.expired) {
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      if (user?.expired) {
        response.cookies.set("token", "", { expires: new Date(0), path: "/" });
      }
      return response;
    }

    const body = await req.json();
    const parsed = sessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    await connectDB();
    const session = await Session.create({
      ...parsed.data,
      userId: user.id,
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error: any) {
    console.error("API Error (POST):", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

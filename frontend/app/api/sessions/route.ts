import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
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
    return await decrypt(token);
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const sessions = await Session.find({ userId: user.id }).sort({ date: -1 });

    return NextResponse.json(sessions, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

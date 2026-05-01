import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import "@/models/User"; // Ensure User model is registered
import { Session } from "@/models/Session";
import { decrypt } from "@/lib/auth";
import { z } from "zod";
import { cookies } from "next/headers";

const sessionSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  subject: z.string().min(1, "Subject is required").optional(),
  duration: z.number().min(1, "Duration must be at least 1 minute").optional(),
  date: z.string().or(z.date()).optional(),
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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = sessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    await connectDB();
    const session = await Session.findOneAndUpdate(
      { _id: id, userId: user.id },
      { $set: parsed.data },
      { new: true }
    );

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(session, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const session = await Session.findOneAndDelete({ _id: id, userId: user.id });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Session deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

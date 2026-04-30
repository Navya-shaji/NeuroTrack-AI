import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import connectDB from "@/lib/db";
import { Session } from "@/models/Session";
import { decrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import "@/models/User";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

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

export async function POST() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ error: "AI configuration missing (GOOGLE_API_KEY is not set in environment variables)" }, { status: 500 });
    }

    await connectDB();
    const sessions = await Session.find({ userId: user.id }).sort({ date: -1 }).limit(10);

    if (sessions.length === 0) {
      return NextResponse.json({ 
        suggestion: "You haven't logged any study sessions yet! Start by adding your first session to get personalized AI insights."
      });
    }

    const sessionData = sessions.map(s => `- ${s.subject}: ${s.title} (${s.duration} mins)${s.notes ? ` - Notes: ${s.notes}` : ''}`).join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an AI Study Assistant for NeuroTrack AI. 
      Based on the following recent study sessions, provide a concise summary of the user's progress and suggest 3 specific next topics or areas of focus to optimize their learning.
      Keep it encouraging and professional.
      
      Recent Sessions:
      ${sessionData}
      
      Response format:
      Return the response in a clean, readable format with a 'Summary' section and a 'Suggestions' section. Use Markdown for formatting (bold, lists).
    `;

    const result = await model.generateContent(prompt);
    const resultResponse = await result.response;
    const text = resultResponse.text();

    return NextResponse.json({ suggestion: text });
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate AI insights" }, { status: 500 });
  }
}

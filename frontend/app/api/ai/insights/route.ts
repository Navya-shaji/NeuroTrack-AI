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

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ 
        error: "AI configuration missing. Please add GOOGLE_API_KEY to your .env.local file." 
      }, { status: 500 });
    }

    const { action, notes, sessionId } = await req.json().catch(() => ({}));

    await connectDB();

    // Action: Summarize Notes
    if (action === "summarize" && notes) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        Summarize the following study notes concisely into key bullet points. 
        Keep it professional and helpful for a student.
        
        Notes:
        ${notes}
        
        Format:
        Return only the summary in Markdown bullet points.
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return NextResponse.json({ summary: text });
    }

    // Action: Generate Insights (default)
    const sessions = await Session.find({ userId: user.id }).sort({ date: -1 }).limit(10);

    if (sessions.length === 0) {
      return NextResponse.json({ 
        insight: "You haven't logged any study sessions yet! Start by adding your first session to get personalized AI insights."
      });
    }

    const sessionData = sessions.map(s => `- ${s.subject}: ${s.title} (${s.duration} mins)${s.notes ? ` - Notes: ${s.notes}` : ''}`).join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an AI Study Assistant for NeuroTrack AI. 
      Based on the following recent study sessions, provide a comprehensive yet concise analysis of the user's study habits.
      
      Tasks:
      1. Analyze their progress and identify strengths.
      2. Identify potential gaps or areas for improvement.
      3. Suggest 3 specific, actionable next topics or study techniques.
      
      Recent Sessions:
      ${sessionData}
      
      Response format:
      Return the response in clean Markdown. Use clear headings (e.g., ## Progress Analysis, ## Suggestions). 
      Make it look premium and encouraging.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ insight: text });
  } catch (error: any) {
    console.error("AI Insights Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process AI request" }, { status: 500 });
  }
}

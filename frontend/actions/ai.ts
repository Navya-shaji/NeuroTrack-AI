"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import connectDB from "@/lib/db";
import { Session } from "@/models/Session";
import { requireAuth } from "@/actions/auth";
import "@/models/User";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGenAI(): GoogleGenerativeAI {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) throw new Error("GOOGLE_API_KEY is not set. Add it to your .env.local file.");
  return new GoogleGenerativeAI(key);
}

async function generateText(prompt: string): Promise<string> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// ─── Generate Insights ────────────────────────────────────────────────────────

export async function generateInsights(): Promise<{ insight?: string; error?: string }> {
  try {
    const user = await requireAuth();
    await connectDB();

    const sessions = await Session.find({ userId: user.id })
      .sort({ date: -1 })
      .limit(10)
      .lean();

    if (sessions.length === 0) {
      return {
        insight: "You haven't logged any study sessions yet! Start by adding your first session to get personalized AI insights.",
      };
    }

    const sessionData = sessions
      .map((s) => `- ${s.subject}: ${s.title} (${s.duration} mins)${s.notes ? ` — Notes: ${s.notes}` : ""}`)
      .join("\n");

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
Return the response in clean Markdown. Use clear headings (## Progress Analysis, ## Areas to Improve, ## Suggestions).
Keep it encouraging and professional.
    `.trim();

    const insight = await generateText(prompt);
    return { insight };
  } catch (err: any) {
    console.error("Generate Insights Error:", err);
    return { error: err.message || "Failed to generate insights" };
  }
}

// ─── Summarize Notes ──────────────────────────────────────────────────────────

export async function summarizeNotes(notes: string): Promise<{ summary?: string; error?: string }> {
  try {
    await requireAuth();

    if (!notes?.trim()) return { error: "No notes provided" };

    const prompt = `
Summarize the following study notes concisely.
Extract the key concepts, important terms, and main takeaways.
Format the output in clean Markdown with bullet points.

Notes:
${notes}
    `.trim();

    const summary = await generateText(prompt);
    return { summary };
  } catch (err: any) {
    console.error("Summarize Notes Error:", err);
    return { error: err.message || "Failed to summarize notes" };
  }
}

// ─── Get Study Suggestion ─────────────────────────────────────────────────────

export async function getStudySuggestion(): Promise<{ suggestion?: string; error?: string }> {
  try {
    const user = await requireAuth();
    await connectDB();

    const sessions = await Session.find({ userId: user.id })
      .sort({ date: -1 })
      .limit(10)
      .lean();

    if (sessions.length === 0) {
      return {
        suggestion: "You haven't logged any study sessions yet! Start by adding your first session to get personalized suggestions.",
      };
    }

    const sessionData = sessions
      .map((s) => `- ${s.subject}: ${s.title} (${s.duration} mins)${s.notes ? ` — Notes: ${s.notes}` : ""}`)
      .join("\n");

    const prompt = `
You are an AI Study Assistant for NeuroTrack AI.
Based on the following recent study sessions, provide a concise summary of the user's progress and suggest 3 specific next topics or areas of focus to optimize their learning.
Keep it encouraging and professional.

Recent Sessions:
${sessionData}

Response format:
Return the response in clean Markdown with a '## Summary' section and a '## Suggestions' section.
    `.trim();

    const suggestion = await generateText(prompt);
    return { suggestion };
  } catch (err: any) {
    console.error("Get Study Suggestion Error:", err);
    return { error: err.message || "Failed to generate suggestion" };
  }
}

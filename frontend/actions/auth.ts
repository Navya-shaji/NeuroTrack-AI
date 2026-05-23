"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { encrypt, decrypt } from "@/lib/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

export interface ActionResult {
  error?: string;
  success?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
    sameSite: "lax",
  });
}

async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}

// ─── Get Current User ─────────────────────────────────────────────────────────

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const payload = await decrypt(token);
    if (!payload?.id) return null;

    await connectDB();
    const user = await User.findById(payload.id).select("-password").lean();
    if (!user) return null;

    return {
      _id: (user._id as any).toString(),
      name: user.name,
      email: user.email,
      image: user.image,
    };
  } catch {
    return null;
  }
}

// ─── Sign Up ──────────────────────────────────────────────────────────────────

export async function signUp(
  name: string,
  email: string,
  password: string
): Promise<ActionResult> {
  try {
    if (!name || !email || !password) {
      return { error: "All fields are required" };
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters" };
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return { error: "An account with this email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = await encrypt({ id: user._id.toString(), email: user.email });
    await setAuthCookie(token);

    return { success: true };
  } catch (err: any) {
    console.error("SignUp Error:", err);
    return { error: err.message || "Something went wrong" };
  }
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(
  email: string,
  password: string
): Promise<ActionResult> {
  try {
    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !user.password) {
      return { error: "Invalid credentials" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: "Invalid credentials" };
    }

    const token = await encrypt({ id: user._id.toString(), email: user.email });
    await setAuthCookie(token);

    return { success: true };
  } catch (err: any) {
    console.error("Login Error:", err);
    return { error: err.message || "Something went wrong" };
  }
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  await clearAuthCookie();
  redirect("/login");
}

// ─── Require Auth (for server components / actions) ───────────────────────────

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

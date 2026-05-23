"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface ActionResult {
  error?: string;
  success?: boolean;
}

// ─── Get Current User ─────────────────────────────────────────────────────────

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return null;
    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
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
    await auth.api.signUpEmail({
      body: { name, email, password },
      headers: await headers(),
    });
    return { success: true };
  } catch (err: any) {
    const message =
      err?.body?.message || err?.message || "Something went wrong";
    return { error: message };
  }
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(
  email: string,
  password: string
): Promise<ActionResult> {
  try {
    await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });
    return { success: true };
  } catch (err: any) {
    const message =
      err?.body?.message || err?.message || "Invalid credentials";
    return { error: message };
  }
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  await auth.api.signOut({ headers: await headers() });
  redirect("/login");
}

// ─── Require Auth ─────────────────────────────────────────────────────────────

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

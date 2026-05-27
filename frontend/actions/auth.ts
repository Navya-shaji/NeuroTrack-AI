"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";

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

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const session = await getAuth().api.getSession({ headers: await headers() });
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

export async function signUp(
  name: string,
  email: string,
  password: string
): Promise<ActionResult> {
  try {
    await getAuth().api.signUpEmail({
      body: { name, email, password },
      headers: await headers(),
    });
    return { success: true };
  } catch (err) {
    const error = err as { body?: { message?: string }; message?: string };
    const message = error?.body?.message || error?.message || "Something went wrong";
    return { error: message };
  }
}

export async function login(
  email: string,
  password: string
): Promise<ActionResult> {
  try {
    await getAuth().api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });
    return { success: true };
  } catch (err) {
    const error = err as { body?: { message?: string }; message?: string };
    const message = error?.body?.message || error?.message || "Invalid credentials";
    return { error: message };
  }
}

export async function logout(): Promise<void> {
  await getAuth().api.signOut({ headers: await headers() });
  redirect("/login");
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

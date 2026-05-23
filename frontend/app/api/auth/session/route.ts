import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/auth";

/**
 * Lightweight session endpoint used by client components to sync
 * user state after login/signup without a full page reload.
 */
export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}

import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import type { NextRequest } from "next/server";

// Defer getAuth() call to runtime instead of module import time
// This prevents MONGODB_URI check during build step
const handler = {
  GET: async (req: NextRequest) => {
    const { GET } = toNextJsHandler(getAuth());
    return GET(req);
  },
  POST: async (req: NextRequest) => {
    const { POST } = toNextJsHandler(getAuth());
    return POST(req);
  },
};

export const { GET, POST } = handler;

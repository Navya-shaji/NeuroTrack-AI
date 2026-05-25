import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

// ─── Lazy MongoDB client ───────────────────────────────────────────────────────
// We defer the MongoClient creation until runtime so that the build step
// (which has no MONGODB_URI) does not throw a MongoParseError.

declare global {
  var _mongoClient: MongoClient | undefined;
}

function getMongoClient(): MongoClient {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not defined. Add it to .env.local or your hosting environment variables."
    );
  }
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri);
  }
  return global._mongoClient;
}

// ─── better-auth instance ─────────────────────────────────────────────────────
// mongodbAdapter accepts a factory function so the client is only
// resolved on the first real request, not at import / build time.

const client = new Proxy({} as MongoClient, {
  get(_target, prop) {
    return Reflect.get(getMongoClient(), prop);
  },
});

const db = new Proxy({} as ReturnType<MongoClient["db"]>, {
  get(_target, prop) {
    return Reflect.get(getMongoClient().db(), prop);
  },
});

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  // ─── Email + Password ──────────────────────────────────────────────
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  // ─── Google OAuth ──────────────────────────────────────────────────
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // ─── User fields ───────────────────────────────────────────────────
  user: {
    additionalFields: {},
  },

  // ─── Next.js cookie helper (required for server actions) ───────────
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

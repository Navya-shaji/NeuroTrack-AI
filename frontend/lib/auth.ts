import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

// Reuse the MongoClient across hot-reloads in dev
const globalForMongo = global as unknown as { _mongoClient?: MongoClient };

if (!globalForMongo._mongoClient) {
  globalForMongo._mongoClient = new MongoClient(
    process.env.MONGODB_URI as string
  );
}

const client = globalForMongo._mongoClient;
const db = client.db(); // uses the database name from the connection string

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
    additionalFields: {
      // better-auth stores name + image by default; nothing extra needed
    },
  },

  // ─── Next.js cookie helper (required for server actions) ───────────
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

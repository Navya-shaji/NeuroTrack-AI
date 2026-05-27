import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

declare global {
  var _mongoClient: MongoClient | undefined;
}

function createAuth() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not defined.");

  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri);
  }

  const client = global._mongoClient;
  const db = client.db();

  return betterAuth({
    database: mongodbAdapter(db, { client }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    },
    user: {
      additionalFields: {},
    },
    plugins: [nextCookies()],
  });
}

type AuthInstance = ReturnType<typeof createAuth>;

declare global {
  var _auth: AuthInstance | undefined;
}

export function getAuth(): AuthInstance {
  if (!global._auth) {
    global._auth = createAuth();
  }
  return global._auth;
}

export type Session = AuthInstance["$Infer"]["Session"];
export type User = AuthInstance["$Infer"]["Session"]["user"];

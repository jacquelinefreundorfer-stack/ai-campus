// Standalone auth handler for serve.ts — uses direct imports (no Vite aliases)
import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./src/db/schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL not set");

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60,
    },
  },
});

export async function handleAuthRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  
  // Handle /api/auth/session specially to return a clean JSON response
  if (url.pathname === "/api/auth/session" && request.method === "GET") {
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });
      if (!session?.user) {
        return new Response(JSON.stringify({ user: null }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(
        JSON.stringify({
          user: {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch {
      return new Response(JSON.stringify({ user: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  
  // All other auth routes go through the Better Auth handler
  return auth.handler(request);
}

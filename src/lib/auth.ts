import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db as getDb } from "~/db/index";
import { users, sessions, accounts, verifications } from "~/db/schema";

// ── Better Auth instance ─────────────────────────────────────────────────────

export const auth = betterAuth({
  database: drizzleAdapter(getDb(), {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
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

// ── Helpers ──────────────────────────────────────────────────────────────────
// auth is already exported above as the configured instance

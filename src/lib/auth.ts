import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db";

/**
 * Server-side Better Auth instance — the single source of truth for sessions.
 *
 * BETTER_AUTH_SECRET and BETTER_AUTH_URL are read from the environment
 * automatically, so they are not repeated here.
 *
 * No providers are configured yet. Add them under `emailAndPassword` or
 * `socialProviders` when you build the actual sign-in flow, and run
 * `npm run auth:generate` so the matching tables exist in src/db/schema.ts.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});

export type Session = typeof auth.$Infer.Session;

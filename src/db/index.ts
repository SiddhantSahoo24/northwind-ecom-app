import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local.");
}

// neon-http speaks HTTP rather than the Postgres wire protocol, so it works in
// serverless and edge runtimes where a long-lived TCP pool cannot survive.
const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });

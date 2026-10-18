import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "./schema";

type Database = NeonHttpDatabase<typeof schema>;

let instance: Database | undefined;

function getDb(): Database {
  if (!instance) {
    const url = process.env.DATABASE_URL;

    if (!url) {
      throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local.");
    }

    // neon-http speaks HTTP rather than the Postgres wire protocol, so it works
    // in serverless and edge runtimes where a long-lived TCP pool cannot survive.
    instance = drizzle(neon(url), { schema });
  }

  return instance;
}

/**
 * Drizzle client, constructed on first use rather than on import — otherwise
 * `next build` would need a live DATABASE_URL just to collect page data.
 */
export const db = new Proxy({} as Database, {
  get: (_target, prop) => getDb()[prop as keyof Database],
});

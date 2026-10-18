import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Read by the drizzle-kit CLI only, never by the running app — so it has to load
// .env.local itself (Next does that automatically, the CLI does not).
config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});

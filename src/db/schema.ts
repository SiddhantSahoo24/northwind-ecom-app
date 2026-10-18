/**
 * Drizzle schema.
 *
 * Intentionally empty. Two kinds of tables will land here:
 *
 *   1. Auth tables (user, session, account, verification) — don't hand-write
 *      these. Generate them so they match what Better Auth expects:
 *        npm run auth:generate
 *      That writes src/db/auth-schema.ts; then re-export it from here:
 *        export * from "./auth-schema";
 *
 *   2. Your own domain tables (products, carts, orders, ...).
 *
 * After editing, create a migration with `npm run db:generate`, then apply it
 * with `npm run db:migrate`.
 */

export {};

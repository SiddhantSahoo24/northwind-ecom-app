<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Database conventions

Postgres (Neon) via Drizzle. Schema in `src/db/schema.ts`; the client is the lazy
`Proxy` exported from `src/db/index.ts` (`@/db`). The driver is
`drizzle-orm/neon-http`, which speaks HTTP, not the Postgres wire protocol — there is
no connection pool and no multi-statement transaction.

- **Naming:** snake_case column names in Postgres, camelCase keys in TypeScript.
  Always pass the column name explicitly: `integer("price_cents")`.
- **Keys:** `uuid` primary keys with `.defaultRandom()`. `slug` is the natural key the
  app actually joins and routes on, and a product's slug is also its image key in
  `src/lib/image-manifest.json` — treat slugs as stable.
- **Money:** integer cents, never floats. `priceCents`, `compareAtCents`.
- **Decimals:** `numeric(name, { precision, scale, mode: "number" })`. Without
  `mode: "number"` Drizzle returns a string.
- **Display-only arrays/objects** (spec rows, feature bullets) are `jsonb` with
  `.$type<...>()`, not child tables.
- **Extra config** is the array form, `(t) => [index(...), check(...)]`. The object
  form is the deprecated overload in drizzle-orm 0.45.
- **Derived state is not stored.** Inventory lives in its own `stock` table, 1:1 on
  `product_id`; `inStock` is computed per query as `coalesce(quantity, 0) > 0`.
  Products are LEFT joined to `stock` so a missing row reads as sold out.

### Reads

Pages never import `@/db`. Catalog access goes through `src/lib/products.ts`, whose
accessors are all `async` + `"use cache"` with an explicit `cacheLife` and a
`cacheTag` (`"categories"`, `"products"`, `` `product:${slug}` ``). Mutations should
invalidate with `updateTag`/`revalidateTag` rather than shortening a lifetime.

Because those cached accessors run during prerendering, **`next build` now requires a
reachable `DATABASE_URL`** — the lazy client in `src/db/index.ts` only defers the
connection, it does not avoid one.

### Migrations

`npm run db:generate` then `npm run db:migrate` (`drizzle.config.ts` loads
`.env.local` itself). Seed and reference data goes in a hand-written SQL migration
created with `npm run db:generate -- --custom --name=<name>`, written idempotently
(`ON CONFLICT DO NOTHING`) and resolving foreign keys by slug rather than hardcoded
uuids. Node here is v20, which cannot run TypeScript directly, so there is no `.ts`
seed script.

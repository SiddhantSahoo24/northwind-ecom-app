/**
 * Drizzle schema.
 *
 * Catalogue tables live here. Auth tables (user, session, account, verification)
 * don't belong in this file and shouldn't be hand-written — generate them so they
 * match what Better Auth expects:
 *
 *   npm run auth:generate
 *
 * That writes src/db/auth-schema.ts; then re-export it from here:
 *
 *   export * from "./auth-schema";
 *
 * After editing, create a migration with `npm run db:generate`, then apply it with
 * `npm run db:migrate`.
 */

import { relations, sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  /** Scenery image key, see src/lib/images.ts. */
  imageKey: text("image_key").notNull(),
  /** Display order for the nav, the footer and the filter bar. */
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /**
     * Also the image key: scripts/fetch-images.mjs writes
     * public/products/<slug>.webp and the matching src/lib/image-manifest.json
     * entry, so a product and its photography stay in sync by construction.
     */
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    categoryId: uuid("category_id")
      .notNull()
      // Restrict rather than cascade: deleting a category that still has products
      // should fail loudly instead of taking the products with it.
      .references(() => categories.id, { onDelete: "restrict" }),
    // Money is integer cents, never floats.
    priceCents: integer("price_cents").notNull(),
    /** Original price, when the item is marked down. */
    compareAtCents: integer("compare_at_cents"),
    // `mode: "number"` or Drizzle hands back a string.
    rating: numeric("rating", { precision: 2, scale: 1, mode: "number" })
      .notNull()
      .default(0),
    reviewCount: integer("review_count").notNull().default(0),
    blurb: text("blurb").notNull(),
    description: text("description").notNull(),
    // Display-only, always read whole, never queried into — so jsonb rather than
    // child tables.
    features: jsonb("features").$type<string[]>().notNull().default([]),
    specs: jsonb("specs")
      .$type<{ label: string; value: string }[]>()
      .notNull()
      .default([]),
    badge: text("badge"),
    /** Colourway label shown as a swatch row on the card and detail page. */
    colorway: text("colorway").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("products_category_id_idx").on(t.categoryId),
    index("products_price_cents_idx").on(t.priceCents),
    check("products_rating_range", sql`${t.rating} >= 0 and ${t.rating} <= 5`),
  ],
);

/**
 * Inventory, one row per product. `inStock` is never stored — queries derive it
 * from `coalesce(quantity, 0) > 0` over a LEFT join, so a product with no stock
 * row reads as sold out rather than disappearing from the listing.
 */
export const stock = pgTable(
  "stock",
  {
    productId: uuid("product_id")
      .primaryKey()
      .references(() => products.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check("stock_quantity_non_negative", sql`${t.quantity} >= 0`)],
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  stock: one(stock, {
    fields: [products.id],
    references: [stock.productId],
  }),
}));

export const stockRelations = relations(stock, ({ one }) => ({
  product: one(products, {
    fields: [stock.productId],
    references: [products.id],
  }),
}));

/**
 * Catalogue reads.
 *
 * The only module that touches the catalogue tables — pages and components call
 * these accessors rather than importing `@/db` themselves.
 *
 * Every accessor is async and marked `use cache` with an explicit `cacheLife`, so
 * prerendering fills the entries at build and the database is hit on a miss rather
 * than per request. Each one is tagged, so a future mutation can `updateTag`
 * instead of waiting out a lifetime.
 *
 * Money is integer cents, never floats.
 *
 * `slug` doubles as the image key: `scripts/fetch-images.mjs` writes
 * `public/products/<slug>.webp` and the matching manifest entry, so a product and
 * its photography stay in sync by construction.
 */

import { and, asc, desc, eq, ilike, ne, or, sql, type SQL } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/db";
import { categories, products, stock } from "@/db/schema";

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  /** Scenery image key, see src/lib/images.ts. */
  image: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Category slug, which is what the `?category=` links carry. */
  category: string;
  /** Category display name, so the detail page needs no second lookup. */
  categoryName: string;
  priceCents: number;
  /** Original price, when the item is marked down. */
  compareAtCents?: number;
  rating: number;
  reviewCount: number;
  blurb: string;
  description: string;
  features: string[];
  /** Short spec rows for the detail page. */
  specs: { label: string; value: string }[];
  badge?: string;
  /** Colourway label shown as a swatch row on the card and detail page. */
  colorway: string;
  /** Derived from the stock table, never stored. */
  inStock: boolean;
  stockQuantity: number;
};

export type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

export const sortOptions: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "rating", label: "Top rated" },
];

const productColumns = {
  id: products.id,
  slug: products.slug,
  name: products.name,
  category: categories.slug,
  categoryName: categories.name,
  priceCents: products.priceCents,
  compareAtCents: products.compareAtCents,
  rating: products.rating,
  reviewCount: products.reviewCount,
  blurb: products.blurb,
  description: products.description,
  features: products.features,
  specs: products.specs,
  badge: products.badge,
  colorway: products.colorway,
  quantity: stock.quantity,
};

/** A product is always read with its category and its stock row. */
function selectProducts() {
  return db
    .select(productColumns)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(stock, eq(stock.productId, products.id));
}

type ProductRow = Awaited<ReturnType<ReturnType<typeof selectProducts>["execute"]>>[number];

/** Nullable columns become absent properties, which is the shape the UI expects. */
function mapRow({ quantity, compareAtCents, badge, ...rest }: ProductRow): Product {
  const stockQuantity = quantity ?? 0;

  return {
    ...rest,
    compareAtCents: compareAtCents ?? undefined,
    badge: badge ?? undefined,
    inStock: stockQuantity > 0,
    stockQuantity,
  };
}

/** True when the product has stock; also the first key of the "featured" sort. */
const inStockExpression = sql`coalesce(${stock.quantity}, 0) > 0`;

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("days");
  cacheTag("categories");

  return db
    .select({
      slug: categories.slug,
      name: categories.name,
      tagline: categories.tagline,
      image: categories.imageKey,
    })
    .from(categories)
    .orderBy(asc(categories.position), asc(categories.name));
}

/** Longest search term we will run. Anything beyond this is truncated. */
export const MAX_SEARCH_LENGTH = 64;

const SORT_KEYS: ReadonlySet<string> = new Set(sortOptions.map((option) => option.key));

/**
 * Escapes LIKE wildcards, so a `%` typed into the search box matches a literal
 * percent sign instead of every row.
 */
function likePattern(value: string): string {
  return `%${value.replace(/[\\%_]/g, (char) => `\\${char}`)}%`;
}

type ProductQuery = {
  category?: string;
  sort?: string;
  q?: string;
  limit?: number;
};

async function runProductQuery(options: ProductQuery): Promise<Product[]> {
  const filters: (SQL | undefined)[] = [];

  if (options.category && options.category !== "all") {
    filters.push(eq(categories.slug, options.category));
  }

  if (options.q) {
    // Naive substring match. Becomes a Postgres full-text or trigram query once
    // the catalogue is large enough to need one.
    const pattern = likePattern(options.q);
    filters.push(
      or(
        ilike(products.name, pattern),
        ilike(products.blurb, pattern),
        ilike(categories.name, pattern),
        ilike(categories.slug, pattern),
      ),
    );
  }

  const orderBy =
    options.sort === "price-asc"
      ? [asc(products.priceCents)]
      : options.sort === "price-desc"
        ? [desc(products.priceCents)]
        : options.sort === "rating"
          ? [desc(products.rating)]
          : // "featured": in stock first, then by review volume — a stand-in for
            // whatever ranking the real store ends up using.
            [desc(inStockExpression), desc(products.reviewCount)];

  const query = selectProducts()
    .where(filters.length > 0 ? and(...filters) : undefined)
    // Slug last so equal keys come back in a stable order.
    .orderBy(...orderBy, asc(products.slug));

  const rows =
    typeof options.limit === "number" ? await query.limit(options.limit) : await query;

  return rows.map(mapRow);
}

/**
 * The cached listing — no free text.
 *
 * Its key space is deliberately small: `category` is one of the known slugs or
 * "all", `sort` one of four, `limit` a number we pick ourselves. getProducts
 * guarantees that before calling in.
 */
async function getListing(options: {
  category?: string;
  sort?: string;
  limit?: number;
}): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  return runProductQuery(options);
}

/**
 * Not cached itself: it validates its arguments and then picks a path.
 *
 * A `use cache` entry is keyed on the arguments it is called with, so routing
 * caller-supplied search text through a cached function would let anyone mint
 * unlimited distinct keys and evict every legitimate entry from the LRU —
 * turning each later request into a fresh database round-trip. Search therefore
 * runs uncached (it is always read inside a Suspense boundary), while the
 * bounded listing stays cached.
 */
export async function getProducts(options?: ProductQuery): Promise<Product[]> {
  const sort =
    options?.sort && SORT_KEYS.has(options.sort) ? options.sort : "featured";

  const category = options?.category?.trim() || "all";
  if (category !== "all") {
    // An unknown category yields no results rather than a cache entry.
    const known = await getCategories();
    if (!known.some((entry) => entry.slug === category)) return [];
  }

  const q = options?.q?.trim().slice(0, MAX_SEARCH_LENGTH);

  if (q) {
    return runProductQuery({ category, sort, q, limit: options?.limit });
  }

  return getListing({ category, sort, limit: options?.limit });
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `product:${slug}`);

  const [row] = await selectProducts().where(eq(products.slug, slug)).limit(1);

  return row ? mapRow(row) : undefined;
}

export async function getRelatedProducts(slug: string, limit = 3): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const [current] = await db
    .select({ categoryId: products.categoryId })
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (!current) return [];

  const rows = await selectProducts()
    .where(ne(products.slug, slug))
    .orderBy(
      // Same category first, then everything else.
      asc(sql`case when ${eq(products.categoryId, current.categoryId)} then 0 else 1 end`),
      desc(products.reviewCount),
      asc(products.slug),
    )
    .limit(limit);

  return rows.map(mapRow);
}

export async function getAllProductSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await db
    .select({ slug: products.slug })
    .from(products)
    .orderBy(asc(products.slug));

  return rows.map((row) => row.slug);
}

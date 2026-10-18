import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ProductGrid, ProductGridSkeleton } from "@/components/product-card";
import { categories, getProducts, sortOptions } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop all",
  description: "The full Northwind catalogue.",
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Keeps the other filters intact when one of them changes. */
function buildHref(current: Record<string, string | undefined>, patch: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...current, ...patch })) {
    if (value && value !== "all" && value !== "featured") params.set(key, value);
  }
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}

export default function ProductsPage({ searchParams }: PageProps<"/products">) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything we make
        </h1>
        <p className="mt-2 max-w-xl text-muted">
          Twelve products across four collections. Filter, sort, or just scroll.
        </p>
      </header>

      {/*
        searchParams is request-time data. Reading it inside this boundary means
        the heading above still prerenders as a static shell, and only the
        filtered results stream in.
      */}
      <Suspense fallback={<ListingFallback />}>
        <Listing searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

function ListingFallback() {
  return (
    <div className="space-y-8">
      <div className="h-9 w-full max-w-md animate-pulse rounded-full bg-ink/5 dark:bg-white/5" />
      <ProductGridSkeleton />
    </div>
  );
}

async function Listing({
  searchParams,
}: {
  searchParams: PageProps<"/products">["searchParams"];
}) {
  const params = await searchParams;
  const category = first(params.category) ?? "all";
  const sort = first(params.sort) ?? "featured";
  const q = first(params.q) ?? "";

  const products = await getProducts({ category, sort, q });
  const current = { category, sort, q: q || undefined };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav className="flex flex-wrap gap-2" aria-label="Filter by category">
          {[{ slug: "all", name: "All" }, ...categories].map((option) => {
            const active = category === option.slug;
            return (
              <Link
                key={option.slug}
                href={buildHref(current, { category: option.slug })}
                aria-current={active ? "page" : undefined}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-ink bg-ink text-surface"
                    : "border-line text-muted hover:border-ink hover:text-ink"
                }`}
              >
                {option.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">Sort</span>
          {sortOptions.map((option) => {
            const active = sort === option.key;
            return (
              <Link
                key={option.key}
                href={buildHref(current, { sort: option.key })}
                className={`rounded-full px-3 py-1.5 transition-colors ${
                  active
                    ? "bg-accent/10 font-semibold text-accent"
                    : "text-muted hover:text-ink"
                }`}
              >
                {option.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
        <span>
          {products.length} {products.length === 1 ? "product" : "products"}
        </span>
        {q ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-1 dark:bg-white/10">
            Search: <strong className="font-semibold text-ink">{q}</strong>
            <Link
              href={buildHref(current, { q: undefined })}
              aria-label="Clear search"
              className="text-muted hover:text-ink"
            >
              ✕
            </Link>
          </span>
        ) : null}
      </div>

      <ProductGrid products={products} />
    </div>
  );
}

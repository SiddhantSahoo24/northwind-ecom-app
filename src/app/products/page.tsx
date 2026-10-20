import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ProductGrid, ProductGridSkeleton } from "@/components/product-card";
import { Container, Dot } from "@/components/ui";
import { getCategories, getProducts, sortOptions } from "@/lib/products";

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
    <>
      <div className="dot-field border-b border-line">
        <Container className="py-14 sm:py-20">
          <p className="label flex items-center gap-2 text-accent">
            <Dot />
            Catalogue
          </p>
          <h1 className="mt-6 max-w-2xl text-4xl font-medium tracking-tighter text-balance sm:text-6xl">
            Everything we make.
          </h1>
          <p className="mt-6 max-w-md text-muted">
            Twelve products across four lines. Filter, sort, or just scroll.
          </p>
        </Container>
      </div>

      {/*
        searchParams is request-time data. Reading it inside this boundary means
        the heading above still prerenders as a static shell, and only the
        filtered results stream in.
      */}
      <Suspense fallback={<ListingFallback />}>
        <Listing searchParams={searchParams} />
      </Suspense>
    </>
  );
}

function ListingFallback() {
  return (
    <>
      <div className="border-b border-line">
        <Container className="flex h-14 items-center">
          <div className="h-3 w-64 animate-pulse bg-plate" />
        </Container>
      </div>
      <Container className="py-10">
        <ProductGridSkeleton />
      </Container>
    </>
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

  const [products, categories] = await Promise.all([
    getProducts({ category, sort, q }),
    getCategories(),
  ]);
  const current = { category, sort, q: q || undefined };

  return (
    <>
      {/* Filter bar sticks under the header so the rules stay continuous. */}
      <div className="sticky top-16 z-30 border-b border-line bg-page/90 backdrop-blur-md">
        <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3">
          <nav className="flex flex-wrap items-center gap-1" aria-label="Filter by category">
            {[{ slug: "all", name: "All" }, ...categories].map((option) => {
              const active = category === option.slug;
              return (
                <Link
                  key={option.slug}
                  href={buildHref(current, { category: option.slug })}
                  aria-current={active ? "page" : undefined}
                  className={`label px-3 py-2 transition-colors ${
                    active
                      ? "bg-ink text-page"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {option.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-wrap items-center gap-1">
            <span className="label mr-1 text-muted">Sort</span>
            {sortOptions.map((option) => {
              const active = sort === option.key;
              return (
                <Link
                  key={option.key}
                  href={buildHref(current, { sort: option.key })}
                  className={`label border-b-2 px-2 py-2 transition-colors ${
                    active
                      ? "border-accent text-ink"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>
        </Container>
      </div>

      <Container className="py-8 sm:py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="label text-muted tabular-nums">
            {String(products.length).padStart(2, "0")}{" "}
            {products.length === 1 ? "result" : "results"}
          </span>
          {q ? (
            <span className="label inline-flex items-center gap-2 border border-line px-3 py-1.5">
              <span className="text-muted">Search</span>
              <strong className="font-medium text-ink normal-case">{q}</strong>
              <Link
                href={buildHref(current, { q: undefined })}
                aria-label="Clear search"
                className="text-muted hover:text-accent"
              >
                ✕
              </Link>
            </span>
          ) : null}
        </div>

        <ProductGrid products={products} priorityCount={4} />
      </Container>
    </>
  );
}

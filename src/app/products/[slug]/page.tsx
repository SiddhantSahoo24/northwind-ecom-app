import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AddToCart } from "@/components/add-to-cart";
import { ProductArt } from "@/components/product-art";
import { ProductGrid } from "@/components/product-card";
import { Badge, ButtonLink, Stars } from "@/components/ui";
import { discountLabel, formatPrice } from "@/lib/format";
import {
  categories,
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";

/**
 * Every slug is prerendered. Cache Components requires at least one param here
 * — an empty array is an error — and returning all of them means there are no
 * request-time paths left to fall back to.
 */
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Not found" };

  return {
    title: product.name,
    description: product.blurb,
  };
}

/**
 * The page itself is not async and never awaits `params`.
 *
 * Partial Prefetching is enabled in next.config.ts, so awaiting the slug inside
 * the Suspense boundary lets the shell below prerender and ship instantly while
 * the product streams in. Awaiting at the top level instead trips the
 * instant-shell-url-data validation error.
 */
export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail params={params} />
      </Suspense>
    </div>
  );
}

async function ProductDetail({
  params,
}: {
  params: PageProps<"/products/[slug]">["params"];
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  // generateStaticParams covers the real catalogue; anything else is a 404
  // rather than a rendered page.
  if (!product) notFound();

  const related = await getRelatedProducts(slug, 3);
  const category = categories.find((c) => c.slug === product.category);
  const onSale = typeof product.compareAtCents === "number";

  return (
    <>
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted">
        <Link href="/products" className="hover:text-ink">
          Shop
        </Link>
        <span aria-hidden="true">/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-ink">
          {category?.name}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative overflow-hidden rounded-3xl border border-line">
          <ProductArt
            category={product.category}
            slug={product.slug}
            className="aspect-square w-full"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {product.badge ? <Badge tone="muted">{product.badge}</Badge> : null}
            {onSale ? (
              <Badge tone="sale">
                {discountLabel(product.priceCents, product.compareAtCents!)}
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col">
          <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            {category?.name}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4">
            <Stars rating={product.rating} reviewCount={product.reviewCount} />
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">
              {formatPrice(product.priceCents)}
            </span>
            {onSale ? (
              <span className="text-lg text-muted line-through">
                {formatPrice(product.compareAtCents!)}
              </span>
            ) : null}
          </div>

          <p className="mt-6 text-muted">{product.description}</p>

          <ul className="mt-6 space-y-2.5">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm">
                <svg
                  viewBox="0 0 24 24"
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M4 12.5l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <AddToCart
              slug={product.slug}
              inStock={product.inStock}
              className="min-w-44 flex-1"
            />
            <ButtonLink href="/cart" variant="outline">
              View cart
            </ButtonLink>
          </div>

          <dl className="mt-8 grid gap-4 border-t border-line pt-6 text-sm sm:grid-cols-3">
            <div>
              <dt className="font-semibold">Delivery</dt>
              <dd className="text-muted">2-4 working days</dd>
            </div>
            <div>
              <dt className="font-semibold">Returns</dt>
              <dd className="text-muted">30 days, unused</dd>
            </div>
            <div>
              <dt className="font-semibold">Warranty</dt>
              <dd className="text-muted">Two years</dd>
            </div>
          </dl>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-20">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            You might also like
          </h2>
          <ProductGrid products={related} />
        </section>
      ) : null}
    </>
  );
}

function ProductDetailSkeleton() {
  const bar = "animate-pulse rounded bg-ink/5 dark:bg-white/5";

  return (
    <>
      <div className={`mb-8 h-4 w-64 ${bar}`} />
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className={`aspect-square w-full rounded-3xl ${bar}`} />
        <div className="space-y-5">
          <div className={`h-3 w-24 ${bar}`} />
          <div className={`h-10 w-3/4 ${bar}`} />
          <div className={`h-4 w-32 ${bar}`} />
          <div className={`h-8 w-28 ${bar}`} />
          <div className="space-y-2">
            <div className={`h-4 w-full ${bar}`} />
            <div className={`h-4 w-full ${bar}`} />
            <div className={`h-4 w-2/3 ${bar}`} />
          </div>
          <div className={`h-11 w-full rounded-full ${bar}`} />
        </div>
      </div>
    </>
  );
}

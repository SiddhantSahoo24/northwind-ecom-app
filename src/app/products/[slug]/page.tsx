import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AddToCart } from "@/components/add-to-cart";
import { ProductGrid } from "@/components/product-card";
import { ProductImage } from "@/components/product-image";
import { Badge, ButtonLink, Container, Dot, Stars } from "@/components/ui";
import { discountLabel, formatPrice } from "@/lib/format";
import {
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
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetail params={params} />
    </Suspense>
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

  const related = await getRelatedProducts(slug, 4);
  const onSale = typeof product.compareAtCents === "number";

  return (
    <>
      <div className="border-b border-line">
        <Container>
          <nav className="label flex flex-wrap items-center gap-2 py-4 text-muted">
            <Link href="/products" className="hover:text-ink">
              Shop
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={`/products?category=${product.category}`}
              className="hover:text-ink"
            >
              {product.categoryName}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink">{product.name}</span>
          </nav>
        </Container>
      </div>

      <div className="border-b border-line">
        <div className="mx-auto grid w-full max-w-7xl lg:grid-cols-2">
          {/* The shot runs to the edge of its column; the rule between the two
              halves is the only separator. */}
          <div className="relative lg:border-r lg:border-line">
            <ProductImage
              imageKey={product.slug}
              alt={`${product.name} — ${product.colorway}`}
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              // Square on mobile; on desktop the shot stretches to whatever
              // height the spec column needs, so the dividing rule runs the
              // full height of the block instead of stopping short.
              className="aspect-square w-full lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
            />
            <div className="absolute top-4 left-4 flex gap-1.5">
              {product.badge ? <Badge tone="muted">{product.badge}</Badge> : null}
              {onSale ? (
                <Badge tone="sale">
                  {discountLabel(product.priceCents, product.compareAtCents!)}
                </Badge>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col px-5 py-10 sm:px-8 sm:py-14">
            <p className="label flex items-center gap-2 text-accent">
              <Dot />
              {product.categoryName}
            </p>
            <h1 className="mt-6 text-3xl font-medium tracking-tighter text-balance sm:text-5xl">
              {product.name}
            </h1>
            <p className="label mt-4 text-muted">{product.colorway}</p>

            <div className="mt-6">
              <Stars rating={product.rating} reviewCount={product.reviewCount} />
            </div>

            <div className="mt-8 flex items-baseline gap-3">
              <span className="font-mono text-3xl tabular-nums">
                {formatPrice(product.priceCents)}
              </span>
              {onSale ? (
                <span className="font-mono text-base text-muted line-through tabular-nums">
                  {formatPrice(product.compareAtCents!)}
                </span>
              ) : null}
            </div>

            <p className="mt-6 text-muted">{product.description}</p>

            <ul className="mt-8 divide-y divide-line border-y border-line">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 py-3 text-sm">
                  <Dot className="mt-2 shrink-0" />
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

            <dl className="mt-10 grid grid-cols-2 gap-px border border-line bg-line">
              {product.specs.map((spec) => (
                <div key={spec.label} className="bg-page px-4 py-4">
                  <dt className="label text-muted">{spec.label}</dt>
                  <dd className="mt-2 text-sm font-medium">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <dl className="label mt-6 grid gap-3 text-muted sm:grid-cols-3">
              <div>
                <dt>Delivery</dt>
                <dd className="mt-1 text-ink">2–4 days</dd>
              </div>
              <div>
                <dt>Returns</dt>
                <dd className="mt-1 text-ink">30 days</dd>
              </div>
              <div>
                <dt>Warranty</dt>
                <dd className="mt-1 text-ink">Two years</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <Container className="py-14 sm:py-20">
          <div className="mb-10 flex items-center gap-3">
            <span className="label text-accent">+</span>
            <span className="label text-muted">You might also like</span>
          </div>
          <ProductGrid products={related} />
        </Container>
      ) : null}
    </>
  );
}

function ProductDetailSkeleton() {
  return (
    <>
      <div className="border-b border-line">
        <Container>
          <div className="py-4">
            <div className="h-3 w-56 animate-pulse bg-plate" />
          </div>
        </Container>
      </div>
      <div className="border-b border-line">
        <div className="mx-auto grid w-full max-w-7xl lg:grid-cols-2">
          <div className="aspect-square w-full animate-pulse bg-plate lg:border-r lg:border-line" />
          <div className="space-y-5 px-5 py-10 sm:px-8 sm:py-14">
            <div className="h-3 w-20 animate-pulse bg-plate" />
            <div className="h-12 w-3/4 animate-pulse bg-plate" />
            <div className="h-3 w-28 animate-pulse bg-plate" />
            <div className="h-8 w-32 animate-pulse bg-plate" />
            <div className="space-y-2 pt-4">
              <div className="h-4 w-full animate-pulse bg-plate" />
              <div className="h-4 w-full animate-pulse bg-plate" />
              <div className="h-4 w-2/3 animate-pulse bg-plate" />
            </div>
            <div className="h-12 w-full animate-pulse bg-plate" />
          </div>
        </div>
      </div>
    </>
  );
}

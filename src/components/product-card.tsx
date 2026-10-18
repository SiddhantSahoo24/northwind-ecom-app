import Link from "next/link";

import { AddToCart } from "@/components/add-to-cart";
import { ProductArt } from "@/components/product-art";
import { Badge, Stars } from "@/components/ui";
import { discountLabel, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const onSale = typeof product.compareAtCents === "number";

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-shadow hover:shadow-lg hover:shadow-ink/5">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <ProductArt
          category={product.category}
          slug={product.slug}
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {product.badge ? <Badge tone="muted">{product.badge}</Badge> : null}
          {onSale ? (
            <Badge tone="sale">
              {discountLabel(product.priceCents, product.compareAtCents!)}
            </Badge>
          ) : null}
        </div>
        {!product.inStock ? (
          <div className="absolute inset-0 grid place-items-center bg-surface/70 backdrop-blur-[2px]">
            <span className="rounded-full bg-ink px-4 py-1.5 text-xs font-semibold tracking-wide text-surface uppercase">
              Sold out
            </span>
          </div>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex-1">
          <Link href={`/products/${product.slug}`} className="hover:underline">
            <h3 className="font-semibold tracking-tight">{product.name}</h3>
          </Link>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted">{product.blurb}</p>
        </div>

        <Stars rating={product.rating} reviewCount={product.reviewCount} />

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold">{formatPrice(product.priceCents)}</span>
            {onSale ? (
              <span className="text-sm text-muted line-through">
                {formatPrice(product.compareAtCents!)}
              </span>
            ) : null}
          </div>
          <AddToCart
            slug={product.slug}
            inStock={product.inStock}
            variant="outline"
            label="Add"
            className="h-9 px-4 text-xs"
          />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line px-6 py-20 text-center">
        <p className="font-medium">Nothing matches that yet.</p>
        <p className="mt-1 text-sm text-muted">
          Try another category, or clear the search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-line bg-surface"
        >
          <div className="aspect-[4/3] animate-pulse bg-ink/5 dark:bg-white/5" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-2/3 animate-pulse rounded bg-ink/5 dark:bg-white/5" />
            <div className="h-3 w-full animate-pulse rounded bg-ink/5 dark:bg-white/5" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-ink/5 dark:bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

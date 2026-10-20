import Link from "next/link";

import { AddToCart } from "@/components/add-to-cart";
import { ProductImage } from "@/components/product-image";
import { Badge, Stars } from "@/components/ui";
import { discountLabel, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/products";

/**
 * Grid cards share edges rather than floating: the grid draws one hairline and
 * each cell fills it, which is why there is no border or radius here.
 */
const GRID_SIZES =
  "(min-width: 1280px) 20rem, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const onSale = typeof product.compareAtCents === "number";

  return (
    <article className="group flex flex-col bg-page">
      <Link
        href={`/products/${product.slug}`}
        className="relative block"
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductImage
          imageKey={product.slug}
          alt=""
          sizes={GRID_SIZES}
          priority={priority}
          className="aspect-square w-full"
          imageClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {product.badge ? <Badge tone="muted">{product.badge}</Badge> : null}
          {onSale ? (
            <Badge tone="sale">
              {discountLabel(product.priceCents, product.compareAtCents!)}
            </Badge>
          ) : null}
        </div>
        {!product.inStock ? (
          <div className="absolute inset-0 grid place-items-center bg-page/70 backdrop-blur-[1px]">
            <span className="label bg-ink px-3 py-1.5 text-page">Sold out</span>
          </div>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-4 px-4 py-5 sm:px-5">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <Link href={`/products/${product.slug}`}>
              <h3 className="text-base font-medium tracking-tight group-hover:text-accent">
                {product.name}
              </h3>
            </Link>
            <span className="font-mono text-sm tabular-nums">
              {formatPrice(product.priceCents)}
            </span>
          </div>
          <p className="label mt-2 text-muted">{product.colorway}</p>
          <p className="mt-3 line-clamp-2 text-sm text-muted">{product.blurb}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Stars rating={product.rating} reviewCount={product.reviewCount} />
          {onSale ? (
            <span className="font-mono text-xs text-muted line-through tabular-nums">
              {formatPrice(product.compareAtCents!)}
            </span>
          ) : null}
        </div>

        <AddToCart
          slug={product.slug}
          inStock={product.inStock}
          variant="outline"
          label="Add to cart"
          className="h-10 w-full px-4"
        />
      </div>
    </article>
  );
}

/**
 * The grid itself paints the rules. `gap-px` over a line-coloured background
 * gives hairlines that meet exactly, with no doubling where cells adjoin.
 */
export function ProductGrid({
  products,
  priorityCount = 0,
}: {
  products: Product[];
  /** How many leading cards load eagerly — set above the fold only. */
  priorityCount?: number;
}) {
  if (products.length === 0) {
    return (
      <div className="dot-field border border-line px-6 py-24 text-center">
        <p className="font-medium">Nothing matches that.</p>
        <p className="mt-2 text-sm text-muted">
          Try another category, or clear the search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="bg-page">
          <div className="aspect-square animate-pulse bg-plate" />
          <div className="space-y-3 px-4 py-5 sm:px-5">
            <div className="h-4 w-2/3 animate-pulse bg-plate" />
            <div className="h-3 w-1/3 animate-pulse bg-plate" />
            <div className="h-10 w-full animate-pulse bg-plate" />
          </div>
        </div>
      ))}
    </div>
  );
}

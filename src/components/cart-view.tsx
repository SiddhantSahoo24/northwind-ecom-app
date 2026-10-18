"use client";

import Link from "next/link";

import { useCart } from "@/components/cart-store";
import { ProductArt } from "@/components/product-art";
import { buttonStyles } from "@/components/ui";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/products";

const FREE_SHIPPING_THRESHOLD_CENTS = 7500;
const SHIPPING_CENTS = 900;

export function CartView({ products }: { products: Product[] }) {
  const { lines, hydrated, setQty, remove, clear } = useCart();

  // Prices come from the catalogue the server just rendered, never from
  // storage — a cart saved last week cannot quote last week's price.
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  const items = lines
    .map((line) => {
      const product = bySlug.get(line.slug);
      return product ? { product, qty: line.qty } : null;
    })
    .filter((item): item is { product: Product; qty: number } => item !== null);

  if (!hydrated) {
    return (
      <div className="grid gap-4">
        {[0, 1].map((index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl bg-ink/5 dark:bg-white/5"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-line px-6 py-20 text-center">
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="mt-2 text-muted">
          Nothing in here yet. The catalogue is twelve products long — it will
          not take you long.
        </p>
        <Link href="/products" className={`${buttonStyles.primary} mt-6`}>
          Start shopping
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce(
    (total, item) => total + item.product.priceCents * item.qty,
    0,
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_CENTS;
  const toFreeShipping = FREE_SHIPPING_THRESHOLD_CENTS - subtotal;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
      <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
        {items.map(({ product, qty }) => (
          <li key={product.slug} className="flex gap-4 p-4 sm:gap-5 sm:p-5">
            <Link
              href={`/products/${product.slug}`}
              className="h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28"
            >
              <ProductArt
                category={product.category}
                slug={`cart-${product.slug}`}
                className="h-full w-full"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-semibold hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="truncate text-sm text-muted">{product.blurb}</p>
                </div>
                <span className="shrink-0 font-semibold tabular-nums">
                  {formatPrice(product.priceCents * qty)}
                </span>
              </div>

              <div className="mt-auto flex items-center justify-between gap-3">
                <div className="inline-flex items-center rounded-full border border-line">
                  <button
                    type="button"
                    onClick={() => setQty(product.slug, qty - 1)}
                    aria-label={`Decrease quantity of ${product.name}`}
                    className="grid h-9 w-9 place-items-center rounded-l-full text-lg leading-none hover:bg-ink/5 dark:hover:bg-white/10"
                  >
                    −
                  </button>
                  <span className="w-9 text-center text-sm font-semibold tabular-nums">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(product.slug, qty + 1)}
                    aria-label={`Increase quantity of ${product.name}`}
                    className="grid h-9 w-9 place-items-center rounded-r-full text-lg leading-none hover:bg-ink/5 dark:hover:bg-white/10"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => remove(product.slug)}
                  className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="rounded-2xl border border-line bg-surface p-6">
        <h2 className="text-lg font-semibold">Order summary</h2>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-medium tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Shipping</dt>
            <dd className="font-medium tabular-nums">
              {shipping === 0 ? "Free" : formatPrice(shipping)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base">
            <dt className="font-semibold">Total</dt>
            <dd className="font-semibold tabular-nums">
              {formatPrice(subtotal + shipping)}
            </dd>
          </div>
        </dl>

        {toFreeShipping > 0 ? (
          <p className="mt-4 rounded-xl bg-accent/10 px-4 py-3 text-sm text-accent">
            Add {formatPrice(toFreeShipping)} more for free shipping.
          </p>
        ) : null}

        <button
          type="button"
          disabled
          className={`${buttonStyles.accent} mt-6 w-full`}
          title="Checkout needs the database and auth wired up first"
        >
          Checkout
        </button>
        <p className="mt-3 text-center text-xs text-muted">
          Checkout is inert in this demo — it needs orders in Postgres and a
          signed-in user first.
        </p>

        <button
          type="button"
          onClick={clear}
          className="mt-4 w-full text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
        >
          Clear cart
        </button>
      </aside>
    </div>
  );
}

"use client";

import Link from "next/link";

import { useCart } from "@/components/cart-store";
import { ProductImage } from "@/components/product-image";
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
      <div className="grid gap-px border border-line bg-line">
        {[0, 1].map((index) => (
          <div key={index} className="h-32 animate-pulse bg-plate" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="dot-field border border-line px-6 py-24 text-center">
        <h2 className="text-2xl font-medium tracking-tight">Your cart is empty</h2>
        <p className="mx-auto mt-3 max-w-sm text-muted">
          Nothing in here yet. The catalogue is twelve products long — it will
          not take you long.
        </p>
        <Link href="/products" className={`${buttonStyles.primary} mt-8`}>
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
    <div className="grid gap-px border border-line bg-line lg:grid-cols-[1.7fr_1fr] lg:items-start">
      <ul className="divide-y divide-line bg-page">
        {items.map(({ product, qty }) => (
          <li key={product.slug} className="flex gap-4 p-4 sm:gap-6 sm:p-5">
            <Link href={`/products/${product.slug}`} className="shrink-0">
              <ProductImage
                imageKey={product.slug}
                alt=""
                sizes="112px"
                className="h-24 w-24 sm:h-28 sm:w-28"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-medium tracking-tight hover:text-accent"
                  >
                    {product.name}
                  </Link>
                  <p className="label mt-1.5 text-muted">{product.colorway}</p>
                </div>
                <span className="shrink-0 font-mono text-sm tabular-nums">
                  {formatPrice(product.priceCents * qty)}
                </span>
              </div>

              <div className="mt-auto flex items-center justify-between gap-3">
                <div className="inline-flex items-center border border-line">
                  <button
                    type="button"
                    onClick={() => setQty(product.slug, qty - 1)}
                    aria-label={`Decrease quantity of ${product.name}`}
                    className="grid h-9 w-9 place-items-center text-lg leading-none transition-colors hover:bg-ink hover:text-page"
                  >
                    −
                  </button>
                  <span className="w-9 text-center font-mono text-sm tabular-nums">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(product.slug, qty + 1)}
                    aria-label={`Increase quantity of ${product.name}`}
                    className="grid h-9 w-9 place-items-center text-lg leading-none transition-colors hover:bg-ink hover:text-page"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => remove(product.slug)}
                  className="label text-muted transition-colors hover:text-accent"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="bg-page p-6 sm:p-8">
        <h2 className="label text-muted">Order summary</h2>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-mono tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Shipping</dt>
            <dd className="font-mono tabular-nums">
              {shipping === 0 ? "Free" : formatPrice(shipping)}
            </dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-line pt-4">
            <dt className="font-medium">Total</dt>
            <dd className="font-mono text-lg tabular-nums">
              {formatPrice(subtotal + shipping)}
            </dd>
          </div>
        </dl>

        {toFreeShipping > 0 ? (
          <p className="label mt-5 border border-accent px-4 py-3 text-accent">
            Add {formatPrice(toFreeShipping)} for free shipping
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
        <p className="mt-4 text-xs text-muted">
          Checkout is inert in this demo — it needs orders in Postgres and a
          signed-in user first.
        </p>

        <button
          type="button"
          onClick={clear}
          className="label mt-6 w-full border border-line py-3 text-muted transition-colors hover:border-ink hover:text-ink"
        >
          Clear cart
        </button>
      </aside>
    </div>
  );
}

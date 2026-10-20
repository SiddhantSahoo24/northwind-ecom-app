"use client";

import Link from "next/link";

import { useCart } from "@/components/cart-store";

export function CartBadge() {
  const { itemCount, hydrated } = useCart();

  return (
    <Link
      href="/cart"
      className="label relative inline-flex h-10 items-center gap-2 border border-line px-3 text-ink transition-colors hover:border-ink"
      aria-label={
        hydrated && itemCount > 0 ? `Cart, ${itemCount} items` : "Cart"
      }
    >
      <span>Cart</span>
      {/* Rendered only after hydration: the server has no way to know the cart.
          The slot keeps its width either way so the header does not reflow. */}
      <span className="grid h-4 min-w-4 place-items-center tabular-nums">
        {hydrated && itemCount > 0 ? (
          <span className="grid h-4 min-w-4 place-items-center bg-accent px-1 text-accent-fg">
            {itemCount}
          </span>
        ) : (
          <span className="text-muted">0</span>
        )}
      </span>
    </Link>
  );
}

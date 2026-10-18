"use client";

import Link from "next/link";

import { useCart } from "@/components/cart-store";

export function CartBadge() {
  const { itemCount, hydrated } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 dark:hover:bg-white/10"
      aria-label={
        hydrated && itemCount > 0 ? `Cart, ${itemCount} items` : "Cart"
      }
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 2-1.55L20.5 8H6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="20" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="17.5" cy="20" r="1.4" fill="currentColor" stroke="none" />
      </svg>
      {/* Rendered only after hydration: the server has no way to know the cart. */}
      {hydrated && itemCount > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-fg tabular-nums">
          {itemCount}
        </span>
      ) : null}
    </Link>
  );
}

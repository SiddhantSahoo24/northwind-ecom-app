import Link from "next/link";

import { CartBadge } from "@/components/cart-badge";
import { NavLinks } from "@/components/nav-links";
import { categories } from "@/lib/products";

export function SiteHeader() {
  const links = [
    { href: "/products", label: "Shop all" },
    ...categories.map((category) => ({
      href: `/products?category=${category.slug}`,
      label: category.name,
    })),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-5 sm:px-8">
        <Link href="/" className="shrink-0 text-lg font-bold tracking-[0.2em] uppercase">
          Northwind
        </Link>

        <NavLinks links={links} className="hidden lg:flex" />

        <form action="/products" className="ml-auto hidden max-w-xs flex-1 md:block">
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              name="q"
              placeholder="Search the shop"
              aria-label="Search products"
              className="h-10 w-full rounded-full border border-line bg-ink/[0.03] pr-4 pl-9 text-sm outline-none placeholder:text-muted focus:border-accent dark:bg-white/5"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link
            href="/login"
            className="hidden h-10 items-center rounded-full px-4 text-sm font-medium transition-colors hover:bg-ink/5 sm:inline-flex dark:hover:bg-white/10"
          >
            Sign in
          </Link>
          <CartBadge />
        </div>
      </div>

      <NavLinks
        links={links}
        className="flex gap-1 overflow-x-auto border-t border-line px-5 py-2 lg:hidden"
      />
    </header>
  );
}

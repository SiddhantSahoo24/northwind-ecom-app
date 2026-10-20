import Link from "next/link";

import { CartBadge } from "@/components/cart-badge";
import { NavLinks } from "@/components/nav-links";
import { Dot } from "@/components/ui";
import { getCategories } from "@/lib/products";

/** Repeated twice so the marquee can translate -50% and loop seamlessly. */
const ticker = [
  "Free shipping over $75",
  "Thirty-day returns",
  "Two-year warranty",
  "Carbon-neutral delivery",
];

function Ticker() {
  return (
    <div className="overflow-hidden border-b border-line bg-ink text-page">
      <div className="ticker-track py-2">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {ticker.map((item) => (
              <span
                key={item}
                className="label flex items-center gap-3 px-6 whitespace-nowrap"
              >
                <Dot />
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export async function SiteHeader() {
  // getCategories is `use cache`, so the nav still lands in the static shell.
  const categories = await getCategories();

  const links = [
    { href: "/products", label: "All" },
    ...categories.map((category) => ({
      href: `/products?category=${category.slug}`,
      label: category.name,
    })),
  ];

  return (
    <header className="sticky top-0 z-40 bg-page/90 backdrop-blur-md">
      <Ticker />

      <div className="border-b border-line">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-5 sm:px-8">
          <Link
            href="/"
            className="shrink-0 text-base font-semibold tracking-[0.3em] uppercase"
          >
            North
            <span className="text-accent">·</span>
            wind
          </Link>

          <NavLinks links={links} className="hidden lg:flex" />

          <form action="/products" className="ml-auto hidden max-w-55 flex-1 md:block">
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2 text-muted"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                name="q"
                placeholder="SEARCH"
                aria-label="Search products"
                className="label h-10 w-full border-b border-line bg-transparent pr-2 pl-6 text-ink outline-none placeholder:text-muted focus:border-ink"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <Link
              href="/login"
              className="label hidden h-10 items-center px-3 text-muted transition-colors hover:text-ink sm:inline-flex"
            >
              Account
            </Link>
            <CartBadge />
          </div>
        </div>
      </div>

      <NavLinks
        links={links}
        className="flex gap-1 overflow-x-auto border-b border-line px-5 py-2 lg:hidden"
      />
    </header>
  );
}

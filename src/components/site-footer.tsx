import Link from "next/link";

import { categories } from "@/lib/products";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All products" },
      ...categories.map((c) => ({
        href: `/products?category=${c.slug}`,
        label: c.name,
      })),
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/cart", label: "Your cart" },
      { href: "/products?sort=rating", label: "Top rated" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/products", label: "Shipping" },
      { href: "/products", label: "Returns" },
      { href: "/products", label: "Contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-ink/[0.02] dark:bg-white/[0.02]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold tracking-[0.2em] uppercase">Northwind</p>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Well-made things for desks, kitchens, and the hours in between.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold">{column.title}</h3>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={`${column.title}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-5 text-xs text-muted sm:px-8">
          {/* No new Date() here on purpose: Cache Components prerenders this
              shell, and a clock read at build time would bake in a stale year. */}
          <p>A demo storefront. Nothing here actually ships.</p>
          <p>Built with Next.js, Drizzle, and Better Auth.</p>
        </div>
      </div>
    </footer>
  );
}

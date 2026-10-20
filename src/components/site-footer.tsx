import Link from "next/link";

import { Dot } from "@/components/ui";
import { getCategories } from "@/lib/products";

export async function SiteFooter() {
  // Built per render rather than at module scope: the Shop column comes from the
  // database now. getCategories is `use cache`, so this still prerenders.
  const categories = await getCategories();

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
      title: "Support",
      links: [
        { href: "/products", label: "Shipping" },
        { href: "/products", label: "Returns" },
        { href: "/products", label: "Warranty" },
        { href: "/products", label: "Contact" },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t border-line">
      <div className="dot-field border-b border-line">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="max-w-3xl text-3xl font-medium tracking-tight text-balance sm:text-5xl">
            Twelve products.
            <span className="text-muted"> Nothing we would not carry ourselves.</span>
          </p>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div>
          <p className="text-base font-semibold tracking-[0.3em] uppercase">
            North
            <span className="text-accent">·</span>
            wind
          </p>
          <p className="mt-4 max-w-60 text-sm text-muted">
            Audio, wearables and the hardware around them. Built to be repaired,
            not replaced.
          </p>
          <p className="label mt-6 flex items-center gap-2 text-muted">
            <Dot />
            All systems operational
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="label text-muted">{column.title}</h3>
            <ul className="mt-5 space-y-3">
              {column.links.map((link) => (
                <li key={`${column.title}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink/70 transition-colors hover:text-accent"
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
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-5 py-6 sm:px-8">
          {/* No new Date() here on purpose: Cache Components prerenders this
              shell, and a clock read at build time would bake in a stale year. */}
          <p className="label text-muted">A demo storefront — nothing ships</p>
          <p className="label text-muted">
            Next.js · Drizzle · Better Auth · Photos from Unsplash
          </p>
        </div>
      </div>
    </footer>
  );
}

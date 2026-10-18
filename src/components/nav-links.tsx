"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Highlights by pathname only. Category links all share /products, so the
 * per-category highlighting lives on the listing page itself, inside the
 * Suspense boundary that reads searchParams.
 */
export function NavLinks({
  links,
  className = "",
}: {
  links: { href: string; label: string }[];
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav className={`items-center gap-1 ${className}`}>
      {links.map((link) => {
        const [target, query] = link.href.split("?");
        // Category links all point at /products and differ only by query, which
        // this component deliberately cannot see — so only the plain links can
        // claim the active state. The listing page highlights the category
        // itself, inside the boundary that reads searchParams.
        const active = !query && pathname === target;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-ink/5 text-ink dark:bg-white/10"
                : "text-muted hover:text-ink"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

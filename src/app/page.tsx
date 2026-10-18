import Link from "next/link";

import { ProductArt } from "@/components/product-art";
import { ProductGrid } from "@/components/product-card";
import { ButtonLink, Section } from "@/components/ui";
import { formatPrice } from "@/lib/format";
import { getCategories, getProducts } from "@/lib/products";

const promises = [
  { title: "Free shipping over $75", detail: "Two to four working days." },
  { title: "Thirty-day returns", detail: "Unused, in the original box." },
  { title: "Two-year warranty", detail: "Repaired or replaced, our call." },
];

export default async function HomePage() {
  const [featured, categories, [hero]] = await Promise.all([
    getProducts({ limit: 6 }),
    getCategories(),
    getProducts({ sort: "rating", limit: 1 }),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
              New season
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Well-made things, and nothing else.
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted">
              A short catalogue of objects we would buy twice: audio you can wear
              all day, a desk that outlives the laptop on it, and light you can
              actually dim.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/products" variant="primary">
                Shop everything
              </ButtonLink>
              <ButtonLink href="/products?sort=rating" variant="outline">
                See what is top rated
              </ButtonLink>
            </div>
          </div>

          {hero ? (
            <Link
              href={`/products/${hero.slug}`}
              className="group relative block overflow-hidden rounded-3xl border border-line"
            >
              <ProductArt
                category={hero.category}
                slug={`hero-${hero.slug}`}
                className="aspect-[5/4] w-full transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/70 to-transparent p-6">
                <div className="text-white">
                  <p className="text-xs font-semibold tracking-[0.15em] uppercase opacity-80">
                    Highest rated
                  </p>
                  <p className="mt-1 text-xl font-semibold">{hero.name}</p>
                </div>
                <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-900">
                  {formatPrice(hero.priceCents)}
                </span>
              </div>
            </Link>
          ) : null}
        </div>
      </section>

      {/* Promises */}
      <div className="border-b border-line">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-8 sm:px-8 md:grid-cols-3">
          {promises.map((promise) => (
            <div key={promise.title} className="flex items-start gap-3">
              <svg
                viewBox="0 0 24 24"
                className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 12.5l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <p className="text-sm font-semibold">{promise.title}</p>
                <p className="text-sm text-muted">{promise.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <Section
        title="Shop by room"
        description="Four small collections rather than one endless aisle."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-line"
            >
              <ProductArt
                category={category.slug}
                slug={`cat-${category.slug}`}
                className="aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/10 to-transparent p-5 text-white">
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-sm opacity-85">{category.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Featured */}
      <Section
        title="Featured this week"
        description="What people are actually buying."
        action={
          <Link
            href="/products"
            className="text-sm font-semibold text-accent hover:underline"
          >
            View all 12 products →
          </Link>
        }
      >
        <ProductGrid products={featured} />
      </Section>

      {/* Editorial */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Twelve products. No filler.
            </h2>
            <p className="mt-4 max-w-xl text-muted">
              Every item is used by someone here for at least a month before it
              goes on the shelf. When something stops being the best in its
              category, it comes off — we would rather have a short list you can
              trust than a long one you have to research.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <ButtonLink href="/products" variant="accent">
              Browse the catalogue
            </ButtonLink>
            <ButtonLink href="/login" variant="outline">
              Create an account
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

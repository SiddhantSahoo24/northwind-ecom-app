import Link from "next/link";

import { ProductGrid } from "@/components/product-card";
import { ProductImage } from "@/components/product-image";
import { ButtonLink, Dot, Section } from "@/components/ui";
import { formatPrice } from "@/lib/format";
import { getCategories, getProductBySlug, getProducts } from "@/lib/products";

const specLines = [
  { k: "Shipping", v: "Free over $75" },
  { k: "Returns", v: "30 days" },
  { k: "Warranty", v: "2 years" },
  { k: "Updates", v: "7 years" },
];

export default async function HomePage() {
  const [hero, featured, categories] = await Promise.all([
    getProductBySlug("signal-two"),
    getProducts({ limit: 8 }),
    getCategories(),
  ]);

  return (
    <>
      {/* 00 — Hero. Type on the left, the flagship on the right, one rule
          between them. The image is the LCP element, so it loads eagerly. */}
      <section className="border-b border-line">
        <div className="mx-auto grid w-full max-w-7xl lg:grid-cols-2">
          <div className="flex flex-col justify-between gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:border-r lg:border-line">
            <div>
              <p className="label flex items-center gap-2 text-accent">
                <Dot />
                New — Signal (2)
              </p>
              <h1 className="mt-8 text-5xl font-medium tracking-tighter text-balance sm:text-7xl">
                Hardware that
                <br />
                gets out of
                <br />
                <span className="text-muted">the way.</span>
              </h1>
              <p className="mt-8 max-w-sm text-base text-muted">
                A short line of audio, wearables and phone kit. No carrier
                bloat, no subscription to unlock the thing you already bought.
              </p>
            </div>

            <div>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/products" variant="primary">
                  Shop all
                </ButtonLink>
                {hero ? (
                  <ButtonLink href={`/products/${hero.slug}`} variant="outline">
                    See Signal (2)
                  </ButtonLink>
                ) : null}
              </div>

              <dl className="mt-12 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
                {specLines.map((line) => (
                  <div key={line.k} className="bg-page px-4 py-4">
                    <dt className="label text-muted">{line.k}</dt>
                    <dd className="mt-2 text-sm font-medium">{line.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {hero ? (
            <Link href={`/products/${hero.slug}`} className="group relative block">
              <ProductImage
                imageKey={hero.slug}
                alt={`${hero.name} — ${hero.colorway}`}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
                className="h-full min-h-80 w-full lg:aspect-auto"
                imageClassName="transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 bg-gradient-to-t from-black/80 to-transparent p-5 text-white sm:p-8">
                <div>
                  <p className="label opacity-70">Flagship</p>
                  <p className="mt-2 text-2xl font-medium tracking-tight">
                    {hero.name}
                  </p>
                </div>
                <span className="label border border-white/40 px-3 py-2 backdrop-blur-sm">
                  {formatPrice(hero.priceCents)}
                </span>
              </div>
            </Link>
          ) : null}
        </div>
      </section>

      {/* 01 — Categories as four flush portrait tiles. */}
      <Section
        index="01"
        title="Categories"
        description="Four lines, nothing in between."
      >
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="group relative block bg-page"
            >
              <ProductImage
                imageKey={category.image}
                alt=""
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="aspect-4/5 w-full"
                imageClassName="transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-5 text-white">
                <p className="label opacity-70">{category.tagline}</p>
                <h3 className="mt-2 text-xl font-medium tracking-tight">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* 02 — The catalogue. */}
      <Section
        index="02"
        title="Featured"
        description="What people are actually buying."
        action={
          <Link
            href="/products"
            className="label border-b border-ink pb-1 transition-colors hover:border-accent hover:text-accent"
          >
            All 12 products →
          </Link>
        }
      >
        <ProductGrid products={featured} />
      </Section>

      {/* 03 — Editorial band, full bleed and dark. */}
      <section className="relative isolate border-t border-line bg-black">
        {/* The photo is scenery behind the copy, so it sits in its own
            absolutely-positioned layer rather than fighting ProductImage's
            own `relative` wrapper for the same element. */}
        <div className="absolute inset-0 -z-10">
          <ProductImage
            imageKey="editorial-dark"
            alt=""
            sizes="100vw"
            className="h-full w-full"
            imageClassName="opacity-70"
          />
        </div>
        <div className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="max-w-xl">
            <p className="label flex items-center gap-2 text-white/70">
              <Dot />
              03 — Repairable
            </p>
            <h2 className="mt-6 text-3xl font-medium tracking-tight text-balance text-white sm:text-5xl">
              Every part we can sell you separately, we do.
            </h2>
            <p className="mt-6 max-w-md text-white/70">
              Pads, straps, batteries, cables, screens. Published teardown
              guides and a parts list that stays online for seven years after a
              product leaves the shop.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/products" variant="accent">
                Browse the catalogue
              </ButtonLink>
              <Link
                href="/login"
                className="label inline-flex h-12 items-center border border-white/40 px-7 text-white transition-colors hover:bg-white hover:text-ink"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

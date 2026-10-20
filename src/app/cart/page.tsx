import type { Metadata } from "next";

import { CartView } from "@/components/cart-view";
import { Container, Dot } from "@/components/ui";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Cart",
};

export default async function CartPage() {
  // The whole catalogue is prerendered and handed to the client component,
  // which joins it against the slugs stored in the browser. Nothing about the
  // cart itself reaches the server yet.
  const products = await getProducts();

  return (
    <>
      <div className="dot-field border-b border-line">
        <Container className="py-12 sm:py-16">
          <p className="label flex items-center gap-2 text-accent">
            <Dot />
            Bag
          </p>
          <h1 className="mt-6 text-4xl font-medium tracking-tighter sm:text-6xl">
            Your cart.
          </h1>
        </Container>
      </div>
      <Container className="py-10 sm:py-14">
        <CartView products={products} />
      </Container>
    </>
  );
}

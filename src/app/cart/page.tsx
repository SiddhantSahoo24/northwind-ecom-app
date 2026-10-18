import type { Metadata } from "next";

import { CartView } from "@/components/cart-view";
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
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight sm:text-4xl">
        Your cart
      </h1>
      <CartView products={products} />
    </div>
  );
}

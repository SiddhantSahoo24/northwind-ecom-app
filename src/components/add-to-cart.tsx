"use client";

import { useEffect, useRef, useState } from "react";

import { useCart } from "@/components/cart-store";
import { buttonStyles } from "@/components/ui";

export function AddToCart({
  slug,
  inStock,
  variant = "accent",
  className = "",
  label = "Add to cart",
}: {
  slug: string;
  inStock: boolean;
  variant?: keyof typeof buttonStyles;
  className?: string;
  label?: string;
}) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (!inStock) {
    return (
      <button type="button" disabled className={`${buttonStyles.outline} ${className}`}>
        Out of stock
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`${buttonStyles[variant]} ${className}`}
      onClick={() => {
        add(slug);
        setJustAdded(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setJustAdded(false), 1600);
      }}
    >
      {justAdded ? "Added" : label}
    </button>
  );
}

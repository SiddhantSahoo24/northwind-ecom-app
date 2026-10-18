import type { CategorySlug } from "@/lib/products";

/**
 * Placeholder product art.
 *
 * Real photography will replace this with next/image once there are assets to
 * point at. Until then each category gets a line drawing over a gradient so the
 * grid reads as a product grid rather than a wall of grey boxes.
 *
 * Gradient ids are derived from the slug rather than generated, because
 * Cache Components prerenders these and a random id would differ between the
 * server and client renders.
 */

const palettes: Record<CategorySlug, { from: string; to: string; ink: string }> = {
  audio: { from: "#4c1d95", to: "#7c3aed", ink: "#ddd6fe" },
  desk: { from: "#78350f", to: "#b45309", ink: "#fde68a" },
  lighting: { from: "#9a3412", to: "#ea580c", ink: "#fed7aa" },
  kitchen: { from: "#134e4a", to: "#0d9488", ink: "#99f6e4" },
};

function Glyph({ category, ink }: { category: CategorySlug; ink: string }) {
  const stroke = {
    stroke: ink,
    strokeWidth: 5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };

  switch (category) {
    case "audio":
      return (
        <g {...stroke}>
          <path d="M120 180v-20a80 80 0 0 1 160 0v20" />
          <rect x="96" y="176" width="40" height="64" rx="16" />
          <rect x="264" y="176" width="40" height="64" rx="16" />
        </g>
      );
    case "desk":
      return (
        <g {...stroke}>
          <path d="M80 196h240" />
          <path d="M104 196v52M296 196v52" />
          <rect x="156" y="120" width="88" height="56" rx="6" />
          <path d="M200 176v20" />
        </g>
      );
    case "lighting":
      return (
        <g {...stroke}>
          <path d="M152 164l48-56 48 56z" />
          <path d="M200 164v76" />
          <path d="M168 248h64" />
          <path d="M128 196l-20 12M272 196l20 12M200 92V72" />
        </g>
      );
    case "kitchen":
      return (
        <g {...stroke}>
          <path d="M140 148h104v68a34 34 0 0 1-34 34h-36a34 34 0 0 1-34-34z" />
          <path d="M244 170h20a24 24 0 0 1 0 48h-20" />
          <path d="M172 124c0-12 12-12 12-24M204 124c0-12 12-12 12-24" />
        </g>
      );
  }
}

export function ProductArt({
  category,
  slug,
  className,
}: {
  category: CategorySlug;
  slug: string;
  className?: string;
}) {
  const palette = palettes[category];
  const gradientId = `art-${slug}`;

  return (
    <svg
      viewBox="0 0 400 300"
      role="presentation"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette.from} />
          <stop offset="100%" stopColor={palette.to} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${gradientId})`} />
      <circle cx="330" cy="70" r="90" fill="#ffffff" fillOpacity="0.06" />
      <circle cx="70" cy="250" r="70" fill="#000000" fillOpacity="0.08" />
      <Glyph category={category} ink={palette.ink} />
    </svg>
  );
}

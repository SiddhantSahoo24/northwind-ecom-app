import Image from "next/image";

import { getImage } from "@/lib/images";

/**
 * Photography.
 *
 * Every shot is a local WebP under `public/` with its real dimensions and an
 * inline LQIP recorded in the manifest, so `fill` never causes layout shift and
 * the blur-up needs no extra request. The caller owns the aspect ratio by
 * sizing this wrapper; the photo covers it.
 *
 * `sizes` is required rather than optional on purpose — omitting it makes
 * next/image serve the largest candidate to every viewport, which is the single
 * easiest way to make an image-heavy storefront slow.
 */
export function ProductImage({
  imageKey,
  alt,
  sizes,
  priority = false,
  className = "",
  imageClassName = "",
}: {
  imageKey: string;
  /** Overrides the manifest's own alt text; pass "" for purely decorative art. */
  alt?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  const image = getImage(imageKey);

  // A missing asset degrades to the plate rather than throwing. Run
  // `node scripts/fetch-images.mjs` if one shows up blank.
  if (!image) {
    return <div className={`bg-plate ${className}`} aria-hidden="true" />;
  }

  return (
    <div className={`relative overflow-hidden bg-plate ${className}`}>
      <Image
        src={image.src}
        alt={alt ?? image.alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={image.blurDataURL}
        className={`object-cover ${imageClassName}`}
      />
    </div>
  );
}

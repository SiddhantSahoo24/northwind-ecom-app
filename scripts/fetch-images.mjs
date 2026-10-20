/**
 * One-shot asset fetcher.
 *
 * Pulls the storefront photography from Unsplash into `public/`, converts it to
 * WebP, and writes `src/lib/image-manifest.json` with the intrinsic dimensions
 * plus a tiny base64 LQIP for each file. Committing the output means the app
 * never touches the network at build or request time, and `next/image` gets
 * real `width`/`height`/`blurDataURL` values without static imports — which it
 * would otherwise need, and which do not work from the client components that
 * also render product art.
 *
 * Re-run with `node scripts/fetch-images.mjs` after editing SOURCES; pass
 * `--force` to re-download files that are already on disk.
 *
 * Photos are from Unsplash under the Unsplash License. `credit` is carried
 * through to the manifest so the attribution page can render it.
 */

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Long edge we store. next/image resizes down from here; nothing needs more. */
const STORED_WIDTH = 1400;
const QUALITY = 74;
/** LQIP width. 20px keeps the data URI under ~500 bytes after WebP. */
const BLUR_WIDTH = 20;

/**
 * key -> { id, alt, credit, dir }
 *
 * `key` is also the filename. Product keys match the product slug in
 * src/lib/products.ts; everything else is scenery.
 */
const SOURCES = {
  // --- Audio -------------------------------------------------------------
  "drift-open-earbuds": {
    id: "1606220945770-b5b6c2c55bf1",
    dir: "products",
    alt: "Wireless earbuds resting in an open charging case under red and blue light",
    credit: "Unsplash",
  },
  "drift-earbuds-lite": {
    id: "1572569511254-d8f925fe2cbb",
    dir: "products",
    alt: "White wireless earbuds beside their open charging case",
    credit: "Unsplash",
  },
  "field-over-ear": {
    id: "1546435770-a3e426bf472b",
    dir: "products",
    alt: "Matte black over-ear headphones lying on a pale desk",
    credit: "Unsplash",
  },
  "field-over-ear-sand": {
    id: "1545127398-14699f92334b",
    dir: "products",
    alt: "Over-ear headphones in a warm sand colourway on a plain background",
    credit: "Unsplash",
  },

  // --- Wearables ---------------------------------------------------------
  "arc-watch": {
    id: "1523275335684-37898b6baf30",
    dir: "products",
    alt: "A round-faced smart watch laid flat with its white strap unfastened",
    credit: "Unsplash",
  },
  "arc-watch-pro": {
    id: "1546868871-7041f2a55e12",
    dir: "products",
    alt: "A black smart watch with a dark strap on a white surface",
    credit: "Unsplash",
  },

  // --- Phone -------------------------------------------------------------
  "signal-two": {
    id: "1512499617640-c74ae3a79d37",
    dir: "products",
    alt: "A smartphone held in front of a ring of blue light",
    credit: "Unsplash",
  },
  "signal-two-pro": {
    id: "1574944985070-8f3ebc6b79d2",
    dir: "products",
    alt: "Close-up of a smartphone's rear camera array",
    credit: "Unsplash",
  },
  "signal-aramid-case": {
    id: "1601593346740-925612772716",
    dir: "products",
    alt: "A hand holding a slim black woven-aramid phone case",
    credit: "Unsplash",
  },

  // --- Power -------------------------------------------------------------
  "plate-wireless-charger": {
    id: "1591290619618-904f6dd935e3",
    dir: "products",
    alt: "A round white wireless charging pad on a wooden surface",
    credit: "Unsplash",
  },
  "loop-usb-c-cable": {
    id: "1615526675159-e248c3021d3f",
    dir: "products",
    alt: "A coiled white charging cable and puck on a dark background",
    credit: "Unsplash",
  },
  "brick-65w-adapter": {
    id: "1583863788434-e58a36330cf0",
    dir: "products",
    alt: "A white power adapter with its cable coiled beside it",
    credit: "Unsplash",
  },

  // --- Scenery: category tiles, hero, editorial --------------------------
  "cat-audio": {
    id: "1583394838336-acd977736f90",
    dir: "scene",
    alt: "Black over-ear headphones photographed against a plain backdrop",
    credit: "Unsplash",
  },
  "cat-wearables": {
    id: "1508685096489-7aacd43bd3b1",
    dir: "scene",
    alt: "A smart watch worn on a wrist, screen lit",
    credit: "Unsplash",
  },
  "cat-phone": {
    id: "1592899677977-9c10ca588bbd",
    dir: "scene",
    alt: "A smartphone and earbuds on a dark wooden table",
    credit: "Unsplash",
  },
  "cat-power": {
    id: "1498049794561-7780e7231661",
    dir: "scene",
    alt: "Headphones and a phone arranged on a white desk",
    credit: "Unsplash",
  },
  "editorial-dark": {
    id: "1531297484001-80022131f5a1",
    dir: "scene",
    alt: "A laptop glowing against a dark room, lit in red and orange",
    credit: "Unsplash",
  },
};

async function fetchRetry(url, tries = 6) {
  let last;
  for (let attempt = 0; attempt < tries; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
      if (response.ok) return Buffer.from(await response.arrayBuffer());
      last = new Error(`HTTP ${response.status}`);
      // A 404 is a bad photo id; retrying will not fix it.
      if (response.status === 404) break;
    } catch (error) {
      last = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 900 * (attempt + 1)));
  }
  throw last ?? new Error("unreachable");
}

const force = process.argv.includes("--force");
const manifest = {};
const failures = [];

for (const [key, source] of Object.entries(SOURCES)) {
  const relative = `${source.dir}/${key}.webp`;
  const absolute = path.join(ROOT, "public", relative);
  await mkdir(path.dirname(absolute), { recursive: true });

  let file;
  if (!force) {
    file = await readFile(absolute).catch(() => undefined);
  }

  if (!file) {
    const url =
      `https://images.unsplash.com/photo-${source.id}` +
      `?w=${STORED_WIDTH}&q=${QUALITY}&fm=webp&fit=max`;
    try {
      file = await fetchRetry(url);
    } catch (error) {
      failures.push(`${key}: ${error.message}`);
      continue;
    }
    await writeFile(absolute, file);
  }

  const { width, height } = await sharp(file).metadata();
  const blur = await sharp(file)
    .resize(BLUR_WIDTH, null, { fit: "inside" })
    .webp({ quality: 35 })
    .toBuffer();

  manifest[key] = {
    src: `/${relative}`,
    width,
    height,
    alt: source.alt,
    credit: source.credit,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    // Lets a later run notice the source changed even if the file exists.
    sourceHash: createHash("sha1").update(source.id).digest("hex").slice(0, 8),
  };

  console.log(
    `ok  ${relative}  ${width}x${height}  ${(file.length / 1024).toFixed(0)}kb`,
  );
}

await writeFile(
  path.join(ROOT, "src/lib/image-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(`\nwrote src/lib/image-manifest.json (${Object.keys(manifest).length} entries)`);

if (failures.length > 0) {
  console.error(`\n${failures.length} failed:\n  ${failures.join("\n  ")}`);
  process.exit(1);
}

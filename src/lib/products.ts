/**
 * Mock catalog.
 *
 * Deliberately shaped like the database layer that will replace it: every
 * accessor is async and marked `use cache`, so swapping the arrays below for
 * Drizzle queries against src/db/schema.ts is a drop-in change — the pages
 * calling them do not move.
 *
 * Money is stored in integer cents, never floats, for the same reason.
 */

export type CategorySlug = "audio" | "desk" | "lighting" | "kitchen";

export type Category = {
  slug: CategorySlug;
  name: string;
  tagline: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  priceCents: number;
  /** Original price, when the item is marked down. */
  compareAtCents?: number;
  rating: number;
  reviewCount: number;
  blurb: string;
  description: string;
  features: string[];
  badge?: string;
  inStock: boolean;
};

export const categories: Category[] = [
  { slug: "audio", name: "Audio", tagline: "Sound worth sitting down for" },
  { slug: "desk", name: "Workspace", tagline: "Built for long days" },
  { slug: "lighting", name: "Lighting", tagline: "Warmth, on a dimmer" },
  { slug: "kitchen", name: "Kitchen", tagline: "Everyday things, made well" },
];

const catalog: Product[] = [
  {
    id: "p_orbit",
    slug: "orbit-over-ear-headphones",
    name: "Orbit Over-Ear Headphones",
    category: "audio",
    priceCents: 24900,
    compareAtCents: 29900,
    rating: 4.8,
    reviewCount: 412,
    badge: "Best seller",
    blurb: "Forty hours of playback and a headband you forget you are wearing.",
    description:
      "Orbit pairs a 40mm beryllium-coated driver with memory-foam earcups wrapped in lambskin. The result is a closed-back pair you can wear through a full workday without the clamp fatigue that usually sets in around hour three.",
    features: [
      "40-hour battery, 10-minute quick charge",
      "Hybrid active noise cancellation",
      "Multipoint pairing across two devices",
      "Replaceable earpads and headband",
    ],
    inStock: true,
  },
  {
    id: "p_pebble",
    slug: "pebble-portable-speaker",
    name: "Pebble Portable Speaker",
    category: "audio",
    priceCents: 8900,
    rating: 4.5,
    reviewCount: 238,
    blurb: "Pocket-sized, weatherproof, and louder than it has any right to be.",
    description:
      "A passive radiator does the heavy lifting here, pushing low end out of an enclosure that fits in one hand. IP67 sealed, so it lives on the kitchen windowsill or the edge of the bath without complaint.",
    features: [
      "IP67 dust and water sealed",
      "12-hour battery",
      "Pair two for true stereo",
      "USB-C, charges in 90 minutes",
    ],
    inStock: true,
  },
  {
    id: "p_cadence",
    slug: "cadence-studio-monitors",
    name: "Cadence Studio Monitors",
    category: "audio",
    priceCents: 44900,
    rating: 4.9,
    reviewCount: 96,
    blurb: "Near-field monitors that tell you the truth about your mix.",
    description:
      "Sold as a matched pair. A front-firing port means they stay honest pushed up against a wall, which is where most desks put them anyway.",
    features: [
      "5-inch woven cone, 1-inch silk tweeter",
      "Front-firing port for near-wall placement",
      "Balanced TRS and XLR inputs",
      "Matched pair, serial-numbered",
    ],
    inStock: true,
  },
  {
    id: "p_larch",
    slug: "larch-oak-desk",
    name: "Larch Oak Desk",
    category: "desk",
    priceCents: 64900,
    rating: 4.7,
    reviewCount: 154,
    badge: "New",
    blurb: "Solid white oak on a powder-coated steel frame.",
    description:
      "The top is 25mm solid white oak, finished in hardwax oil rather than lacquer so scratches sand out instead of showing through. The frame is welded, not bolted, and arrives in one piece.",
    features: [
      "25mm solid white oak, hardwax oil finish",
      "Welded steel frame, four-point levelling",
      "140 x 70cm work surface",
      "Integrated cable tray",
    ],
    inStock: true,
  },
  {
    id: "p_vertex",
    slug: "vertex-task-chair",
    name: "Vertex Task Chair",
    category: "desk",
    priceCents: 38900,
    compareAtCents: 45900,
    rating: 4.6,
    reviewCount: 307,
    blurb: "Mesh back, forward tilt, and a twelve-year warranty.",
    description:
      "Adjustment you set once and stop thinking about: seat depth, arm height and width, lumbar position, and a tilt lock that actually holds. The mesh is a two-layer weave that keeps its tension.",
    features: [
      "Seat depth and lumbar adjustment",
      "4D armrests",
      "Forward-tilt mode for drafting",
      "Twelve-year warranty",
    ],
    inStock: true,
  },
  {
    id: "p_fold",
    slug: "fold-laptop-riser",
    name: "Fold Laptop Riser",
    category: "desk",
    priceCents: 7900,
    rating: 4.4,
    reviewCount: 521,
    blurb: "Folds flat to 8mm. Holds a 16-inch machine without flexing.",
    description:
      "Anodised aluminium, hinged in two places, with silicone pads where it touches both the desk and the laptop. Flat it is a sheet of metal; open it is a six-position stand.",
    features: [
      "Folds to 8mm, 280g",
      "Six height positions",
      "Holds up to 16-inch laptops",
      "Silicone contact pads",
    ],
    inStock: true,
  },
  {
    id: "p_slate",
    slug: "slate-desk-mat",
    name: "Slate Desk Mat",
    category: "desk",
    priceCents: 5900,
    rating: 4.3,
    reviewCount: 189,
    blurb: "Wool felt on cork. Quiet under a keyboard.",
    description:
      "3mm pressed wool felt bonded to a cork backing that grips without adhesive. It takes the edge off mechanical keyboard noise and stops a mouse from skating.",
    features: [
      "Pressed wool felt over natural cork",
      "90 x 40cm",
      "Non-slip without adhesive",
      "Spot-cleanable",
    ],
    inStock: false,
  },
  {
    id: "p_beacon",
    slug: "beacon-table-lamp",
    name: "Beacon Table Lamp",
    category: "lighting",
    priceCents: 12900,
    rating: 4.7,
    reviewCount: 143,
    blurb: "Stepless dimming from candlelight to task-bright.",
    description:
      "A touch-sensitive stem dims from 5 to 100 percent with no visible steps and no audible buzz. The shade is spun aluminium with a matte interior, so the light lands on the desk rather than in your eyes.",
    features: [
      "Stepless touch dimming, 5-100%",
      "2700K warm white",
      "Spun aluminium shade",
      "Weighted base, 1.8kg",
    ],
    inStock: true,
  },
  {
    id: "p_halo",
    slug: "halo-floor-lamp",
    name: "Halo Floor Lamp",
    category: "lighting",
    priceCents: 21900,
    rating: 4.5,
    reviewCount: 78,
    blurb: "Uplight for the ceiling, reading light for the chair.",
    description:
      "Two independently switched circuits in one stem: a wide uplight that bounces off the ceiling, and a narrow downlight on an articulated arm for the chair beside it.",
    features: [
      "Two independent circuits",
      "Articulated reading arm",
      "165cm tall",
      "Dimmable on both circuits",
    ],
    inStock: true,
  },
  {
    id: "p_ember",
    slug: "ember-candle-set",
    name: "Ember Candle Set",
    category: "lighting",
    priceCents: 3400,
    rating: 4.2,
    reviewCount: 264,
    blurb: "Three scents, sixty hours. Cedar, fig, and sea salt.",
    description:
      "Poured in small batches into reusable pressed-glass vessels. Cotton wicks, coconut-soy wax, and a scent throw that fills a room without taking it over.",
    features: [
      "Three 200g candles",
      "Coconut-soy wax, cotton wick",
      "Roughly 20 hours each",
      "Reusable pressed-glass vessels",
    ],
    inStock: true,
  },
  {
    id: "p_kiln",
    slug: "kiln-stoneware-mug",
    name: "Kiln Stoneware Mug",
    category: "kitchen",
    priceCents: 2800,
    rating: 4.6,
    reviewCount: 398,
    blurb: "Thrown, glazed, and heavy enough to hold the heat.",
    description:
      "350ml of reactive-glazed stoneware. Each one comes out of the kiln slightly different, which is the point. Dishwasher and microwave safe despite looking precious.",
    features: [
      "350ml capacity",
      "Reactive glaze, no two alike",
      "Dishwasher and microwave safe",
      "Stacks without chipping",
    ],
    inStock: true,
  },
  {
    id: "p_harvest",
    slug: "harvest-cutting-board",
    name: "Harvest Cutting Board",
    category: "kitchen",
    priceCents: 6400,
    rating: 4.8,
    reviewCount: 211,
    badge: "Staff pick",
    blurb: "End-grain maple. Kind to knives, hard on everything else.",
    description:
      "End-grain construction means the blade parts the wood fibres instead of cutting across them, so edges last longer and the board closes up behind them. A juice groove runs three sides.",
    features: [
      "End-grain hard maple",
      "45 x 30 x 4cm",
      "Juice groove on three sides",
      "Food-safe mineral oil finish",
    ],
    inStock: true,
  },
];

export type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

export const sortOptions: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "rating", label: "Top rated" },
];

export async function getCategories(): Promise<Category[]> {
  "use cache";
  return categories;
}

export async function getProducts(options?: {
  category?: string;
  sort?: string;
  q?: string;
  limit?: number;
}): Promise<Product[]> {
  "use cache";

  const category = options?.category;
  let rows =
    category && category !== "all"
      ? catalog.filter((p) => p.category === category)
      : [...catalog];

  const q = options?.q?.trim().toLowerCase();
  if (q) {
    // Naive substring match. Becomes a Postgres full-text or trigram query
    // once the catalog is in the database.
    rows = rows.filter((p) =>
      `${p.name} ${p.blurb} ${p.category}`.toLowerCase().includes(q),
    );
  }

  switch (options?.sort) {
    case "price-asc":
      rows.sort((a, b) => a.priceCents - b.priceCents);
      break;
    case "price-desc":
      rows.sort((a, b) => b.priceCents - a.priceCents);
      break;
    case "rating":
      rows.sort((a, b) => b.rating - a.rating);
      break;
    default:
      // "featured": in-stock first, then by review volume — a stand-in for
      // whatever ranking the real store ends up using.
      rows.sort((a, b) => {
        if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
        return b.reviewCount - a.reviewCount;
      });
  }

  return typeof options?.limit === "number" ? rows.slice(0, options.limit) : rows;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  "use cache";
  return catalog.find((p) => p.slug === slug);
}

export async function getRelatedProducts(slug: string, limit = 3): Promise<Product[]> {
  "use cache";

  const product = catalog.find((p) => p.slug === slug);
  if (!product) return [];

  const sameCategory = catalog.filter(
    (p) => p.category === product.category && p.slug !== slug,
  );
  const rest = catalog.filter(
    (p) => p.category !== product.category && p.slug !== slug,
  );

  return [...sameCategory, ...rest].slice(0, limit);
}

export async function getAllProductSlugs(): Promise<string[]> {
  "use cache";
  return catalog.map((p) => p.slug);
}

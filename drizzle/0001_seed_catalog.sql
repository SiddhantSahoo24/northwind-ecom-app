-- Custom SQL migration file, put your code below! --

-- Seed data for the catalogue, ported from the in-memory arrays that used to
-- live in src/lib/products.ts.
--
-- Idempotent: every statement ends in ON CONFLICT DO NOTHING, so a re-run is a
-- no-op rather than an error. Foreign keys resolve by slug, so no uuid is
-- hardcoded here.
--
-- Product slugs must stay in step with src/lib/image-manifest.json and the
-- SOURCES map in scripts/fetch-images.mjs — a slug with no manifest entry
-- renders as a blank plate.

INSERT INTO "categories" ("slug", "name", "tagline", "image_key", "position") VALUES
  ('audio',     'Audio',     'Buds and cans',           'cat-audio',     0),
  ('wearables', 'Wearables', 'On the wrist',            'cat-wearables', 1),
  ('phone',     'Phone',     'The handset and its kit', 'cat-phone',     2),
  ('power',     'Power',     'Charge, carry, connect',  'cat-power',     3)
ON CONFLICT ("slug") DO NOTHING;
--> statement-breakpoint

-- The casts on the first row fix each VALUES column's type; later rows inherit it.
INSERT INTO "products" (
  "slug", "name", "category_id", "price_cents", "compare_at_cents", "rating",
  "review_count", "blurb", "description", "features", "specs", "badge", "colorway"
)
SELECT
  v."slug", v."name", c."id", v."price_cents", v."compare_at_cents", v."rating",
  v."review_count", v."blurb", v."description", v."features", v."specs",
  v."badge", v."colorway"
FROM (VALUES
  (
    'drift-open-earbuds', 'Drift Open Earbuds', 'audio',
    14900, 17900::integer, 4.7::numeric(2,1), 1284,
    'Open-back buds you can wear through a whole commute.',
    'A 12mm driver in a half-open shell, so you hear the road without pulling a bud out. The case is machined from a single block and charges over USB-C or any Qi pad, and the stems take a pinch rather than a tap, which is harder to trigger by accident.',
    '["Eight hours a charge, thirty with the case","Adaptive noise reduction, three levels","Pinch controls, no accidental taps","IP54, sweat and light rain"]'::jsonb,
    '[{"label":"Driver","value":"12mm dynamic"},{"label":"Battery","value":"8h / 30h with case"},{"label":"Charging","value":"USB-C, Qi"},{"label":"Weight","value":"4.6g per bud"}]'::jsonb,
    'Best seller'::text, 'Transparent / Blue'
  ),
  (
    'drift-earbuds-lite', 'Drift Earbuds Lite', 'audio',
    7900, NULL, 4.4, 2310,
    'The same fit and controls, half the price.',
    'Lite drops the adaptive mode and the wireless charging coil and keeps everything else: the shell, the pinch controls, the case hinge rated to ten thousand cycles. If you lose a bud a month, buy these.',
    '["Nine hours a charge, thirty-six with the case","Single-level noise reduction","Pinch controls","IP54"]',
    '[{"label":"Driver","value":"11mm dynamic"},{"label":"Battery","value":"9h / 36h with case"},{"label":"Charging","value":"USB-C"},{"label":"Weight","value":"4.1g per bud"}]',
    NULL, 'White'
  ),
  (
    'field-over-ear', 'Field Over-Ear', 'audio',
    29900, NULL, 4.8, 642,
    'Forty hours of playback and a headband you forget about.',
    'A 40mm driver behind memory foam wrapped in protein leather. The clamp is tuned low on purpose — these are built for the eight-hour day rather than the forty-minute demo — and the pads, headband and cable all come off with a twist for replacement.',
    '["Forty-hour battery, ten-minute quick charge","Hybrid active noise cancellation","Multipoint across two devices","Replaceable pads, headband and cable"]',
    '[{"label":"Driver","value":"40mm dynamic"},{"label":"Battery","value":"40h ANC on"},{"label":"Charging","value":"USB-C, 10min = 6h"},{"label":"Weight","value":"248g"}]',
    NULL, 'Black'
  ),
  (
    'field-over-ear-sand', 'Field Over-Ear (Sand)', 'audio',
    29900, NULL, 4.8, 188,
    'Field, in a warm matte finish that does not show fingerprints.',
    'Identical hardware to the black Field. The difference is a powder-coated sand finish on the yokes and a lighter pad weave, which runs cooler against the head in summer and hides the marks that a dark matte picks up.',
    '["Forty-hour battery, ten-minute quick charge","Hybrid active noise cancellation","Multipoint across two devices","Lighter, cooler-running pad weave"]',
    '[{"label":"Driver","value":"40mm dynamic"},{"label":"Battery","value":"40h ANC on"},{"label":"Charging","value":"USB-C, 10min = 6h"},{"label":"Weight","value":"246g"}]',
    'New colour', 'Sand'
  ),
  (
    'arc-watch', 'Arc Watch', 'wearables',
    19900, NULL, 4.5, 907,
    'Fourteen days between charges. Reads in direct sun.',
    'A 1.4-inch AMOLED under flat sapphire, bright enough to read outdoors without the always-on mode draining the battery. Sleep and heart rate run continuously; GPS is on the watch rather than borrowed from the phone.',
    '["Fourteen-day battery, typical use","1.4-inch AMOLED, 1000 nits","On-board GPS","5ATM, swim safe"]',
    '[{"label":"Display","value":"1.4\" AMOLED, 466×466"},{"label":"Battery","value":"14 days typical"},{"label":"Water","value":"5ATM"},{"label":"Case","value":"Aluminium, 44mm"}]',
    NULL, 'Silver / White'
  ),
  (
    'arc-watch-pro', 'Arc Watch Pro', 'wearables',
    27900, 31900, 4.6, 341,
    'Steel case, dual-band GPS, and a strap that survives salt water.',
    'Pro trades aluminium for brushed steel and adds dual-band GPS, which is the difference between a usable track and a scribble in a city centre. The fluoroelastomer strap rinses clean and does not stiffen after sea water.',
    '["Dual-band GPS","Brushed steel case, sapphire crystal","Twelve-day battery, typical use","10ATM, dive-rated strap"]',
    '[{"label":"Display","value":"1.5\" AMOLED, 480×480"},{"label":"Battery","value":"12 days typical"},{"label":"Water","value":"10ATM"},{"label":"Case","value":"Steel, 46mm"}]',
    NULL, 'Black'
  ),
  (
    'signal-two', 'Signal (2)', 'phone',
    49900, NULL, 4.6, 1522,
    'Five years of updates and a battery that lasts the day out.',
    'A 6.7-inch 120Hz panel, a 5000mAh cell, and a software build with nothing preinstalled that you cannot remove. Five full OS versions and seven years of security patches are committed to in writing, not in a press release.',
    '["6.7-inch 120Hz LTPO panel","5000mAh, 45W wired and 15W wireless","Five OS updates, seven years of patches","No preinstalled third-party apps"]',
    '[{"label":"Display","value":"6.7\" LTPO, 1-120Hz"},{"label":"Battery","value":"5000mAh"},{"label":"Charging","value":"45W wired / 15W Qi"},{"label":"Storage","value":"256GB"}]',
    'Flagship', 'Black'
  ),
  (
    'signal-two-pro', 'Signal (2) Pro', 'phone',
    69900, NULL, 4.9, 418,
    'A larger sensor, a real telephoto, and the same update promise.',
    'Pro keeps the body and the software and changes the camera island: a 1-inch main sensor, a 3x periscope that focuses close enough to be useful indoors, and raw capture that is actually linear rather than pre-cooked.',
    '["1-inch main sensor, 50MP","3x periscope telephoto","Linear raw capture","Five OS updates, seven years of patches"]',
    '[{"label":"Main","value":"1\" 50MP, f/1.6 OIS"},{"label":"Tele","value":"3x periscope, 50MP"},{"label":"Battery","value":"5200mAh"},{"label":"Storage","value":"512GB"}]',
    NULL, 'Graphite'
  ),
  (
    'signal-aramid-case', 'Signal Aramid Case', 'phone',
    5900, NULL, 4.3, 764,
    '0.9mm of woven aramid. Adds grip, not bulk.',
    'Woven aramid over a thin TPU rail, so the corners absorb a drop while the back stays rigid. It is thin enough that wireless charging works through it and the buttons keep their click.',
    '["0.9mm woven aramid back","Raised TPU corner rail","Qi charges through it","Fits Signal (2) and (2) Pro"]',
    '[{"label":"Material","value":"Aramid over TPU"},{"label":"Thickness","value":"0.9mm back"},{"label":"Weight","value":"22g"},{"label":"Fits","value":"Signal (2), (2) Pro"}]',
    NULL, 'Woven Black'
  ),
  (
    'plate-wireless-charger', 'Plate Wireless Charger', 'power',
    4900, NULL, 4.4, 530,
    '15W, silent, and it does not slide across the desk.',
    'No fan — the coil is spread across an aluminium plate that doubles as the heatsink, so it runs warm and quiet rather than hot and whirring. The underside is one continuous silicone pad, which is why it stays put.',
    '["15W Qi2 with magnetic alignment","Fanless, aluminium heatsink","Full-face silicone base","1.5m braided USB-C lead included"]',
    '[{"label":"Output","value":"15W Qi2"},{"label":"Input","value":"USB-C, 20W"},{"label":"Diameter","value":"96mm"},{"label":"Weight","value":"180g"}]',
    NULL, 'White'
  ),
  (
    'loop-usb-c-cable', 'Loop USB-C Cable', 'power',
    2400, NULL, 4.2, 1193,
    '240W rated, braided, and it coils flat instead of fighting you.',
    'Most cables take a set after a month in a bag. This one is braided over a silicone core that relaxes back to straight, and the strain relief is moulded rather than glued, which is where cheap cables fail first.',
    '["240W (48V/5A) power delivery","USB 2.0 data, 480Mbps","Braided over a silicone core","1.5m, moulded strain relief"]',
    '[{"label":"Power","value":"240W, EPR"},{"label":"Data","value":"480Mbps"},{"label":"Length","value":"1.5m"},{"label":"Rating","value":"25,000 bend cycles"}]',
    NULL, 'White'
  ),
  (
    'brick-65w-adapter', 'Brick 65W Adapter', 'power',
    3900, 4900, 4.6, 846,
    'Two ports, GaN internals, and it fits behind a sofa.',
    '65W across two USB-C ports, split 45W and 20W when both are in use — enough for a laptop and a phone off one socket. GaN switching keeps it to the size of a matchbox and the folding pins mean it does not shred a bag lining.',
    '["65W total, two USB-C ports","GaN, runs cool","Folding pins","Laptop and phone at once"]',
    '[{"label":"Output","value":"65W (45W + 20W)"},{"label":"Ports","value":"2 × USB-C"},{"label":"Size","value":"52 × 52 × 30mm"},{"label":"Weight","value":"112g"}]',
    'Staff pick', 'White'
  )
) AS v (
  "slug", "name", "category_slug", "price_cents", "compare_at_cents", "rating",
  "review_count", "blurb", "description", "features", "specs", "badge", "colorway"
)
JOIN "categories" c ON c."slug" = v."category_slug"
ON CONFLICT ("slug") DO NOTHING;
--> statement-breakpoint

-- One stock row per product. signal-aramid-case is deliberately 0: it is the
-- item that exercises the sold-out path (card overlay, disabled button, and
-- last place in the "featured" sort).
INSERT INTO "stock" ("product_id", "quantity")
SELECT p."id", v."quantity"
FROM (VALUES
  ('drift-open-earbuds',     42),
  ('drift-earbuds-lite',     86),
  ('field-over-ear',         18),
  ('field-over-ear-sand',     7),
  ('arc-watch',              31),
  ('arc-watch-pro',          12),
  ('signal-two',             25),
  ('signal-two-pro',          9),
  ('signal-aramid-case',      0),
  ('plate-wireless-charger', 64),
  ('loop-usb-c-cable',      150),
  ('brick-65w-adapter',      48)
) AS v ("slug", "quantity")
JOIN "products" p ON p."slug" = v."slug"
ON CONFLICT ("product_id") DO NOTHING;

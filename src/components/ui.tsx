import Link from "next/link";

/** Small shared primitives, kept in one file while the design is still moving. */

export function Stars({
  rating,
  reviewCount,
  className = "",
}: {
  rating: number;
  reviewCount?: number;
  className?: string;
}) {
  const rounded = Math.round(rating);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex gap-px" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((step) => (
          <span
            key={step}
            className={`h-1.5 w-1.5 ${step <= rounded ? "bg-ink" : "bg-line"}`}
          />
        ))}
      </div>
      <span className="label text-muted tabular-nums">
        {rating.toFixed(1)}
        {typeof reviewCount === "number" ? ` / ${reviewCount}` : ""}
        <span className="sr-only"> out of 5</span>
      </span>
    </div>
  );
}

export function Badge({
  children,
  tone = "accent",
}: {
  children: React.ReactNode;
  tone?: "accent" | "muted" | "sale" | "outline";
}) {
  const tones = {
    accent: "bg-accent text-accent-fg",
    muted: "bg-ink text-page",
    sale: "bg-accent text-accent-fg",
    outline: "border border-current text-ink",
  };

  return (
    <span className={`label inline-flex items-center px-2 py-1 ${tones[tone]}`}>
      {children}
    </span>
  );
}

/** A small red dot, the one piece of colour on an otherwise grey row. */
export function Dot({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-1.5 w-1.5 rounded-full bg-accent ${className}`}
    />
  );
}

/**
 * Buttons are squared and sit flush against the hairline grid. `h-12` is the
 * shared control height — the header search and the sign-in fields match it.
 */
const buttonBase =
  "inline-flex h-12 items-center justify-center gap-2 px-7 label transition-colors disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export const buttonStyles = {
  primary: `${buttonBase} bg-ink text-page hover:bg-accent hover:text-accent-fg`,
  accent: `${buttonBase} bg-accent text-accent-fg hover:brightness-110`,
  outline: `${buttonBase} border border-ink bg-transparent text-ink hover:bg-ink hover:text-page`,
  quiet: `${buttonBase} border border-line bg-transparent text-muted hover:border-ink hover:text-ink`,
};

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: keyof typeof buttonStyles;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${buttonStyles[variant]} ${className}`}>
      {children}
    </Link>
  );
}

/** Shared form control styling — header search and the sign-in fields. */
export const fieldStyles =
  "h-12 w-full border border-line bg-transparent px-4 text-sm outline-none placeholder:text-muted focus:border-ink";

/**
 * Section wrapper. The heading sits on a hairline rule with a numbered index
 * on the left, which is what gives the pages their drawing-sheet feel.
 */
export function Section({
  index,
  title,
  description,
  action,
  children,
  className = "",
}: {
  /** Two-digit section marker, e.g. "02". */
  index?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`border-t border-line ${className}`}>
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              {index ? <span className="label text-accent">{index}</span> : null}
              <span className="label text-muted">{title}</span>
            </div>
            {description ? (
              <h2 className="mt-4 max-w-2xl text-2xl font-medium tracking-tight text-balance sm:text-4xl">
                {description}
              </h2>
            ) : null}
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}

/** Page-level container, matched across every route. */
export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

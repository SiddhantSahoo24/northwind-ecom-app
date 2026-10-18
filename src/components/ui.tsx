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
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((step) => (
          <svg
            key={step}
            viewBox="0 0 20 20"
            className={`h-3.5 w-3.5 ${
              step <= rounded ? "fill-amber-500" : "fill-zinc-300 dark:fill-zinc-700"
            }`}
          >
            <path d="M10 1.5l2.47 5.26 5.53.74-4.05 4.03 1.02 5.72L10 14.6l-4.97 2.65 1.02-5.72L2 7.5l5.53-.74z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-muted">
        {rating.toFixed(1)}
        {typeof reviewCount === "number" ? ` (${reviewCount})` : ""}
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
  tone?: "accent" | "muted" | "sale";
}) {
  const tones = {
    accent: "bg-accent text-accent-fg",
    muted: "bg-zinc-900/80 text-white dark:bg-white/90 dark:text-zinc-900",
    sale: "bg-rose-600 text-white",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

const buttonBase =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export const buttonStyles = {
  primary: `${buttonBase} bg-ink text-surface hover:bg-ink/85`,
  accent: `${buttonBase} bg-accent text-accent-fg hover:brightness-110`,
  outline: `${buttonBase} border border-line bg-transparent text-ink hover:bg-ink/5 dark:hover:bg-white/10`,
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

export function Section({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
          {description ? (
            <p className="mt-2 max-w-xl text-muted">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";

import { buttonStyles, fieldStyles } from "@/components/ui";

/**
 * The sign-in surface, deliberately not yet connected.
 *
 * `authClient` exists in src/lib/auth-client.ts and the catch-all route at
 * /api/auth/[...all] is live, but betterAuth() in src/lib/auth.ts has no
 * providers configured and the auth tables have not been generated — so
 * calling authClient.signIn.email() here would 500 rather than fail politely.
 *
 * Once `npm run auth:generate` has run and emailAndPassword is enabled, the
 * submit handler below becomes:
 *
 *   await authClient.signIn.email({ email, password, callbackURL: "/" })
 */
export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState(false);

  return (
    <div className="mt-8">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setNotice(true);
        }}
      >
        <div className="space-y-1.5">
          <label htmlFor="email" className="label text-muted">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className={fieldStyles}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="label text-muted">
              Password
            </label>
            <span className="label text-muted">Forgot it?</span>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className={fieldStyles}
          />
        </div>

        <button type="submit" className={`${buttonStyles.primary} w-full`}>
          Continue
        </button>
      </form>

      {notice ? (
        <div
          role="status"
          className="mt-5 border-l-2 border-accent bg-plate p-4 text-sm"
        >
          <p className="font-medium">Auth is not wired up yet.</p>
          <p className="mt-1.5 text-muted">
            The route at <code className="font-mono">/api/auth/[...all]</code> is
            live, but <code className="font-mono">betterAuth()</code> has no
            providers and the auth tables do not exist. Run{" "}
            <code className="font-mono">npm run auth:generate</code>, re-export
            the generated schema, migrate, then enable{" "}
            <code className="font-mono">emailAndPassword</code>.
          </p>
        </div>
      ) : null}

      <div className="mt-8 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="label text-muted">or</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="mt-6 space-y-3">
        {["Google", "GitHub"].map((provider) => (
          <button
            key={provider}
            type="button"
            onClick={() => setNotice(true)}
            className={`${buttonStyles.outline} w-full`}
          >
            Continue with {provider}
          </button>
        ))}
      </div>

      <p className="label mt-8 text-center text-muted">
        New here?{" "}
        <Link href="/login" className="text-ink hover:text-accent">
          Create an account
        </Link>
      </p>
    </div>
  );
}

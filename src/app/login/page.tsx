import type { Metadata } from "next";

import { SignInForm } from "@/components/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="dot-field min-h-[70vh] py-16 sm:py-24">
      <div className="mx-auto w-full max-w-md border border-line bg-page px-6 py-10 sm:px-10">
        <p className="label text-accent">Account</p>
        <h1 className="mt-5 text-3xl font-medium tracking-tighter">Sign in.</h1>
        <p className="mt-3 text-sm text-muted">
          One account for orders, saved carts, and returns.
        </p>
        <SignInForm />
      </div>
    </div>
  );
}

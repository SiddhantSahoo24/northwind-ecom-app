import { createAuthClient } from "better-auth/react";

/**
 * Browser-side Better Auth client. Import this in Client Components to read the
 * session or call sign-in/sign-out once those flows exist.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";

// Catch-all: every /api/auth/* request is handed to Better Auth.
export const { GET, POST } = toNextJsHandler(auth.handler);

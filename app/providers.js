"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Provider wrapper for Next-Auth session management
 */
export function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

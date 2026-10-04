"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { Toaster } from "sonner";
import QueryProvider from "./query.provider";

export default function Providers({ children }: { children: ReactNode }) {
  // Re-sync readable proxy cookies from persisted Zustand tokens on boot.
  // Covers sessions created before the qd_auth/qd_role cookies existed.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("quickdrop-auth");
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        state?: { accessToken?: string | null };
      };
      const token = parsed?.state?.accessToken;
      if (!token) return;
      if (!document.cookie.includes("qd_auth=1")) {
        const part = token.split(".")[1];
        let role: string | null = null;
        try {
          const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
          const payload = JSON.parse(atob(base64)) as { role?: unknown };
          role = typeof payload.role === "string" ? payload.role : null;
        } catch {
          role = null;
        }
        // biome-ignore lint/suspicious/noDocumentCookie: re-sync UX cookies for proxy redirects.
        document.cookie = `qd_auth=1; path=/; max-age=604800; SameSite=Lax`;
        if (role)
          // biome-ignore lint/suspicious/noDocumentCookie: re-sync UX cookies for proxy redirects.
          document.cookie = `qd_role=${role}; path=/; max-age=604800; SameSite=Lax`;
      }
    } catch {
      // Ignore malformed persisted auth — guards handle logged-out state.
    }
  }, []);

  return (
    <QueryProvider>
      {children}
      <Toaster richColors position="top-right" />
    </QueryProvider>
  );
}

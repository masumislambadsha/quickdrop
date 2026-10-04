import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clear: () => void;
}

function setRoleCookies(role: string | null) {
  if (typeof document === "undefined") return;
  if (role) {
    // Readable UX cookies for proxy.ts (Edge cannot read localStorage).
    // Real authorization stays in backend RBAC + RoleGuard; these only
    // drive redirect destinations to avoid false loops.
    // biome-ignore lint/suspicious/noDocumentCookie: UX cookie for proxy redirects.
    document.cookie = `qd_auth=1; path=/; max-age=604800; SameSite=Lax`;
    // biome-ignore lint/suspicious/noDocumentCookie: UX cookie for proxy redirects.
    document.cookie = `qd_role=${role}; path=/; max-age=604800; SameSite=Lax`;
  } else {
    // biome-ignore lint/suspicious/noDocumentCookie: clear UX cookie on logout.
    document.cookie = `qd_auth=; path=/; max-age=0; SameSite=Lax`;
    // biome-ignore lint/suspicious/noDocumentCookie: clear UX cookie on logout.
    document.cookie = `qd_role=; path=/; max-age=0; SameSite=Lax`;
  }
}

function roleFromToken(token: string): string | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const payload = JSON.parse(new TextDecoder().decode(bytes)) as {
      role?: unknown;
    };
    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
        setRoleCookies(roleFromToken(accessToken));
      },
      clear: () => {
        set({ accessToken: null, refreshToken: null });
        setRoleCookies(null);
      },
    }),
    {
      name: "quickdrop-auth",
      partialize: (s) => ({
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
      }),
    },
  ),
);

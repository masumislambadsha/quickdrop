import type { MetadataRoute } from "next";

const STATIC_ROUTES = [
  "",
  "/about",
  "/services",
  "/contact",
  "/pricing",
  "/track",
  "/login",
  "/register",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000";
  const now = new Date();
  return STATIC_ROUTES.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
  }));
}

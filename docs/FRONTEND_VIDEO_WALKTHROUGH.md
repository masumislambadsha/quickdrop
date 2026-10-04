# QuickDrop Frontend — B7A7 Video Walkthrough (5–10 min)

Record 1080p Loom/OBS, English or Bengali. Follow this order — maps 1:1 to B7A7 Video Guide.

## 1. Project overview & UI philosophy (0:00–1:00)
- QuickDrop Courier & Logistics, Next.js 16 App Router + TS strict + Tailwind v4 + Heroui/Radix.
- Show repo tree `src/app`, `src/components`, `src/hooks`, `src/store`.
- Design system: Inter Tight display, cream/forest/mint, `DataTable/StatusBadge/EmptyState`.

## 2. Next.js architecture (1:00–2:30)
- Open `src/app/layout.tsx` (metadata + OG), `(marketing)/page.tsx` Server Component.
- Show `proxy.ts` matcher blocking `/admin,/courier,/dashboard`, `loading.tsx` per segment (admin/courier/dashboard), `error.tsx` + `global-error.tsx`, `not-found.tsx`.
- Point out `"use client"` only for forms, guards, interactive modules.

## 3. Auth & role UI (2:30–4:30)
- `/login` one-click Demo Login x3. Login as Customer → `/dashboard`, logout, login as Courier → `/courier`, login as Admin → `/admin`.
- Show sidebar/nav change per role. Direct `/admin` as customer → redirected to role home. Show `RoleGuard` + `proxy.ts`.

## 4. API & state (4:30–6:00)
- Open `/dashboard/shipments` with `?page&search&status` — change filter, copy URL, reload proves bookmarkable.
- DevTools Network: TanStack Query caching (`keepPreviousData`, infinite `Load More`), Zustand `quickdrop-auth` persist.
- Show skeleton → data → `EmptyState` (filter to no results).

## 5. Forms & errors (6:00–7:30)
- `/dashboard/shipments/new` 3-step wizard: submit empty step 1 → Zod messages. Complete → `Book & pay with Stripe`.
- Disconnect network or bad code on `/courier/deliveries/[id]` confirm → toast + `error.tsx` retry, never blank.
- Show avatar upload on `/dashboard/profile`: pick image → progress → preview → Save → persists `imageUrl`.

## 6. Responsive (7:30–8:30)
- DevTools device toolbar 375px → 768px → 1440px on `/`, `/dashboard`, `/admin`. Show mobile drawer sidebar, grids collapse.
- Close with live URLs, demo creds, Stripe test card `4242 4242 4242 4242`.

## Checklist before recording
- `npm run build` green, `npm run lint` clean.
- Backend `FRONTEND_URL` = frontend URL, Stripe webhook configured.
- Cloudinary preset set, demo accounts seeded.
- Drive share Anyone-with-link Viewer.

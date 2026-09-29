# QuickDrop Frontend — Courier & Logistics Platform

Next.js (App Router) frontend for the **B7A7 Courier & Logistics** assignment. Consumes the QuickDrop
backend API (Express + Prisma + Stripe) and serves three role-based workspaces: **Customer**, **Courier**,
and **Admin**.

## Stack

- Next.js 16 (App Router) + TypeScript (strict) + Tailwind CSS v4
- TanStack Query (server state) + Zustand (auth tokens, persisted) + `ofetch` API client
- React Hook Form + Zod validation (mirrors backend schemas)
- Recharts (admin analytics), Sonner (toasts), Lucide icons
- Route guard via `src/proxy.ts` + client-side `AuthGuard` / `RoleGuard`

## Getting started

```bash
npm install
cp .env.example .env.local
# .env.local must define:
#   NEXT_PUBLIC_API_BASE_URL=https://courier-and-logistics.vercel.app/api/v1
#   (local backend: http://localhost:5000/api/v1)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo logins (one-click on `/login`)

| Role     | Email                    | Password       | Lands on     |
| -------- | ------------------------ | -------------- | ------------ |
| Admin    | `admin@quickdrop.com`    | `Admin@1234`   | `/admin`     |
| Customer | `customer@quickdrop.com` | `Customer@1234`| `/dashboard` |
| Courier  | `courier@quickdrop.com`  | `Courier@1234` | `/courier`   |

## Key flows

- **Public tracking:** `/track?tn=QD-XXXXXX` — no login required.
- **Book & pay:** `/dashboard/shipments/new` (3-step wizard) → Stripe Checkout (test mode) →
  `/payment/success?session_id=...` or `/payment/cancel`.
- **Courier:** `/courier` queue → `/courier/deliveries/[id]` status updates + confirm code.
- **Admin:** `/admin` analytics → shipments, deliveries, users (role/block), payments, audit reports.

## Scripts

```bash
npm run dev     # development server
npm run build   # production build (must stay green)
npm start       # serve production build
npm run lint    # biome check
npm run format  # biome format --write
```

## Deploy (Vercel)

1. Push this folder as its own repo (`main` branch).
2. Import on Vercel → Framework preset **Next.js**.
3. Environment variable: `NEXT_PUBLIC_API_BASE_URL=https://courier-and-logistics.vercel.app/api/v1`.
4. Deploy, then add the Vercel frontend URL to the backend `FRONTEND_URL` env (CORS + Stripe
   `success_url`/`cancel_url` derive from it).
5. Verify live: one-click demo logins for all 3 roles + one Stripe test-card payment end to end.

> Never put `STRIPE_SECRET_KEY` or any secret in frontend env files. Stripe is driven
> server-side by the backend; the frontend only follows `stripeSessionUrl` redirects.

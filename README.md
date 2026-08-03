# GearUp — Frontend

A Next.js App Router frontend for **GearUp**, a sports and outdoor equipment rental platform. Customers browse gear, pick rental dates and pay through Stripe Checkout; providers manage their inventory and fulfil orders; admins moderate the platform.

This repository is the frontend only. It consumes a separate Express + Prisma API.

---

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Server Components) |
| Language | TypeScript (`strict`) |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix) |
| Server state | TanStack Query v5 |
| Global state | Zustand |
| Forms | React Hook Form + Zod |
| Auth | JWT in a cookie, route protection via `middleware.ts` |
| Payments | Stripe Checkout (redirect flow) |
| Notifications | Sonner |
| Theming | next-themes, light default with a dark toggle |

---

## Roles

Users pick their role when registering. The navigation, dashboard and available actions all change per role, and `middleware.ts` keeps each role inside its own area.

| Role | What they can do |
|---|---|
| **Customer** | Browse and filter gear, pick rental dates, pay via Stripe, track orders, review returned gear |
| **Provider** | Full CRUD on their own gear listings, and move incoming orders through the rental lifecycle |
| **Admin** | Platform statistics, user suspend/activate, and read-only moderation of all gear and rentals |

---

## Rental order lifecycle

An order moves through six states, each rendered with its own badge colour:

| Status | Badge | Who acts next |
|---|---|---|
| `PLACED` | Amber | Provider confirms |
| `CONFIRMED` | Blue | Customer pays |
| `PAID` | Purple | Provider marks picked up |
| `PICKED_UP` | Green | Customer has the gear |
| `RETURNED` | Gray | Customer can leave a review |
| `CANCELLED` | Red | — |

---

## Routes

**Public** — `/`, `/gear`, `/gear/[id]`, `/auth/login`, `/auth/register`

**Customer** — `/dashboard/customer`, `/orders`, `/orders/[id]`, `/orders/[id]/pay`, `/payments`, `/reviews`, `/profile`

**Provider** — `/dashboard/provider`, `/gear`, `/gear/new`, `/gear/[id]/edit`, `/orders`, `/profile`

**Admin** — `/dashboard/admin`, `/users`, `/gear`, `/rentals`, `/categories`, `/profile`

**Payment** — `/payment/success`, `/payment/cancel`

Every data-backed segment has its own `loading.tsx` skeleton and `error.tsx` boundary, plus a global `not-found.tsx` and `global-error.tsx`.

See [API_INTEGRATION.md](./API_INTEGRATION.md) for the full map of frontend code to backend endpoints.

---

## Running locally

The backend must be running first — the frontend talks to it directly.

```bash
npm install
npm run dev
```

`npm run dev` loads `.env.dev`. Two environment files are used:

```ini
# .env.dev
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```ini
# .env.production
NEXT_PUBLIC_API_URL=https://<your-api-host>/api
NEXT_PUBLIC_APP_URL=https://<your-frontend-host>
```

When deploying, set both variables in the host's dashboard, and make sure the backend's `CLIENT_URL` includes the exact frontend domain or every authenticated request will fail CORS.

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server on `:3000` |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

---

## Payment flow

1. Customer picks dates on a gear page and places a booking (`POST /rentals`).
2. On the pay page the frontend requests a Checkout session (`POST /payments/create`) and redirects to Stripe.
3. Stripe returns the customer to `/payment/success` or `/payment/cancel` with the order id.
4. The success page verifies the session with the backend (`POST /payments/confirm`), invalidates the cached rental and payment queries, and shows the outcome with the booking summary.

Payments are real Stripe Checkout sessions verified server-side. There is no simulated or pay-later path.

---

## Notes

- Date pickers block past dates, days that are already fully booked, and any range that would span a booked day.
- API errors surface consistently: field-level messages on forms, toasts for standalone actions, and route error boundaries for render failures.
- Images are served through `next/image`.

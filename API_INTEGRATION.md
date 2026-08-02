# API Integration Map

Maps every backend endpoint the GearUp frontend consumes to the frontend code that calls it. The backend is a separate Express + Prisma repo; its base URL is read from `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000/api` in development).

**Auth mechanism:** on login/register the backend returns a JWT, which the frontend stores in a readable (non-httpOnly) cookie (`lib/auth-cookie.ts`) and Zustand store (`stores/auth-store.ts`). Every authenticated request — server or client — sends it as `Authorization: Bearer <token>`. Server Components read the cookie directly (`lib/auth-server.ts`) and call the backend with `lib/server-api.ts`; Client Components call through `lib/api-client.ts`. Every response follows the same envelope: `{ success, message, data, meta?, errorDetails? }`.

## Auth

| Endpoint | Frontend code | Used by |
|---|---|---|
| `POST /auth/login` | `hooks/use-auth.ts` → `useLogin` | `components/auth/login-form.tsx` (`/auth/login`) |
| `POST /auth/register` | `hooks/use-auth.ts` → `useRegister` | `components/auth/register-form.tsx` (`/auth/register`) |
| `GET /auth/me` | `lib/auth-server.ts` → `getCurrentUser` | Root layout, dashboard layout, public layout, gear details page, all three profile pages — anywhere the current user must be known server-side |

## Public gear catalogue

| Endpoint | Frontend code | Used by |
|---|---|---|
| `GET /gear` (filters: `search`, `category`, `brand`, `minPrice`, `maxPrice`, `from`, `to`, `sort`, `page`, `limit`) | `app/(public)/page.tsx`, `app/(public)/gear/page.tsx` via `lib/server-api.ts`; `components/gear/gear-search.tsx` via `lib/api-client.ts` | Home page featured gear, `/gear` browse grid + filters, live search suggestions dropdown in the navbar |
| `GET /gear/:id` | `app/(public)/gear/[id]/page.tsx` via `serverFetch` | Gear details page — gallery, specs, provider info, and embedded reviews all come from this one call |
| `GET /gear/:id/availability` | `components/gear/rent-now-panel.tsx` | Rent Now date picker — disables already-booked date ranges |
| `GET /gear/brands` | `app/(public)/gear/page.tsx` via `serverFetch` | Brand filter dropdown on `/gear` |
| `GET /categories` | `hooks/use-categories.ts` → `useCategories` (client); `serverFetch` (server, home + browse pages) | Home page category tiles, `/gear` category filter, provider gear form category picker, admin categories page |

## Customer

| Endpoint | Frontend code | Used by |
|---|---|---|
| `POST /rentals` | `components/gear/rent-now-panel.tsx` | "Rent Now" button on the gear details page |
| `GET /rentals` (filters: `status`, `page`, `limit`) | `hooks/use-rentals.ts` → `useRentals` | `components/customer/rental-list.tsx` — `/dashboard/customer/orders` |
| `GET /rentals/:id` | `hooks/use-rentals.ts` → `useRental` | Order detail page, payment initiation page |
| `PATCH /rentals/:id/cancel` | `hooks/use-rentals.ts` → `useCancelRental` | `components/customer/cancel-order-dialog.tsx` |
| `POST /payments/create` | `hooks/use-payments.ts` → `useCreateCheckout` | `components/customer/payment-initiation.tsx` — `/dashboard/customer/orders/[id]/pay`, redirects to Stripe Checkout |
| `POST /payments/confirm` | `components/payment/payment-confirmation.tsx` | `/payment/success` — confirms the session with the backend before showing the outcome |
| `GET /payments` | `hooks/use-payments.ts` → `usePayments` | `components/customer/payment-history.tsx` — `/dashboard/customer/payments` |
| `POST /reviews` | `hooks/use-reviews.ts` → `useCreateReview` | `components/customer/review-dialog.tsx` — "Leave Review" on paid/returned orders |
| `PATCH /users/me` | `hooks/use-profile.ts` → `useUpdateProfile` | `components/shared/profile-form.tsx` — shared by all three role profile pages |

## Provider

| Endpoint | Frontend code | Used by |
|---|---|---|
| `GET /provider/stats` | `hooks/use-provider.ts` → `useProviderStats` | `components/provider/provider-overview.tsx` — `/dashboard/provider` |
| `GET /provider/gear` (filters: `search`, `availability`, `page`, `limit`) | `hooks/use-provider-gear.ts` → `useProviderGear` | `components/provider/gear-inventory.tsx` — `/dashboard/provider/gear` |
| `POST /provider/gear` | `hooks/use-provider-gear.ts` → `useCreateGear` | `components/provider/gear-creator.tsx` — `/dashboard/provider/gear/new` |
| `PUT /provider/gear/:id` | `hooks/use-provider-gear.ts` → `useUpdateGear` | `components/provider/gear-editor.tsx` — `/dashboard/provider/gear/[id]/edit` |
| `DELETE /provider/gear/:id` | `hooks/use-provider-gear.ts` → `useDeleteGear` | `components/provider/delete-gear-dialog.tsx` |
| `GET /provider/orders` (filters: `status`, `page`, `limit`) | `hooks/use-provider-orders.ts` → `useProviderOrders` | `components/provider/order-list.tsx` — `/dashboard/provider/orders` |
| `PATCH /provider/orders/:id` | `hooks/use-provider-orders.ts` → `useUpdateOrderStatus` | `components/provider/order-table.tsx` — Confirm / Mark Picked Up / Mark Returned |

## Admin

| Endpoint | Frontend code | Used by |
|---|---|---|
| `GET /admin/stats` | `hooks/use-admin.ts` → `useAdminStats` | `components/admin/admin-overview.tsx` — `/dashboard/admin` |
| `GET /admin/users` (filters: `search`, `role`, `status`, `page`, `limit`) | `hooks/use-admin-users.ts` → `useAdminUsers` | `components/admin/user-list.tsx` — `/dashboard/admin/users` |
| `PATCH /admin/users/:id` | `hooks/use-admin-users.ts` → `useUpdateUserStatus` | `components/admin/user-table.tsx`, `components/admin/suspend-user-dialog.tsx` — Suspend / Activate |
| `GET /admin/gear` (filters: `search`, `page`, `limit`) | `hooks/use-admin-gear.ts` → `useAdminGear` | `components/admin/gear-moderation-list.tsx` — `/dashboard/admin/gear` (read-only, cross-provider) |
| `GET /admin/rentals` (filters: `status`, `search`, `page`, `limit`) | `hooks/use-admin-rentals.ts` → `useAdminRentals` | `components/admin/rental-moderation-list.tsx` — `/dashboard/admin/rentals` (read-only, cross-provider) |
| `POST /categories` | `hooks/use-admin-categories.ts` → `useCreateCategory` | `components/admin/category-form-dialog.tsx` — `/dashboard/admin/categories` |
| `PATCH /categories/:id` | `hooks/use-admin-categories.ts` → `useUpdateCategory` | `components/admin/category-form-dialog.tsx` (edit mode) |
| `DELETE /categories/:id` | `hooks/use-admin-categories.ts` → `useDeleteCategory` | `components/admin/delete-category-dialog.tsx` — blocked by the backend (409) while gear is still listed under the category |

## Route protection

`middleware.ts` decodes the JWT cookie (no network call) to redirect unauthenticated users to `/auth/login` and to keep each role inside its own `/dashboard/{role}` area. It does not call the backend — the backend independently re-checks `role` on every protected endpoint above via its own `authenticate`/`authorize` middleware, so a forged or stale client-side cookie can't grant real access.

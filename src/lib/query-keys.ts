import type { QueryParams } from "@/lib/api-client";

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  gear: {
    all: ["gear"] as const,
    list: (params: QueryParams) => ["gear", "list", params] as const,
    detail: (id: string) => ["gear", "detail", id] as const,
    brands: ["gear", "brands"] as const,
    availability: (id: string, from?: string, to?: string) =>
      ["gear", "availability", id, from ?? null, to ?? null] as const,
    reviews: (id: string, params: QueryParams) =>
      ["gear", "reviews", id, params] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
  rentals: {
    all: ["rentals"] as const,
    list: (params: QueryParams) => ["rentals", "list", params] as const,
    detail: (id: string) => ["rentals", "detail", id] as const,
  },
  payments: {
    all: ["payments"] as const,
    list: (params: QueryParams) => ["payments", "list", params] as const,
  },
  provider: {
    stats: ["provider", "stats"] as const,
    gear: (params: QueryParams) => ["provider", "gear", params] as const,
    orders: (params: QueryParams) => ["provider", "orders", params] as const,
  },
  admin: {
    stats: ["admin", "stats"] as const,
    users: (params: QueryParams) => ["admin", "users", params] as const,
    gear: (params: QueryParams) => ["admin", "gear", params] as const,
    rentals: (params: QueryParams) => ["admin", "rentals", params] as const,
  },
};

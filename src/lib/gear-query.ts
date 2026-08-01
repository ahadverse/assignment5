import type { QueryParams } from "@/lib/api-client";

export interface GearSearchParams {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  availableFrom?: string;
  availableTo?: string;
  availability?: string;
  sort?: string;
  page?: string;
}

export const GEAR_PAGE_SIZE = 9;

export const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

export function toGearQuery(params: GearSearchParams): QueryParams {
  const page = Number(params.page) > 0 ? Number(params.page) : 1;

  return {
    search: params.search,
    category: params.category,
    brand: params.brand,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    availability: params.availability,
    availableFrom: params.availableFrom,
    availableTo: params.availableTo,
    sort: params.sort ?? "newest",
    page,
    limit: GEAR_PAGE_SIZE,
  };
}

export function buildGearHref(params: GearSearchParams, page: number) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (key === "page" || !value) return;
    search.set(key, value);
  });

  if (page > 1) search.set("page", String(page));

  const query = search.toString();
  return query ? `/gear?${query}` : "/gear";
}

export function activeFilterCount(params: GearSearchParams) {
  const keys: (keyof GearSearchParams)[] = [
    "search",
    "category",
    "brand",
    "minPrice",
    "maxPrice",
    "availableFrom",
    "availableTo",
    "availability",
  ];
  return keys.filter((key) => Boolean(params[key])).length;
}

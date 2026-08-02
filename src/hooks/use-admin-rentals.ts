"use client";

import { useQuery } from "@tanstack/react-query";
import { api, buildQuery, type QueryParams } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { RentalOrder } from "@/types";

export function useAdminRentals(params: QueryParams = {}) {
  return useQuery({
    queryKey: queryKeys.admin.rentals(params),
    queryFn: async () => {
      const { data, meta } = await api.get<RentalOrder[]>(
        `/admin/rentals${buildQuery(params)}`
      );
      return { items: data, meta };
    },
    placeholderData: (previous) => previous,
  });
}

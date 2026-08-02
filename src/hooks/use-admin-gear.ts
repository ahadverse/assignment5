"use client";

import { useQuery } from "@tanstack/react-query";
import { api, buildQuery, type QueryParams } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { GearSummary } from "@/types";

export function useAdminGear(params: QueryParams = {}) {
  return useQuery({
    queryKey: queryKeys.admin.gear(params),
    queryFn: async () => {
      const { data, meta } = await api.get<GearSummary[]>(
        `/admin/gear${buildQuery(params)}`
      );
      return { items: data, meta };
    },
    placeholderData: (previous) => previous,
  });
}

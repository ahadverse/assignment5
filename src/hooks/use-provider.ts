"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { ProviderStats } from "@/types";

export function useProviderStats() {
  return useQuery({
    queryKey: queryKeys.provider.stats,
    queryFn: async () => {
      const { data } = await api.get<ProviderStats>("/provider/stats");
      return data;
    },
  });
}

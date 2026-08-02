"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, buildQuery, type QueryParams } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import type { GearDetail, GearSummary } from "@/types";

export interface GearPayload {
  categoryId: string;
  name: string;
  description: string;
  brand: string;
  pricePerDay: number;
  condition: "NEW" | "GOOD" | "FAIR";
  stock: number;
  availability: boolean;
  images: string[];
  specifications: Record<string, string>;
}

export function useProviderGear(params: QueryParams = {}) {
  return useQuery({
    queryKey: queryKeys.provider.gear(params),
    queryFn: async () => {
      const { data, meta } = await api.get<GearSummary[]>(
        `/provider/gear${buildQuery(params)}`
      );
      return { items: data, meta };
    },
    placeholderData: (previous) => previous,
  });
}

export function useGearDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.gear.detail(id),
    queryFn: async () => {
      const { data } = await api.get<GearDetail>(`/gear/${id}`);
      return data;
    },
    retry: false,
  });
}

function useGearInvalidation() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.provider.stats });
    queryClient.invalidateQueries({ queryKey: ["provider", "gear"] });
    queryClient.invalidateQueries({ queryKey: queryKeys.gear.all });
  };
}

export function useCreateGear() {
  const invalidate = useGearInvalidation();

  return useMutation({
    mutationFn: async (payload: GearPayload) => {
      const { data } = await api.post<GearSummary>("/provider/gear", payload);
      return data;
    },
    onSuccess: (gear) => {
      invalidate();
      toast.success("Gear listed", {
        description: `${gear.name} is now in the public catalogue.`,
      });
    },
  });
}

export function useUpdateGear(id: string) {
  const invalidate = useGearInvalidation();

  return useMutation({
    mutationFn: async (payload: Partial<GearPayload>) => {
      const { data } = await api.put<GearSummary>(
        `/provider/gear/${id}`,
        payload
      );
      return data;
    },
    onSuccess: (gear) => {
      invalidate();
      toast.success("Changes saved", {
        description: `${gear.name} has been updated.`,
      });
    },
  });
}

export function useDeleteGear() {
  const invalidate = useGearInvalidation();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/provider/gear/${id}`);
      return id;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Gear removed");
    },
    onError: (error) => {
      toast.error("Could not remove this gear", {
        description: getErrorMessage(error),
      });
    },
  });
}

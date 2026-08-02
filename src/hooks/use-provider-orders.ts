"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, buildQuery, type QueryParams } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { rentalStatusLabels } from "@/lib/status";
import type { RentalOrder, RentalStatus } from "@/types";

export function useProviderOrders(params: QueryParams = {}) {
  return useQuery({
    queryKey: queryKeys.provider.orders(params),
    queryFn: async () => {
      const { data, meta } = await api.get<RentalOrder[]>(
        `/provider/orders${buildQuery(params)}`
      );
      return { items: data, meta };
    },
    placeholderData: (previous) => previous,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: RentalStatus;
    }) => {
      const { data } = await api.patch<RentalOrder>(`/provider/orders/${id}`, {
        status,
      });
      return data;
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["provider", "orders"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.provider.stats });
      toast.success("Order updated", {
        description: `${order.gear.name} is now ${rentalStatusLabels[order.status].toLowerCase()}.`,
      });
    },
    onError: (error) => {
      toast.error("Could not update this order", {
        description: getErrorMessage(error),
      });
    },
  });
}

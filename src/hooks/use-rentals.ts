"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, buildQuery, type QueryParams } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { awaitsPayment } from "@/lib/status";
import type { ApiMeta, RentalOrder } from "@/types";

export function useRentals(params: QueryParams = {}) {
  return useQuery({
    queryKey: queryKeys.rentals.list(params),
    queryFn: async () => {
      const { data, meta } = await api.get<RentalOrder[]>(
        `/rentals${buildQuery(params)}`
      );
      return { items: data, meta };
    },
    placeholderData: (previous) => previous,
  });
}

export function useRental(id: string) {
  return useQuery({
    queryKey: queryKeys.rentals.detail(id),
    queryFn: async () => {
      const { data } = await api.get<RentalOrder>(`/rentals/${id}`);
      return data;
    },
    retry: false,
  });
}

export function useCancelRental() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch<RentalOrder>(`/rentals/${id}/cancel`);
      return data;
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rentals.all });
      toast.success("Booking cancelled", {
        description: `${order.gear.name} is no longer reserved for you.`,
      });
    },
    onError: (error) => {
      toast.error("Could not cancel this booking", {
        description: getErrorMessage(error),
      });
    },
  });
}

export function summarise(orders: RentalOrder[]) {
  const active = orders.filter(
    (order) => order.status === "PAID" || order.status === "PICKED_UP"
  );
  const awaitingPayment = orders.filter(awaitsPayment);
  const spent = orders.reduce(
    (total, order) =>
      order.payment?.status === "COMPLETED"
        ? total + Number(order.payment.amount)
        : total,
    0
  );

  return { active, awaitingPayment, spent };
}

export type RentalPage = { items: RentalOrder[]; meta?: ApiMeta };

"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, buildQuery, type QueryParams } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import type { Payment } from "@/types";

interface CheckoutSession {
  paymentId: string;
  checkoutUrl: string | null;
}

export function usePayments(params: QueryParams = {}) {
  return useQuery({
    queryKey: queryKeys.payments.list(params),
    queryFn: async () => {
      const { data, meta } = await api.get<Payment[]>(
        `/payments${buildQuery(params)}`
      );
      return { items: data, meta };
    },
    placeholderData: (previous) => previous,
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: async (rentalOrderId: string) => {
      const { data } = await api.post<CheckoutSession>("/payments/create", {
        rentalOrderId,
      });

      if (!data.checkoutUrl) {
        throw new Error(
          "Stripe did not return a checkout link. Please try again."
        );
      }

      return data.checkoutUrl;
    },
    onSuccess: (checkoutUrl) => {
      window.location.href = checkoutUrl;
    },
    onError: (error) => {
      toast.error("Could not start the payment", {
        description: getErrorMessage(error),
      });
    },
  });
}

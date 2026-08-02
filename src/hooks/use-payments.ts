"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/api-error";

interface CheckoutSession {
  paymentId: string;
  checkoutUrl: string | null;
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

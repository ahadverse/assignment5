"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { ordersHref } from "@/lib/payment-outcome";

export function PaymentConfirmation() {
  const router = useRouter();
  const params = useSearchParams();
  const queryClient = useQueryClient();
  const started = useRef(false);

  const orderId = params.get("orderId");

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function confirm() {
      if (!orderId) {
        router.replace(ordersHref("failed"));
        return;
      }

      try {
        await api.post("/payments/confirm", { rentalOrderId: orderId });
        queryClient.invalidateQueries({ queryKey: queryKeys.rentals.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
        router.replace(ordersHref("success", orderId));
      } catch {
        router.replace(ordersHref("failed", orderId));
      }
    }

    confirm();
  }, [orderId, queryClient, router]);

  return (
    <div className="grid min-h-[60vh] place-items-center px-4">
      <div className="text-center">
        <Loader2 className="mx-auto size-8 animate-spin text-primary" />
        <p className="mt-4 text-lg font-medium">Confirming your payment</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Hold on while we check this with Stripe. Do not close this tab.
        </p>
      </div>
    </div>
  );
}

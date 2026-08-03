"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CircleCheck, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentOutcomeCard } from "@/components/payment/payment-outcome-card";
import { PaymentPending } from "@/components/payment/payment-pending";
import { useRental } from "@/hooks/use-rentals";
import { api } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";

type Phase = "confirming" | "confirmed" | "failed";

export function PaymentConfirmation() {
  const params = useSearchParams();
  const queryClient = useQueryClient();
  const started = useRef(false);

  const orderId = params.get("orderId");
  const [phase, setPhase] = useState<Phase>(orderId ? "confirming" : "failed");
  const [reason, setReason] = useState(
    orderId ? "" : "This link is missing its booking reference."
  );

  const { data: order, isPending: loadingOrder } = useRental(orderId ?? "", {
    enabled: Boolean(orderId) && phase !== "confirming",
  });

  useEffect(() => {
    if (!orderId || started.current) return;
    started.current = true;

    async function confirm() {
      try {
        await api.post("/payments/confirm", { rentalOrderId: orderId });
        queryClient.invalidateQueries({ queryKey: queryKeys.rentals.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
        setPhase("confirmed");
      } catch (error) {
        setReason(getErrorMessage(error));
        setPhase("failed");
      }
    }

    confirm();
  }, [orderId, queryClient]);

  if (phase === "confirming") {
    return <PaymentPending label="Confirming your payment" />;
  }

  if (phase === "failed") {
    return (
      <PaymentOutcomeCard
        tone="danger"
        icon={CircleX}
        title="We could not confirm this payment"
        description={
          reason ||
          "Stripe has not reported this payment as complete. If money left your account it will be returned automatically."
        }
        order={order}
        loadingOrder={Boolean(orderId) && loadingOrder}
        actions={
          <>
            {orderId ? (
              <Button asChild>
                <Link href={`/dashboard/customer/orders/${orderId}/pay`}>
                  Try again
                </Link>
              </Button>
            ) : null}
            <Button asChild variant="outline">
              <Link href="/dashboard/customer/orders">My rentals</Link>
            </Button>
          </>
        }
      />
    );
  }

  return (
    <PaymentOutcomeCard
      tone="success"
      icon={CircleCheck}
      title="Payment successful"
      description="Your booking is paid and the provider has been notified. They will hand the gear over on your start date."
      order={order}
      loadingOrder={loadingOrder}
      actions={
        <>
          <Button asChild>
            <Link href={`/dashboard/customer/orders/${orderId}`}>
              View this booking
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/customer/orders">My rentals</Link>
          </Button>
        </>
      }
    />
  );
}

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentOutcomeCard } from "@/components/payment/payment-outcome-card";
import { useRental } from "@/hooks/use-rentals";

export function PaymentCancellation() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  const { data: order, isPending } = useRental(orderId ?? "", {
    enabled: Boolean(orderId),
  });

  return (
    <PaymentOutcomeCard
      tone="warning"
      icon={CircleAlert}
      title="Payment cancelled"
      description="You left Stripe before the payment went through. Nothing has been charged and your booking is still held, so you can pay whenever you are ready."
      order={order}
      loadingOrder={Boolean(orderId) && isPending}
      actions={
        <>
          {orderId ? (
            <Button asChild>
              <Link href={`/dashboard/customer/orders/${orderId}/pay`}>
                Pay again
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

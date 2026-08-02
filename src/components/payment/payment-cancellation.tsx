"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ordersHref } from "@/lib/payment-outcome";
import { PaymentRedirectFallback } from "@/components/payment/payment-redirect-fallback";

export function PaymentCancellation() {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get("orderId");

  useEffect(() => {
    router.replace(ordersHref("cancelled", orderId));
  }, [orderId, router]);

  return <PaymentRedirectFallback label="Payment cancelled" />;
}

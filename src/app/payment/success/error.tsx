"use client";

import { PaymentError } from "@/components/payment/payment-error";

export default function PaymentSuccessError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PaymentError
      context="Payment confirmation failed"
      error={error}
      reset={reset}
    />
  );
}

"use client";

import { PaymentError } from "@/components/payment/payment-error";

export default function PaymentCancelError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PaymentError
      context="Payment cancellation redirect failed"
      error={error}
      reset={reset}
    />
  );
}

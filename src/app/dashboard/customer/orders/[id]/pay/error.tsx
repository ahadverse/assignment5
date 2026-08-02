"use client";

import { SegmentError } from "@/components/dashboard/segment-error";

export default function CustomerOrderPayError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      title="Could not start the checkout"
      error={error}
      reset={reset}
      backHref="/dashboard/customer/orders"
      backLabel="Back to my rentals"
    />
  );
}

"use client";

import { SegmentError } from "@/components/dashboard/segment-error";

export default function CustomerPaymentsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      title="Could not load your payments"
      error={error}
      reset={reset}
      backHref="/dashboard/customer"
      backLabel="Back to overview"
    />
  );
}

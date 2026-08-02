"use client";

import { SegmentError } from "@/components/dashboard/segment-error";

export default function CustomerOrdersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      title="Could not load your rentals"
      error={error}
      reset={reset}
      backHref="/dashboard/customer"
      backLabel="Back to overview"
    />
  );
}

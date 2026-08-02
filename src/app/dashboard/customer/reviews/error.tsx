"use client";

import { SegmentError } from "@/components/dashboard/segment-error";

export default function CustomerReviewsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      title="Could not load your reviews"
      error={error}
      reset={reset}
      backHref="/dashboard/customer"
      backLabel="Back to overview"
    />
  );
}

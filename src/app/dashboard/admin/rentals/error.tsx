"use client";

import { SegmentError } from "@/components/dashboard/segment-error";

export default function AdminRentalsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      title="Could not load rental orders"
      error={error}
      reset={reset}
      backHref="/dashboard/admin"
      backLabel="Back to overview"
    />
  );
}

"use client";

import { SegmentError } from "@/components/dashboard/segment-error";

export default function ProviderOrdersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      title="Could not load your orders"
      error={error}
      reset={reset}
      backHref="/dashboard/provider"
      backLabel="Back to overview"
    />
  );
}

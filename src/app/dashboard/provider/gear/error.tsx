"use client";

import { SegmentError } from "@/components/dashboard/segment-error";

export default function ProviderGearError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      title="Could not load your inventory"
      error={error}
      reset={reset}
      backHref="/dashboard/provider"
      backLabel="Back to overview"
    />
  );
}

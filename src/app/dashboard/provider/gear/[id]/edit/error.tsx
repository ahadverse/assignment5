"use client";

import { SegmentError } from "@/components/dashboard/segment-error";

export default function ProviderGearEditError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      title="Could not load this listing"
      error={error}
      reset={reset}
      backHref="/dashboard/provider/gear"
      backLabel="Back to inventory"
    />
  );
}

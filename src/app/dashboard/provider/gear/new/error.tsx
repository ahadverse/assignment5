"use client";

import { SegmentError } from "@/components/dashboard/segment-error";

export default function ProviderGearNewError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      title="Could not load the gear form"
      error={error}
      reset={reset}
      backHref="/dashboard/provider/gear"
      backLabel="Back to inventory"
    />
  );
}

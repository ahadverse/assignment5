"use client";

import { SegmentError } from "@/components/dashboard/segment-error";

export default function ProviderError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      title="Could not load your dashboard"
      error={error}
      reset={reset}
      backHref="/gear"
      backLabel="Browse gear"
    />
  );
}

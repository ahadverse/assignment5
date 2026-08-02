"use client";

import { SegmentError } from "@/components/dashboard/segment-error";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      title="Could not load the platform overview"
      error={error}
      reset={reset}
      backHref="/gear"
      backLabel="Browse gear"
    />
  );
}

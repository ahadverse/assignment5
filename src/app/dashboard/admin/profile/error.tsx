"use client";

import { SegmentError } from "@/components/dashboard/segment-error";

export default function AdminProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      title="Could not load your profile"
      error={error}
      reset={reset}
      backHref="/dashboard/admin"
      backLabel="Back to overview"
    />
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SegmentError({
  title,
  error,
  reset,
  backHref,
  backLabel,
}: {
  title: string;
  error: Error & { digest?: string };
  reset: () => void;
  backHref: string;
  backLabel: string;
}) {
  useEffect(() => {
    console.error(title, error);
  }, [title, error]);

  return (
    <div className="mx-auto max-w-md rounded-xl border bg-card p-10 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-6" />
      </span>
      <h1 className="mt-5 text-xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {error.message || "Something went wrong while reaching GearUp."}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button onClick={reset}>
          <RotateCcw className="size-4" />
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href={backHref}>{backLabel}</Link>
        </Button>
      </div>
    </div>
  );
}

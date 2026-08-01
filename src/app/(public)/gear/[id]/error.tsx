"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GearDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Failed to load gear detail", error);
  }, [error]);

  return (
    <div className="container-page py-24">
      <div className="mx-auto max-w-md rounded-xl border bg-card p-10 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
          <TriangleAlert className="size-6" />
        </span>
        <h1 className="mt-5 text-xl font-semibold">Could not load this gear</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message || "Something went wrong while loading this listing."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={reset}>
            <RotateCcw className="size-4" />
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/gear">Back to gear</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root error boundary", error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <TriangleAlert className="size-7" />
        </span>
        <p className="mt-6 text-sm font-semibold tracking-wide text-destructive uppercase">
          Error
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={() => reset()}>
            <RotateCcw className="size-4" />
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

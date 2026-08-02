"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PaymentError({
  context,
  error,
  reset,
}: {
  context: string;
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(context, error);
  }, [context, error]);

  return (
    <div className="grid min-h-[60vh] place-items-center px-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-10 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
          <TriangleAlert className="size-6" />
        </span>
        <h1 className="mt-5 text-xl font-semibold">
          Something went wrong on this page
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your payment may still have gone through. Open My Rentals to check the
          booking status before paying again, so you are not charged twice.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/dashboard/customer/orders">Go to My Rentals</Link>
          </Button>
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="size-4" />
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}

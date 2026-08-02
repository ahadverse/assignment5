"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCancelRental } from "@/hooks/use-rentals";
import { formatDate } from "@/lib/format";
import type { RentalOrder } from "@/types";

export function CancelOrderDialog({
  order,
  size = "sm",
  className,
}: {
  order: RentalOrder;
  size?: "sm" | "default";
  className?: string;
}) {
  const cancelRental = useCancelRental();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className={className}
          disabled={cancelRental.isPending}
        >
          {cancelRental.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Cancelling
            </>
          ) : (
            "Cancel"
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
          <AlertDialogDescription>
            {order.gear.name} from {formatDate(order.rentalStartDate)} to{" "}
            {formatDate(order.rentalEndDate)} will be released back to the
            provider. You cannot undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep booking</AlertDialogCancel>
          <AlertDialogAction onClick={() => cancelRental.mutate(order.id)}>
            Cancel booking
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

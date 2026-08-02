"use client";

import { Loader2, Trash2 } from "lucide-react";
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
import { useDeleteGear } from "@/hooks/use-provider-gear";
import type { GearSummary } from "@/types";

export function DeleteGearDialog({ gear }: { gear: GearSummary }) {
  const deleteGear = useDeleteGear();
  const orders = gear._count?.rentalOrders ?? 0;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={`Remove ${gear.name}`}
          disabled={deleteGear.isPending}
        >
          {deleteGear.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove {gear.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            {orders > 0
              ? `This listing has ${orders} rental order${orders === 1 ? "" : "s"} against it, so it cannot be deleted. Turn off its availability instead to hide it from the catalogue.`
              : "This removes the listing from the catalogue permanently. You cannot undo this."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep listing</AlertDialogCancel>
          {orders === 0 ? (
            <AlertDialogAction onClick={() => deleteGear.mutate(gear.id)}>
              Remove
            </AlertDialogAction>
          ) : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

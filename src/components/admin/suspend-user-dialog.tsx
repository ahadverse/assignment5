"use client";

import { Loader2, UserX } from "lucide-react";
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
import { useUpdateUserStatus } from "@/hooks/use-admin-users";
import type { User } from "@/types";

export function SuspendUserDialog({ user }: { user: User }) {
  const updateStatus = useUpdateUserStatus();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={updateStatus.isPending}
        >
          <UserX className="size-4" />
          Suspend
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Suspend {user.fullName}?</AlertDialogTitle>
          <AlertDialogDescription>
            They will not be able to log in until you activate the account
            again. Their existing gear listings and orders are left as they
            are.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              updateStatus.mutate({ id: user.id, status: "SUSPENDED" })
            }
          >
            {updateStatus.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : null}
            Suspend user
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

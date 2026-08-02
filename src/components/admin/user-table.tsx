"use client";

import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SuspendUserDialog } from "@/components/admin/suspend-user-dialog";
import { useUpdateUserStatus } from "@/hooks/use-admin-users";
import { formatDate } from "@/lib/format";
import type { User } from "@/types";

function RoleBadge({ role }: { role: User["role"] }) {
  return (
    <Badge variant="outline" className="font-medium">
      {role.charAt(0) + role.slice(1).toLowerCase()}
    </Badge>
  );
}

function UserStatusAction({ user }: { user: User }) {
  const updateStatus = useUpdateUserStatus();

  if (user.role === "ADMIN") {
    return <span className="text-sm text-muted-foreground">&mdash;</span>;
  }

  if (user.status === "SUSPENDED") {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled={updateStatus.isPending}
        onClick={() => updateStatus.mutate({ id: user.id, status: "ACTIVE" })}
      >
        {updateStatus.isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : null}
        Activate
      </Button>
    );
  }

  return <SuspendUserDialog user={user} />;
}

export function UserTable({ users }: { users: User[] }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <p className="font-medium">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </TableCell>
                <TableCell>
                  <RoleBadge role={user.role} />
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      user.status === "SUSPENDED"
                        ? "border-red-300 bg-red-100 text-red-800 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-300"
                        : "border-green-300 bg-green-100 text-green-800 dark:border-green-500/40 dark:bg-green-500/15 dark:text-green-300"
                    }
                  >
                    {user.status === "SUSPENDED" ? "Suspended" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <UserStatusAction user={user} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 md:hidden">
        {users.map((user) => (
          <div key={user.id} className="rounded-xl border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="line-clamp-1 font-medium">{user.fullName}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
              <RoleBadge role={user.role} />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <Badge
                variant="outline"
                className={
                  user.status === "SUSPENDED"
                    ? "border-red-300 bg-red-100 text-red-800 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-300"
                    : "border-green-300 bg-green-100 text-green-800 dark:border-green-500/40 dark:bg-green-500/15 dark:text-green-300"
                }
              >
                {user.status === "SUSPENDED" ? "Suspended" : "Active"}
              </Badge>
              <p className="text-xs text-muted-foreground">
                Joined {formatDate(user.createdAt)}
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <UserStatusAction user={user} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

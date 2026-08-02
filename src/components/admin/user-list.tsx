"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LoadError } from "@/components/dashboard/load-error";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { PaginationNav } from "@/components/shared/pagination-nav";
import { UserTable } from "@/components/admin/user-table";
import { useAdminUsers } from "@/hooks/use-admin-users";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";
import type { Role, UserStatus } from "@/types";

const ALL = "all";
const PAGE_SIZE = 10;
const roles: Role[] = ["CUSTOMER", "PROVIDER", "ADMIN"];
const statuses: UserStatus[] = ["ACTIVE", "SUSPENDED"];

function isRole(value: string | null): value is Role {
  return Boolean(value) && roles.includes(value as Role);
}

function isStatus(value: string | null): value is UserStatus {
  return Boolean(value) && statuses.includes(value as UserStatus);
}

export function UserList() {
  const router = useRouter();
  const params = useSearchParams();

  const searchParam = params.get("search") ?? "";
  const roleParam = params.get("role");
  const statusParam = params.get("status");
  const role = isRole(roleParam) ? roleParam : undefined;
  const status = isStatus(statusParam) ? statusParam : undefined;
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [search, setSearch] = useState(searchParam);
  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, isPending, isPlaceholderData, isError, error, refetch } =
    useAdminUsers({
      search: debouncedSearch || undefined,
      role,
      status,
      page,
      limit: PAGE_SIZE,
    });

  function buildHref(next: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
  }) {
    const query = new URLSearchParams(params.toString());

    if ("search" in next) {
      if (next.search) query.set("search", next.search);
      else query.delete("search");
      query.delete("page");
    }

    if ("role" in next) {
      if (!next.role || next.role === ALL) query.delete("role");
      else query.set("role", next.role);
      query.delete("page");
    }

    if ("status" in next) {
      if (!next.status || next.status === ALL) query.delete("status");
      else query.set("status", next.status);
      query.delete("page");
    }

    if (next.page !== undefined) {
      if (next.page <= 1) query.delete("page");
      else query.set("page", String(next.page));
    }

    const qs = query.toString();
    return qs ? `/dashboard/admin/users?${qs}` : "/dashboard/admin/users";
  }

  useEffect(() => {
    if (debouncedSearch !== searchParam) {
      router.replace(buildHref({ search: debouncedSearch }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const controls = (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        value={search}
        placeholder="Search by name or email"
        aria-label="Search users"
        className="w-full sm:w-64"
        onChange={(event) => setSearch(event.target.value)}
      />
      <Select
        value={role ?? ALL}
        onValueChange={(value) => router.replace(buildHref({ role: value }))}
      >
        <SelectTrigger className="w-36" aria-label="Filter by role">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All roles</SelectItem>
          <SelectItem value="CUSTOMER">Customer</SelectItem>
          <SelectItem value="PROVIDER">Provider</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={status ?? ALL}
        onValueChange={(value) =>
          router.replace(buildHref({ status: value }))
        }
      >
        <SelectTrigger className="w-36" aria-label="Filter by status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All statuses</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="SUSPENDED">Suspended</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  if (isPending) {
    return (
      <div className="space-y-6">
        {controls}
        <TableSkeleton rows={6} columns={5} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        {controls}
        <LoadError
          title="We could not load users"
          error={error}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const users = data.items;
  const total = data.meta?.total ?? users.length;
  const totalPages = data.meta?.totalPages ?? 1;
  const filtered = Boolean(debouncedSearch || role || status);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {controls}
        {total > 0 ? (
          <p className="text-sm text-muted-foreground">
            {total} user{total === 1 ? "" : "s"}
          </p>
        ) : null}
      </div>

      {users.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title={filtered ? "Nothing matches" : "No users yet"}
          description={
            filtered
              ? "Try a different search term or clear the filters."
              : "Accounts will show up here as people register."
          }
          action={
            filtered ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  router.replace("/dashboard/admin/users");
                }}
              >
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div
          className={cn(
            "transition-opacity duration-200",
            isPlaceholderData && "opacity-60"
          )}
        >
          <UserTable users={users} />
        </div>
      )}

      <PaginationNav
        page={page}
        totalPages={totalPages}
        buildHref={(target) => buildHref({ page: target })}
      />
    </div>
  );
}

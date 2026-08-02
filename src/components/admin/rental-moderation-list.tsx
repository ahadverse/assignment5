"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ClipboardList } from "lucide-react";
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
import { RentalModerationTable } from "@/components/admin/rental-moderation-table";
import { useAdminRentals } from "@/hooks/use-admin-rentals";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { rentalStatusLabels, rentalStatuses } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { RentalStatus } from "@/types";

const ALL = "all";
const PAGE_SIZE = 10;

function isStatus(value: string | null): value is RentalStatus {
  return Boolean(value) && rentalStatuses.includes(value as RentalStatus);
}

export function RentalModerationList() {
  const router = useRouter();
  const params = useSearchParams();

  const searchParam = params.get("search") ?? "";
  const statusParam = params.get("status");
  const status = isStatus(statusParam) ? statusParam : undefined;
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [search, setSearch] = useState(searchParam);
  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, isPending, isPlaceholderData, isError, error, refetch } =
    useAdminRentals({
      search: debouncedSearch || undefined,
      status,
      page,
      limit: PAGE_SIZE,
    });

  function buildHref(next: {
    search?: string;
    status?: string;
    page?: number;
  }) {
    const query = new URLSearchParams(params.toString());

    if ("search" in next) {
      if (next.search) query.set("search", next.search);
      else query.delete("search");
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
    return qs ? `/dashboard/admin/rentals?${qs}` : "/dashboard/admin/rentals";
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
        placeholder="Search by gear or customer"
        aria-label="Search rentals"
        className="w-full sm:w-64"
        onChange={(event) => setSearch(event.target.value)}
      />
      <Select
        value={status ?? ALL}
        onValueChange={(value) => router.replace(buildHref({ status: value }))}
      >
        <SelectTrigger className="w-45" aria-label="Filter by status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All statuses</SelectItem>
          {rentalStatuses.map((value) => (
            <SelectItem key={value} value={value}>
              {rentalStatusLabels[value]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  if (isPending) {
    return (
      <div className="space-y-6">
        {controls}
        <TableSkeleton rows={6} columns={7} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        {controls}
        <LoadError
          title="We could not load rental orders"
          error={error}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const orders = data.items;
  const total = data.meta?.total ?? orders.length;
  const totalPages = data.meta?.totalPages ?? 1;
  const filtered = Boolean(debouncedSearch || status);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {controls}
        {total > 0 ? (
          <p className="text-sm text-muted-foreground">
            {total} order{total === 1 ? "" : "s"}
          </p>
        ) : null}
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={filtered ? "Nothing matches" : "No rental orders yet"}
          description={
            filtered
              ? "Try a different search term or clear the status filter."
              : "Orders placed across the platform will show up here."
          }
          action={
            filtered ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  router.replace("/dashboard/admin/rentals");
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
          <RentalModerationTable orders={orders} />
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

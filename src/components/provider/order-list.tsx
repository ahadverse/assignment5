"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { OrderTable } from "@/components/provider/order-table";
import { useProviderOrders } from "@/hooks/use-provider-orders";
import { rentalStatusLabels, rentalStatuses } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { RentalStatus } from "@/types";

const ALL = "all";
const PAGE_SIZE = 10;

function isStatus(value: string | null): value is RentalStatus {
  return Boolean(value) && rentalStatuses.includes(value as RentalStatus);
}

export function OrderList() {
  const router = useRouter();
  const params = useSearchParams();

  const statusParam = params.get("status");
  const status = isStatus(statusParam) ? statusParam : undefined;
  const page = Math.max(1, Number(params.get("page")) || 1);

  const { data, isPending, isPlaceholderData, isError, error, refetch } =
    useProviderOrders({ status, page, limit: PAGE_SIZE });

  function buildHref(next: { status?: string; page?: number }) {
    const query = new URLSearchParams(params.toString());

    if ("status" in next) {
      if (!next.status || next.status === ALL) query.delete("status");
      else query.set("status", next.status);
      query.delete("page");
    }

    if (next.page !== undefined) {
      if (next.page <= 1) query.delete("page");
      else query.set("page", String(next.page));
    }

    const search = query.toString();
    return search
      ? `/dashboard/provider/orders?${search}`
      : "/dashboard/provider/orders";
  }

  const filter = (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Status</span>
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
        {filter}
        <TableSkeleton rows={5} columns={6} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        {filter}
        <LoadError
          title="We could not load your orders"
          error={error}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const orders = data.items;
  const total = data.meta?.total ?? orders.length;
  const totalPages = data.meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {filter}
        {total > 0 ? (
          <p className="text-sm text-muted-foreground">
            {total} order{total === 1 ? "" : "s"}
            {totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""}
          </p>
        ) : null}
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={status ? "Nothing with this status" : "No orders yet"}
          description={
            status
              ? `You have no orders marked ${rentalStatusLabels[status].toLowerCase()}.`
              : "Orders from customers will show up here as they come in."
          }
          action={
            status ? (
              <Button asChild variant="outline">
                <Link href={buildHref({ status: ALL })}>Clear filter</Link>
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
          <OrderTable orders={orders} />
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

"use client";

import Link from "next/link";
import {
  Boxes,
  ClipboardList,
  PackageCheck,
  PackagePlus,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LoadError } from "@/components/dashboard/load-error";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/stat-card";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatsOrderList } from "@/components/provider/stats-order-list";
import { useProviderStats } from "@/hooks/use-provider";
import { formatCurrency } from "@/lib/format";
import { rentalStatuses } from "@/lib/status";

export function ProviderOverview() {
  const { data: stats, isPending, isError, error, refetch } = useProviderStats();

  if (isPending) {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))}
        </div>
        <TableSkeleton rows={4} columns={4} />
      </div>
    );
  }

  if (isError) {
    return (
      <LoadError
        title="We could not load your dashboard"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  const busiest = rentalStatuses.filter(
    (status) => stats.ordersByStatus[status] > 0
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Gear listed"
          value={stats.totalGear}
          icon={Boxes}
          hint={`${stats.activeGear} available to rent`}
        />
        <StatCard
          label="Pending orders"
          value={stats.pendingOrders}
          icon={ClipboardList}
          hint="Waiting for you to confirm"
        />
        <StatCard
          label="Active rentals"
          value={stats.activeRentals}
          icon={PackageCheck}
          hint="Paid or out with a customer"
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={Wallet}
          hint="From completed payments"
        />
      </div>

      {stats.pendingOrders > 0 ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-500/40 dark:bg-amber-500/10">
          <h2 className="font-semibold">
            {stats.pendingOrders} order
            {stats.pendingOrders === 1 ? "" : "s"} need
            {stats.pendingOrders === 1 ? "s" : ""} your attention
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Customers are waiting for you to confirm these bookings.
          </p>
          <Button asChild size="sm" className="mt-4">
            <Link href="/dashboard/provider/orders">Review orders</Link>
          </Button>
        </div>
      ) : null}

      {busiest.length > 0 ? (
        <section>
          <h2 className="mb-4 text-lg font-semibold">Orders by status</h2>
          <div className="flex flex-wrap gap-3">
            {busiest.map((status) => (
              <div
                key={status}
                className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3"
              >
                <StatusBadge status={status} />
                <span className="text-lg font-semibold tabular-nums">
                  {stats.ordersByStatus[status]}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          {stats.recentOrders.length > 0 ? (
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/provider/orders">View all</Link>
            </Button>
          ) : null}
        </div>

        {stats.recentOrders.length === 0 ? (
          <EmptyState
            icon={PackagePlus}
            title={
              stats.totalGear === 0 ? "No gear listed yet" : "No orders yet"
            }
            description={
              stats.totalGear === 0
                ? "Add your first piece of gear and it will appear in the public catalogue straight away."
                : "Orders from customers will show up here as they come in."
            }
            action={
              stats.totalGear === 0 ? (
                <Button asChild>
                  <Link href="/dashboard/provider/gear/new">Add gear</Link>
                </Button>
              ) : (
                <Button asChild variant="outline">
                  <Link href="/dashboard/provider/gear">Manage inventory</Link>
                </Button>
              )
            }
          />
        ) : (
          <StatsOrderList orders={stats.recentOrders} />
        )}
      </section>
    </div>
  );
}

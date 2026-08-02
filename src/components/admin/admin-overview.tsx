"use client";

import Link from "next/link";
import { Boxes, ClipboardList, ShieldAlert, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LoadError } from "@/components/dashboard/load-error";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/stat-card";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatsOrderList } from "@/components/provider/stats-order-list";
import { useAdminStats } from "@/hooks/use-admin";
import { formatCurrency } from "@/lib/format";
import { rentalStatuses } from "@/lib/status";

export function AdminOverview() {
  const { data: stats, isPending, isError, error, refetch } = useAdminStats();

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
        title="We could not load the platform overview"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  const busiest = rentalStatuses.filter(
    (status) => stats.rentalsByStatus[status] > 0
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value={stats.totalUsers}
          icon={Users}
          hint={`${stats.suspendedUsers} suspended`}
        />
        <StatCard
          label="Active gear"
          value={stats.activeGear}
          icon={Boxes}
          hint={`${stats.totalGear} listed across ${stats.totalCategories} categories`}
        />
        <StatCard
          label="Total rentals"
          value={stats.totalRentals}
          icon={ClipboardList}
          hint="Across the whole platform"
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={Wallet}
          hint="From completed payments"
        />
      </div>

      {stats.suspendedUsers > 0 ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-500/40 dark:bg-amber-500/10">
          <h2 className="font-semibold">
            {stats.suspendedUsers} suspended user
            {stats.suspendedUsers === 1 ? "" : "s"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review who is currently locked out of the platform.
          </p>
          <Button asChild size="sm" className="mt-4">
            <Link href="/dashboard/admin/users?status=SUSPENDED">
              Review users
            </Link>
          </Button>
        </div>
      ) : null}

      {busiest.length > 0 ? (
        <section>
          <h2 className="mb-4 text-lg font-semibold">Rentals by status</h2>
          <div className="flex flex-wrap gap-3">
            {busiest.map((status) => (
              <div
                key={status}
                className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3"
              >
                <StatusBadge status={status} />
                <span className="text-lg font-semibold tabular-nums">
                  {stats.rentalsByStatus[status]}
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
              <Link href="/dashboard/admin/rentals">View all</Link>
            </Button>
          ) : null}
        </div>

        {stats.recentOrders.length === 0 ? (
          <EmptyState
            icon={ShieldAlert}
            title="No orders yet"
            description="Rental activity across every provider will show up here."
          />
        ) : (
          <StatsOrderList orders={stats.recentOrders} />
        )}
      </section>
    </div>
  );
}

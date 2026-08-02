"use client";

import Link from "next/link";
import { CreditCard, PackageCheck, ShoppingBag, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LoadError } from "@/components/dashboard/load-error";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/stat-card";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { RentalTable } from "@/components/customer/rental-table";
import { summarise, useRentals } from "@/hooks/use-rentals";
import { formatCurrency } from "@/lib/format";

export function RentalOverview() {
  const { data, isPending, isError, error, refetch } = useRentals({
    limit: 100,
  });

  if (isPending) {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))}
        </div>
        <TableSkeleton rows={4} columns={5} />
      </div>
    );
  }

  if (isError) {
    return (
      <LoadError
        title="We could not load your rentals"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  const orders = data.items;
  const { active, awaitingPayment, spent } = summarise(orders);

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No rentals yet"
        description="Once you book a piece of gear it will show up here with its live status."
        action={
          <Button asChild>
            <Link href="/gear">Browse gear</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total rentals"
          value={data.meta?.total ?? orders.length}
          icon={ShoppingBag}
        />
        <StatCard
          label="Active rentals"
          value={active.length}
          icon={PackageCheck}
          hint="Paid or currently with you"
        />
        <StatCard
          label="Awaiting payment"
          value={awaitingPayment.length}
          icon={CreditCard}
          hint="Confirmed by the provider"
        />
        <StatCard
          label="Total spent"
          value={formatCurrency(spent)}
          icon={Wallet}
          hint="Completed payments"
        />
      </div>

      {awaitingPayment.length > 0 ? (
        <div className="rounded-xl border border-blue-300 bg-blue-50 p-5 dark:border-blue-500/40 dark:bg-blue-500/10">
          <h2 className="font-semibold">Needs your attention</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {awaitingPayment.length} booking
            {awaitingPayment.length === 1 ? " has" : "s have"} been confirmed and
            {awaitingPayment.length === 1 ? " is" : " are"} waiting for payment.
          </p>
          <ul className="mt-4 space-y-2">
            {awaitingPayment.slice(0, 3).map((order) => (
              <li
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-background p-3"
              >
                <div className="min-w-0">
                  <p className="line-clamp-1 font-medium">{order.gear.name}</p>
                  <p className="text-sm text-muted-foreground tabular-nums">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>
                <Button asChild size="sm">
                  <Link href={`/dashboard/customer/orders/${order.id}`}>
                    View booking
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Recent rentals</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/customer/orders">View all</Link>
          </Button>
        </div>
        <RentalTable orders={orders.slice(0, 5)} />
      </section>
    </div>
  );
}

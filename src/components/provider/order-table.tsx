"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { useUpdateOrderStatus } from "@/hooks/use-provider-orders";
import { formatCurrency, formatDate, rentalDays } from "@/lib/format";
import { nextProviderAction } from "@/lib/status";
import type { RentalOrder } from "@/types";

function GearThumb({ order }: { order: RentalOrder }) {
  const cover = order.gear.images?.[0];

  return (
    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
      {cover ? (
        <Image
          src={cover}
          alt={order.gear.name}
          fill
          sizes="48px"
          className="object-cover"
        />
      ) : (
        <div className="grid size-full place-items-center text-muted-foreground">
          <ImageOff className="size-4" />
        </div>
      )}
    </div>
  );
}

function DateRange({ order }: { order: RentalOrder }) {
  const days = rentalDays(order.rentalStartDate, order.rentalEndDate);

  return (
    <>
      <p className="whitespace-nowrap">
        {formatDate(order.rentalStartDate)} &ndash;{" "}
        {formatDate(order.rentalEndDate)}
      </p>
      <p className="text-xs text-muted-foreground">
        {days} day{days === 1 ? "" : "s"} &times; {order.quantity}
      </p>
    </>
  );
}

function OrderAction({ order }: { order: RentalOrder }) {
  const updateStatus = useUpdateOrderStatus();
  const action = nextProviderAction(order.status);

  if (!action) {
    return <span className="text-sm text-muted-foreground">&mdash;</span>;
  }

  const pending =
    updateStatus.isPending && updateStatus.variables?.id === order.id;

  return (
    <Button
      size="sm"
      disabled={updateStatus.isPending}
      onClick={() =>
        updateStatus.mutate({ id: order.id, status: action.next })
      }
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Updating
        </>
      ) : (
        action.label
      )}
    </Button>
  );
}

export function OrderTable({ orders }: { orders: RentalOrder[] }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gear</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rental period</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <GearThumb order={order} />
                    <div className="min-w-0">
                      <Link
                        href={`/gear/${order.gear.id}`}
                        className="line-clamp-1 font-medium hover:text-primary hover:underline"
                      >
                        {order.gear.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {order.gear.brand}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {order.customer?.fullName ?? "Customer"}
                </TableCell>
                <TableCell className="text-sm">
                  <DateRange order={order} />
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatCurrency(order.totalAmount)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right">
                  <OrderAction order={order} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 md:hidden">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border bg-card p-4">
            <div className="flex items-start gap-3">
              <GearThumb order={order} />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/gear/${order.gear.id}`}
                  className="line-clamp-1 font-medium hover:text-primary"
                >
                  {order.gear.name}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {order.customer?.fullName ?? "Customer"}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="mt-3 flex items-end justify-between gap-3 text-sm">
              <div>
                <DateRange order={order} />
              </div>
              <p className="font-semibold tabular-nums">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <OrderAction order={order} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

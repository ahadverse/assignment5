"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
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
import { CancelOrderDialog } from "@/components/customer/cancel-order-dialog";
import { formatCurrency, formatDate, rentalDays } from "@/lib/format";
import { hasFailedAttempt, isPayable } from "@/lib/status";
import type { RentalOrder } from "@/types";

function orderHref(order: RentalOrder) {
  return `/dashboard/customer/orders/${order.id}`;
}

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

function RentalActions({ order }: { order: RentalOrder }) {
  if (isPayable(order.status)) {
    return (
      <div className="flex justify-end gap-2">
        {order.status === "PLACED" ? <CancelOrderDialog order={order} /> : null}
        <Button asChild size="sm">
          <Link href={`${orderHref(order)}/pay`}>
            {hasFailedAttempt(order) ? "Pay again" : "Pay now"}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <Button asChild variant="ghost" size="sm">
      <Link href={orderHref(order)}>View</Link>
    </Button>
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

export function RentalTable({ orders }: { orders: RentalOrder[] }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gear</TableHead>
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
                        href={orderHref(order)}
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
                  <RentalActions order={order} />
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
                  href={orderHref(order)}
                  className="line-clamp-1 font-medium hover:text-primary"
                >
                  {order.gear.name}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {order.gear.brand}
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
              <RentalActions order={order} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

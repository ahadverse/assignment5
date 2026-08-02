import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentStatusBadge, StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate, rentalDays } from "@/lib/format";
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

export function RentalModerationTable({ orders }: { orders: RentalOrder[] }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border bg-card lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gear</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Rental period</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <GearThumb order={order} />
                    <Link
                      href={`/gear/${order.gear.id}`}
                      className="line-clamp-1 font-medium hover:text-primary hover:underline"
                    >
                      {order.gear.name}
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {order.customer?.fullName ?? "—"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {order.provider?.fullName ?? "—"}
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
                <TableCell>
                  {order.payment ? (
                    <PaymentStatusBadge status={order.payment.status} />
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 lg:hidden">
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
                  {order.customer?.fullName ?? "—"} &rarr;{" "}
                  {order.provider?.fullName ?? "—"}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="mt-3 flex items-end justify-between gap-3 text-sm">
              <DateRange order={order} />
              <p className="font-semibold tabular-nums">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>

            {order.payment ? (
              <div className="mt-3">
                <PaymentStatusBadge status={order.payment.status} />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}

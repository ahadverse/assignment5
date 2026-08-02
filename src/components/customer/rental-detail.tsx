"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadError } from "@/components/dashboard/load-error";
import {
  PaymentStatusBadge,
  StatusBadge,
} from "@/components/shared/status-badge";
import { CancelOrderDialog } from "@/components/customer/cancel-order-dialog";
import { ReviewDialog } from "@/components/customer/review-dialog";
import { useRental } from "@/hooks/use-rentals";
import { formatCurrency, formatDate, formatDateTime, rentalDays } from "@/lib/format";
import {
  hasFailedAttempt,
  isPayable,
  isReviewable,
  rentalStatusHelp,
} from "@/lib/status";

export function RentalDetail({ orderId }: { orderId: string }) {
  const { data: order, isPending, isError, error, refetch } = useRental(orderId);

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <LoadError
          title="We could not load this booking"
          error={error}
          onRetry={() => refetch()}
        />
        <Button asChild variant="outline">
          <Link href="/dashboard/customer/orders">
            <ArrowLeft className="size-4" />
            Back to my rentals
          </Link>
        </Button>
      </div>
    );
  }

  const cover = order.gear.images?.[0];
  const days = rentalDays(order.rentalStartDate, order.rentalEndDate);
  const unitPrice = order.gear.pricePerDay;

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/dashboard/customer/orders">
          <ArrowLeft className="size-4" />
          Back to my rentals
        </Link>
      </Button>

      <div className="rounded-xl border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 gap-4">
            <Link
              href={`/gear/${order.gear.id}`}
              className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted"
            >
              {cover ? (
                <Image
                  src={cover}
                  alt={order.gear.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <span className="grid size-full place-items-center text-muted-foreground">
                  <ImageOff className="size-5" />
                </span>
              )}
            </Link>
            <div className="min-w-0">
              <Link
                href={`/gear/${order.gear.id}`}
                className="text-xl font-semibold hover:text-primary hover:underline"
              >
                {order.gear.name}
              </Link>
              <p className="text-sm text-muted-foreground">{order.gear.brand}</p>
              {order.provider ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  Provided by {order.provider.fullName}
                </p>
              ) : null}
            </div>
          </div>

          <div className="text-right">
            <StatusBadge status={order.status} />
            <p className="mt-2 max-w-60 text-sm text-muted-foreground">
              {rentalStatusHelp[order.status]}
            </p>
          </div>
        </div>

        <Separator className="my-5" />

        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Rental period</dt>
            <dd className="mt-0.5 font-medium">
              {formatDate(order.rentalStartDate)} &ndash;{" "}
              {formatDate(order.rentalEndDate)}
            </dd>
            <dd className="text-sm text-muted-foreground">
              {days} day{days === 1 ? "" : "s"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Placed on</dt>
            <dd className="mt-0.5 font-medium">
              {formatDateTime(order.createdAt)}
            </dd>
          </div>
        </dl>

        <Separator className="my-5" />

        <dl className="space-y-2 text-sm">
          {unitPrice ? (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                {formatCurrency(unitPrice)} &times; {days} day
                {days === 1 ? "" : "s"} &times; {order.quantity}
              </dt>
              <dd className="tabular-nums">
                {formatCurrency(order.totalAmount)}
              </dd>
            </div>
          ) : (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                Quantity &times; {order.quantity}
              </dt>
              <dd className="tabular-nums">
                {formatCurrency(order.totalAmount)}
              </dd>
            </div>
          )}
          <div className="flex justify-between border-t pt-2 text-base font-semibold">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatCurrency(order.totalAmount)}</dd>
          </div>
        </dl>

        {isPayable(order.status) ? (
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            {order.status === "PLACED" ? (
              <CancelOrderDialog order={order} size="default" />
            ) : null}
            <Button asChild size="lg">
              <Link href={`/dashboard/customer/orders/${order.id}/pay`}>
                {hasFailedAttempt(order) ? "Pay again" : "Pay"}{" "}
                {formatCurrency(order.totalAmount)}
              </Link>
            </Button>
          </div>
        ) : null}

        {isReviewable(order.status) && !order.review ? (
          <div className="mt-6 flex justify-end">
            <ReviewDialog order={order} size="default" />
          </div>
        ) : null}
      </div>

      {order.payment ? (
        <div className="rounded-xl border bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Payment</h2>
            <PaymentStatusBadge status={order.payment.status} />
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Amount</dt>
              <dd className="tabular-nums">
                {formatCurrency(order.payment.amount)}
              </dd>
            </div>
          </dl>
        </div>
      ) : null}
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ImageOff, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadError } from "@/components/dashboard/load-error";
import { StatusBadge } from "@/components/shared/status-badge";
import { useRental } from "@/hooks/use-rentals";
import { useCreateCheckout } from "@/hooks/use-payments";
import { formatCurrency, formatDate, rentalDays } from "@/lib/format";
import { hasFailedAttempt, isPayable, rentalStatusHelp } from "@/lib/status";
import type { RentalOrder } from "@/types";

function BackLink({ href, children }: { href: string; children: string }) {
  return (
    <Button asChild variant="ghost" size="sm" className="-ml-2">
      <Link href={href}>
        <ArrowLeft className="size-4" />
        {children}
      </Link>
    </Button>
  );
}

function NotPayable({ order }: { order: RentalOrder }) {
  const detailHref = `/dashboard/customer/orders/${order.id}`;
  const paid =
    order.status === "PAID" ||
    order.status === "PICKED_UP" ||
    order.status === "RETURNED";

  return (
    <div className="rounded-xl border bg-card p-8 text-center">
      <StatusBadge status={order.status} className="mx-auto" />
      <p className="mt-4 font-medium">
        {paid
          ? "This booking is already paid"
          : "This booking is not ready for payment"}
      </p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        {rentalStatusHelp[order.status]}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild variant="outline">
          <Link href={detailHref}>View booking</Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard/customer/orders">My rentals</Link>
        </Button>
      </div>
    </div>
  );
}

export function PaymentInitiation({ orderId }: { orderId: string }) {
  const { data: order, isPending, isError, error, refetch } = useRental(orderId);
  const checkout = useCreateCheckout();

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-72 w-full rounded-xl" />
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
        <BackLink href="/dashboard/customer/orders">Back to my rentals</BackLink>
      </div>
    );
  }

  const detailHref = `/dashboard/customer/orders/${order.id}`;

  if (!isPayable(order.status)) {
    return (
      <div className="space-y-6">
        <BackLink href={detailHref}>Back to booking</BackLink>
        <NotPayable order={order} />
      </div>
    );
  }

  const cover = order.gear.images?.[0];
  const days = rentalDays(order.rentalStartDate, order.rentalEndDate);
  const redirecting = checkout.isPending || checkout.isSuccess;
  const retrying = hasFailedAttempt(order);

  return (
    <div className="space-y-6">
      <BackLink href={detailHref}>Back to booking</BackLink>

      <div className="rounded-xl border bg-card p-5 sm:p-6">
        <div className="flex gap-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
            {cover ? (
              <Image
                src={cover}
                alt={order.gear.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <span className="grid size-full place-items-center text-muted-foreground">
                <ImageOff className="size-5" />
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold">{order.gear.name}</p>
            <p className="text-sm text-muted-foreground">{order.gear.brand}</p>
            {order.provider ? (
              <p className="text-sm text-muted-foreground">
                Provided by {order.provider.fullName}
              </p>
            ) : null}
          </div>
        </div>

        <Separator className="my-5" />

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Rental period</dt>
            <dd className="text-right">
              {formatDate(order.rentalStartDate)} &ndash;{" "}
              {formatDate(order.rentalEndDate)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Duration</dt>
            <dd>
              {days} day{days === 1 ? "" : "s"} &times; {order.quantity}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-t pt-3 text-lg font-semibold">
            <dt>Amount due</dt>
            <dd className="tabular-nums">
              {formatCurrency(order.totalAmount)}
            </dd>
          </div>
        </dl>

        <Button
          size="lg"
          className="mt-6 w-full"
          disabled={redirecting}
          onClick={() => checkout.mutate(order.id)}
        >
          {redirecting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Redirecting to Stripe
            </>
          ) : retrying ? (
            `Try again — pay ${formatCurrency(order.totalAmount)}`
          ) : (
            `Pay ${formatCurrency(order.totalAmount)} with Stripe`
          )}
        </Button>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3.5" />
          You will be redirected to Stripe to complete this payment securely
        </p>
      </div>
    </div>
  );
}

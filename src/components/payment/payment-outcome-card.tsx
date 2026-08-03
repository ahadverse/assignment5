"use client";

import Image from "next/image";
import { CircleCheck, ImageOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate, rentalDays } from "@/lib/format";
import type { RentalOrder } from "@/types";

export type OutcomeTone = "success" | "warning" | "danger";

const toneStyles: Record<OutcomeTone, string> = {
  success:
    "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  warning:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  danger: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

function OrderSummary({ order }: { order: RentalOrder }) {
  const cover = order.gear.images?.[0];
  const days = rentalDays(order.rentalStartDate, order.rentalEndDate);

  return (
    <div className="mt-6 rounded-lg border bg-muted/40 p-4 text-left">
      <div className="flex gap-3">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
          {cover ? (
            <Image
              src={cover}
              alt={order.gear.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <span className="grid size-full place-items-center text-muted-foreground">
              <ImageOff className="size-4" />
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{order.gear.name}</p>
          <p className="text-sm text-muted-foreground">{order.gear.brand}</p>
        </div>
        <StatusBadge status={order.status} className="shrink-0" />
      </div>

      <Separator className="my-4" />

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
        <div className="flex justify-between gap-4 border-t pt-2 font-semibold">
          <dt>Amount</dt>
          <dd className="tabular-nums">{formatCurrency(order.totalAmount)}</dd>
        </div>
      </dl>
    </div>
  );
}

export function PaymentOutcomeCard({
  tone,
  icon: Icon = CircleCheck,
  title,
  description,
  order,
  loadingOrder = false,
  actions,
}: {
  tone: OutcomeTone;
  icon?: typeof CircleCheck;
  title: string;
  description: string;
  order?: RentalOrder;
  loadingOrder?: boolean;
  actions: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[70vh] place-items-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
        <span
          className={cn(
            "mx-auto grid size-14 place-items-center rounded-full",
            toneStyles[tone]
          )}
        >
          <Icon className="size-7" />
        </span>

        <h1 className="mt-5 text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>

        {loadingOrder ? (
          <Skeleton className="mt-6 h-40 w-full rounded-lg" />
        ) : order ? (
          <OrderSummary order={order} />
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {actions}
        </div>
      </div>
    </div>
  );
}

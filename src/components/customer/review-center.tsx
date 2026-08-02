"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageOff, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LoadError } from "@/components/dashboard/load-error";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { RatingStars } from "@/components/shared/rating-stars";
import { ReviewDialog } from "@/components/customer/review-dialog";
import { useRentals } from "@/hooks/use-rentals";
import { formatDate } from "@/lib/format";
import { isReviewable } from "@/lib/status";
import type { RentalOrder } from "@/types";

function GearRow({
  order,
  action,
}: {
  order: RentalOrder;
  action: React.ReactNode;
}) {
  const cover = order.gear.images?.[0];

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4">
      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
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

      <div className="min-w-40 flex-1">
        <Link
          href={`/gear/${order.gear.id}`}
          className="font-medium hover:text-primary hover:underline"
        >
          {order.gear.name}
        </Link>
        <p className="text-sm text-muted-foreground">
          {order.status === "RETURNED" ? "Returned" : "Rental ends"}{" "}
          {formatDate(order.rentalEndDate)}
        </p>
      </div>

      {action}
    </div>
  );
}

export function ReviewCenter() {
  const { data, isPending, isError, error, refetch } = useRentals({
    limit: 100,
  });

  if (isPending) return <TableSkeleton rows={3} columns={3} />;

  if (isError) {
    return (
      <LoadError
        title="We could not load your rentals"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  const reviewable = data.items.filter((order) => isReviewable(order.status));
  const pending = reviewable.filter((order) => !order.review);
  const reviewed = reviewable.filter((order) => order.review);

  if (reviewable.length === 0) {
    return (
      <EmptyState
        icon={Star}
        title="No rentals to review yet"
        description="Once you have paid for a booking you can review the gear here."
        action={
          <Button asChild>
            <Link href="/dashboard/customer/orders">View my rentals</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-4 text-lg font-semibold">
          Waiting for your review
          {pending.length > 0 ? (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {pending.length}
            </span>
          ) : null}
        </h2>

        {pending.length === 0 ? (
          <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            You have reviewed every rental you can. Nice.
          </p>
        ) : (
          <div className="space-y-3">
            {pending.map((order) => (
              <GearRow
                key={order.id}
                order={order}
                action={<ReviewDialog order={order} />}
              />
            ))}
          </div>
        )}
      </section>

      {reviewed.length > 0 ? (
        <section>
          <h2 className="mb-4 text-lg font-semibold">Your reviews</h2>
          <div className="space-y-3">
            {reviewed.map((order) => (
              <GearRow
                key={order.id}
                order={order}
                action={
                  <div className="flex items-center gap-3">
                    {typeof order.review?.rating === "number" ? (
                      <RatingStars rating={order.review.rating} />
                    ) : null}
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/gear/${order.gear.id}#reviews`}>View</Link>
                    </Button>
                  </div>
                }
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

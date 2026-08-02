import Image from "next/image";
import { ImageOff } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { StatsRecentOrder } from "@/types";

export function StatsOrderList({ orders }: { orders: StatsRecentOrder[] }) {
  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const cover = order.gear.images?.[0];

        return (
          <div
            key={order.id}
            className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4"
          >
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
                <span className="grid size-full place-items-center text-muted-foreground">
                  <ImageOff className="size-4" />
                </span>
              )}
            </div>

            <div className="min-w-40 flex-1">
              <p className="font-medium">{order.gear.name}</p>
              <p className="text-sm text-muted-foreground">
                {order.customer?.fullName ?? "Customer"} &middot;{" "}
                {formatDate(order.rentalStartDate)} &ndash;{" "}
                {formatDate(order.rentalEndDate)}
              </p>
            </div>

            <p className="font-semibold tabular-nums">
              {formatCurrency(order.totalAmount)}
            </p>
            <StatusBadge status={order.status} />
          </div>
        );
      })}
    </div>
  );
}

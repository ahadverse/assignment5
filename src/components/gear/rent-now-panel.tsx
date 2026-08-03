"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  startOfDay,
} from "date-fns";
import type { DateRange } from "react-day-picker";
import { CalendarDays, Loader2, Minus, Plus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/api-error";
import { formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/stores/auth-store";
import type { GearAvailability, GearDetail, RentalOrder, User } from "@/types";

function blockedDays(availability: GearAvailability | undefined) {
  if (!availability) return [];

  const perDay = new Map<string, number>();

  availability.bookedRanges.forEach((range) => {
    eachDayOfInterval({
      start: startOfDay(new Date(range.from)),
      end: startOfDay(new Date(range.to)),
    }).forEach((day) => {
      const key = day.toDateString();
      perDay.set(key, (perDay.get(key) ?? 0) + range.quantity);
    });
  });

  const full: Date[] = [];
  perDay.forEach((reserved, key) => {
    if (reserved >= availability.capacity) full.push(new Date(key));
  });

  return full;
}

function coversBlockedDay(range: DateRange | undefined, blocked: Date[]) {
  if (!range?.from || !range?.to || blocked.length === 0) return false;

  const taken = new Set(blocked.map((day) => day.toDateString()));

  return eachDayOfInterval({
    start: startOfDay(range.from),
    end: startOfDay(range.to),
  }).some((day) => taken.has(day.toDateString()));
}

export function RentNowPanel({
  gear,
  user: serverUser,
}: {
  gear: GearDetail;
  user: User | null;
}) {
  const router = useRouter();
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser ?? serverUser;

  const [range, setRange] = useState<DateRange | undefined>();
  const [quantity, setQuantity] = useState(1);

  const { data: availability } = useQuery({
    queryKey: queryKeys.gear.availability(gear.id),
    queryFn: async () => {
      const { data } = await api.get<GearAvailability>(
        `/gear/${gear.id}/availability`
      );
      return data;
    },
    staleTime: 60 * 1000,
  });

  const disabledDays = blockedDays(availability);
  const maxQuantity = Math.max(1, gear.stock);

  const days =
    range?.from && range?.to
      ? Math.max(1, differenceInCalendarDays(range.to, range.from))
      : 0;
  const total = days * Number(gear.pricePerDay) * quantity;

  const createOrder = useMutation({
    mutationFn: async () => {
      const { data } = await api.post<RentalOrder>("/rentals", {
        gearId: gear.id,
        rentalStartDate: range!.from!.toISOString(),
        rentalEndDate: range!.to!.toISOString(),
        quantity,
      });
      return data;
    },
    onSuccess: (order) => {
      toast.success("Booking placed", {
        description: "Complete the payment to lock in your dates.",
      });
      router.push(`/dashboard/customer/orders/${order.id}/pay`);
    },
    onError: (error) => {
      toast.error("Could not place the booking", {
        description: getErrorMessage(error),
      });
    },
  });

  const inStock = gear.availability && gear.stock > 0;
  const overlapsBooked = coversBlockedDay(range, disabledDays);
  const canSubmit =
    Boolean(range?.from && range?.to) && inStock && !overlapsBooked;

  return (
    <div id="rent" className="rounded-xl border bg-card p-5">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold">
          {formatCurrency(gear.pricePerDay)}
        </span>
        <span className="text-muted-foreground">per day</span>
      </div>

      <div className="mt-5 space-y-4">
        <div className="space-y-2">
          <Label>Rental dates</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start font-normal"
                disabled={!inStock}
              >
                <CalendarDays className="size-4" />
                {range?.from ? (
                  range.to ? (
                    <>
                      {format(range.from, "dd MMM")} &ndash;{" "}
                      {format(range.to, "dd MMM yyyy")}
                    </>
                  ) : (
                    <>{format(range.from, "dd MMM yyyy")} &ndash; pick end date</>
                  )
                ) : (
                  <span className="text-muted-foreground">
                    Select your rental window
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                numberOfMonths={1}
                selected={range}
                onSelect={setRange}
                defaultMonth={range?.from ?? addDays(new Date(), 1)}
                excludeDisabled
                disabled={[
                  { before: startOfDay(addDays(new Date(), 0)) },
                  ...disabledDays,
                ]}
              />
              <div className="border-t p-3 text-xs text-muted-foreground">
                Past dates and days already fully booked are disabled. A rental
                window cannot span a booked day.
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Quantity</Label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            >
              <Minus className="size-4" />
            </Button>
            <span className="w-10 text-center font-medium tabular-nums">
              {quantity}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Increase quantity"
              disabled={quantity >= maxQuantity}
              onClick={() =>
                setQuantity((value) => Math.min(maxQuantity, value + 1))
              }
            >
              <Plus className="size-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {gear.stock} in stock
            </span>
          </div>
        </div>

        {overlapsBooked ? (
          <p
            role="alert"
            className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300"
          >
            Those dates include a day that is already fully booked. Pick a
            window that does not cross a disabled date.
          </p>
        ) : null}
      </div>

      {days > 0 ? (
        <>
          <Separator className="my-5" />
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                {formatCurrency(gear.pricePerDay)} &times; {days} day
                {days === 1 ? "" : "s"} &times; {quantity}
              </dt>
              <dd className="tabular-nums">{formatCurrency(total)}</dd>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatCurrency(total)}</dd>
            </div>
          </dl>
        </>
      ) : null}

      <div className="mt-5">
        {!user ? (
          <Button asChild size="lg" className="w-full">
            <Link href={`/auth/login?redirect=/gear/${gear.id}`}>
              Sign in to rent
            </Link>
          </Button>
        ) : user.role !== "CUSTOMER" ? (
          <p className="rounded-lg border border-dashed p-3 text-center text-sm text-muted-foreground">
            You are signed in as a {user.role.toLowerCase()}. Rentals can only be
            placed from a customer account.
          </p>
        ) : (
          <Button
            size="lg"
            className="w-full"
            disabled={!canSubmit || createOrder.isPending}
            onClick={() => createOrder.mutate()}
          >
            {createOrder.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Placing booking...
              </>
            ) : !inStock ? (
              "Currently unavailable"
            ) : overlapsBooked ? (
              "Choose different dates"
            ) : !canSubmit ? (
              "Select your dates"
            ) : (
              `Rent for ${formatCurrency(total)}`
            )}
          </Button>
        )}
      </div>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5" />
        Secure checkout through Stripe
      </p>
    </div>
  );
}

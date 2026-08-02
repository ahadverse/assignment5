"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CircleAlert, CircleCheck, CircleX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isPaymentOutcome, type PaymentOutcome } from "@/lib/payment-outcome";

const outcomes: Record<
  PaymentOutcome,
  {
    icon: typeof CircleCheck;
    title: string;
    body: string;
    tone: string;
    retry: boolean;
  }
> = {
  success: {
    icon: CircleCheck,
    title: "Payment successful",
    body: "Your booking is paid and the provider has been notified.",
    tone: "border-green-300 bg-green-50 dark:border-green-500/40 dark:bg-green-500/10",
    retry: false,
  },
  cancelled: {
    icon: CircleAlert,
    title: "Payment cancelled",
    body: "You left the checkout before paying. Your booking is still held, so you can pay whenever you are ready.",
    tone: "border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10",
    retry: true,
  },
  failed: {
    icon: CircleX,
    title: "Payment could not be confirmed",
    body: "We could not verify this payment with Stripe. If money left your account it will be returned automatically.",
    tone: "border-red-300 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10",
    retry: true,
  },
};

export function PaymentOutcomeBanner() {
  const router = useRouter();
  const params = useSearchParams();

  const outcomeParam = params.get("payment");
  if (!isPaymentOutcome(outcomeParam)) return null;

  const orderId = params.get("orderId");
  const outcome = outcomes[outcomeParam];
  const Icon = outcome.icon;

  function dismiss() {
    const next = new URLSearchParams(params.toString());
    next.delete("payment");
    next.delete("orderId");
    const search = next.toString();
    router.replace(
      search
        ? `/dashboard/customer/orders?${search}`
        : "/dashboard/customer/orders"
    );
  }

  return (
    <div className={cn("mb-6 flex gap-3 rounded-xl border p-4", outcome.tone)}>
      <Icon className="mt-0.5 size-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{outcome.title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{outcome.body}</p>
        {outcome.retry && orderId ? (
          <Button asChild size="sm" className="mt-3">
            <Link href={`/dashboard/customer/orders/${orderId}/pay`}>
              Pay again
            </Link>
          </Button>
        ) : null}
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Dismiss"
        className="-mt-1 -mr-1 shrink-0"
        onClick={dismiss}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}

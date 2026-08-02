"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LoadError } from "@/components/dashboard/load-error";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { PaginationNav } from "@/components/shared/pagination-nav";
import { PaymentStatusBadge } from "@/components/shared/status-badge";
import { usePayments } from "@/hooks/use-payments";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Payment, PaymentStatus } from "@/types";

const ALL = "all";
const PAGE_SIZE = 10;

const statuses: PaymentStatus[] = ["PENDING", "COMPLETED", "FAILED"];

const statusLabels: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  FAILED: "Failed",
};

const methodLabels: Record<string, string> = {
  CARD: "Card",
  CASHAPP: "Cash App",
};

function isStatus(value: string | null): value is PaymentStatus {
  return Boolean(value) && statuses.includes(value as PaymentStatus);
}

function Reference({ payment }: { payment: Payment }) {
  if (!payment.transactionId) {
    return <span className="text-muted-foreground">&mdash;</span>;
  }
  return (
    <span className="font-mono text-xs text-muted-foreground">
      {payment.transactionId.slice(-12)}
    </span>
  );
}

function GearCell({ payment }: { payment: Payment }) {
  const gear = payment.rentalOrder?.gear;
  if (!gear) {
    return <span className="text-muted-foreground">Rental removed</span>;
  }
  return (
    <Link
      href={`/dashboard/customer/orders/${payment.rentalOrderId}`}
      className="font-medium hover:text-primary hover:underline"
    >
      {gear.name}
    </Link>
  );
}

export function PaymentHistory() {
  const router = useRouter();
  const params = useSearchParams();

  const statusParam = params.get("status");
  const status = isStatus(statusParam) ? statusParam : undefined;
  const page = Math.max(1, Number(params.get("page")) || 1);

  const { data, isPending, isPlaceholderData, isError, error, refetch } =
    usePayments({ status, page, limit: PAGE_SIZE });

  function buildHref(next: { status?: string; page?: number }) {
    const query = new URLSearchParams(params.toString());

    if ("status" in next) {
      if (!next.status || next.status === ALL) query.delete("status");
      else query.set("status", next.status);
      query.delete("page");
    }

    if (next.page !== undefined) {
      if (next.page <= 1) query.delete("page");
      else query.set("page", String(next.page));
    }

    const search = query.toString();
    return search
      ? `/dashboard/customer/payments?${search}`
      : "/dashboard/customer/payments";
  }

  const filter = (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Status</span>
      <Select
        value={status ?? ALL}
        onValueChange={(value) => router.replace(buildHref({ status: value }))}
      >
        <SelectTrigger className="w-45" aria-label="Filter by payment status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All statuses</SelectItem>
          {statuses.map((value) => (
            <SelectItem key={value} value={value}>
              {statusLabels[value]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  if (isPending) {
    return (
      <div className="space-y-6">
        {filter}
        <TableSkeleton rows={5} columns={5} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        {filter}
        <LoadError
          title="We could not load your payments"
          error={error}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const payments = data.items;
  const total = data.meta?.total ?? payments.length;
  const totalPages = data.meta?.totalPages ?? 1;
  const settled = payments
    .filter((payment) => payment.status === "COMPLETED")
    .reduce((sum, payment) => sum + Number(payment.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {filter}
        {total > 0 ? (
          <p className="text-sm text-muted-foreground">
            {total} payment{total === 1 ? "" : "s"}
            {settled > 0 ? ` · ${formatCurrency(settled)} on this page` : ""}
          </p>
        ) : null}
      </div>

      {payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title={status ? "No payments with this status" : "No payments yet"}
          description={
            status
              ? `You have no ${statusLabels[status].toLowerCase()} payments.`
              : "Payments appear here as soon as you check out a booking."
          }
          action={
            <Button asChild variant={status ? "outline" : "default"}>
              <Link
                href={status ? buildHref({ status: ALL }) : "/dashboard/customer/orders"}
              >
                {status ? "Clear filter" : "View my rentals"}
              </Link>
            </Button>
          }
        />
      ) : (
        <div
          className={cn(
            "transition-opacity duration-200",
            isPlaceholderData && "opacity-60"
          )}
        >
          <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gear</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <GearCell payment={payment} />
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {formatDateTime(payment.paidAt ?? payment.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {payment.method ? methodLabels[payment.method] : "—"}
                    </TableCell>
                    <TableCell>
                      <Reference payment={payment} />
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={payment.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3 md:hidden">
            {payments.map((payment) => (
              <div key={payment.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <GearCell payment={payment} />
                  <PaymentStatusBadge status={payment.status} />
                </div>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div className="text-sm text-muted-foreground">
                    <p>{formatDateTime(payment.paidAt ?? payment.createdAt)}</p>
                    <p>{payment.method ? methodLabels[payment.method] : "—"}</p>
                  </div>
                  <p className="font-semibold tabular-nums">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <PaginationNav
        page={page}
        totalPages={totalPages}
        buildHref={(target) => buildHref({ page: target })}
      />
    </div>
  );
}

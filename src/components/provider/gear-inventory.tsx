"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Boxes, ImageOff, PackagePlus, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { DeleteGearDialog } from "@/components/provider/delete-gear-dialog";
import { useProviderGear } from "@/hooks/use-provider-gear";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { GearSummary } from "@/types";

const ALL = "all";
const PAGE_SIZE = 10;

function Cover({ gear }: { gear: GearSummary }) {
  const cover = gear.images?.[0];

  return (
    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
      {cover ? (
        <Image
          src={cover}
          alt={gear.name}
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
  );
}

function StockCell({ gear }: { gear: GearSummary }) {
  if (!gear.availability) {
    return <Badge variant="outline">Hidden</Badge>;
  }
  if (gear.stock < 1) {
    return (
      <Badge
        variant="outline"
        className="border-red-300 bg-red-100 text-red-800 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-300"
      >
        Out of stock
      </Badge>
    );
  }
  return <span className="tabular-nums">{gear.stock}</span>;
}

function RowActions({ gear }: { gear: GearSummary }) {
  return (
    <div className="flex justify-end gap-2">
      <Button asChild variant="outline" size="icon" aria-label={`Edit ${gear.name}`}>
        <Link href={`/dashboard/provider/gear/${gear.id}/edit`}>
          <Pencil className="size-4" />
        </Link>
      </Button>
      <DeleteGearDialog gear={gear} />
    </div>
  );
}

export function GearInventory() {
  const router = useRouter();
  const params = useSearchParams();

  const searchParam = params.get("search") ?? "";
  const availabilityParam = params.get("availability");
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [search, setSearch] = useState(searchParam);
  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, isPending, isPlaceholderData, isError, error, refetch } =
    useProviderGear({
      search: debouncedSearch || undefined,
      availability:
        availabilityParam === "true" || availabilityParam === "false"
          ? availabilityParam
          : undefined,
      page,
      limit: PAGE_SIZE,
    });

  function buildHref(next: {
    search?: string;
    availability?: string;
    page?: number;
  }) {
    const query = new URLSearchParams(params.toString());

    if ("search" in next) {
      if (next.search) query.set("search", next.search);
      else query.delete("search");
      query.delete("page");
    }

    if ("availability" in next) {
      if (!next.availability || next.availability === ALL) {
        query.delete("availability");
      } else {
        query.set("availability", next.availability);
      }
      query.delete("page");
    }

    if (next.page !== undefined) {
      if (next.page <= 1) query.delete("page");
      else query.set("page", String(next.page));
    }

    const qs = query.toString();
    return qs
      ? `/dashboard/provider/gear?${qs}`
      : "/dashboard/provider/gear";
  }

  useEffect(() => {
    if (debouncedSearch !== searchParam) {
      router.replace(buildHref({ search: debouncedSearch }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const controls = (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        value={search}
        placeholder="Search by name or brand"
        aria-label="Search your gear"
        className="w-full sm:w-64"
        onChange={(event) => setSearch(event.target.value)}
      />
      <Select
        value={availabilityParam ?? ALL}
        onValueChange={(value) =>
          router.replace(buildHref({ availability: value }))
        }
      >
        <SelectTrigger className="w-40" aria-label="Filter by availability">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All listings</SelectItem>
          <SelectItem value="true">Available</SelectItem>
          <SelectItem value="false">Hidden</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  if (isPending) {
    return (
      <div className="space-y-6">
        {controls}
        <TableSkeleton rows={5} columns={5} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        {controls}
        <LoadError
          title="We could not load your inventory"
          error={error}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const gear = data.items;
  const total = data.meta?.total ?? gear.length;
  const totalPages = data.meta?.totalPages ?? 1;
  const filtered = Boolean(debouncedSearch || availabilityParam);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {controls}
        {total > 0 ? (
          <p className="text-sm text-muted-foreground">
            {total} listing{total === 1 ? "" : "s"}
          </p>
        ) : null}
      </div>

      {gear.length === 0 ? (
        <EmptyState
          icon={filtered ? Boxes : PackagePlus}
          title={filtered ? "Nothing matches" : "No gear listed yet"}
          description={
            filtered
              ? "Try a different search term or clear the availability filter."
              : "Add your first piece of gear and it appears in the public catalogue straight away."
          }
          action={
            filtered ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  router.replace("/dashboard/provider/gear");
                }}
              >
                Clear filters
              </Button>
            ) : (
              <Button asChild>
                <Link href="/dashboard/provider/gear/new">Add gear</Link>
              </Button>
            )
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
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Per day</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gear.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Cover gear={item} />
                        <div className="min-w-0">
                          <Link
                            href={`/gear/${item.id}`}
                            className="line-clamp-1 font-medium hover:text-primary hover:underline"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {item.brand}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.category?.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(item.pricePerDay)}
                    </TableCell>
                    <TableCell>
                      <StockCell gear={item} />
                    </TableCell>
                    <TableCell>
                      <RowActions gear={item} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3 md:hidden">
            {gear.map((item) => (
              <div key={item.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-start gap-3">
                  <Cover gear={item} />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/gear/${item.id}`}
                      className="line-clamp-1 font-medium hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {item.brand} &middot; {item.category?.name ?? "—"}
                    </p>
                  </div>
                  <StockCell gear={item} />
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="font-semibold tabular-nums">
                    {formatCurrency(item.pricePerDay)}
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}
                      / day
                    </span>
                  </p>
                  <RowActions gear={item} />
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

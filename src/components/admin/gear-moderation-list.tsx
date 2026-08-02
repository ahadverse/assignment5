"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LoadError } from "@/components/dashboard/load-error";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { PaginationNav } from "@/components/shared/pagination-nav";
import { GearModerationTable } from "@/components/admin/gear-moderation-table";
import { useAdminGear } from "@/hooks/use-admin-gear";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

export function GearModerationList() {
  const router = useRouter();
  const params = useSearchParams();

  const searchParam = params.get("search") ?? "";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [search, setSearch] = useState(searchParam);
  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, isPending, isPlaceholderData, isError, error, refetch } =
    useAdminGear({
      search: debouncedSearch || undefined,
      page,
      limit: PAGE_SIZE,
    });

  function buildHref(next: { search?: string; page?: number }) {
    const query = new URLSearchParams(params.toString());

    if ("search" in next) {
      if (next.search) query.set("search", next.search);
      else query.delete("search");
      query.delete("page");
    }

    if (next.page !== undefined) {
      if (next.page <= 1) query.delete("page");
      else query.set("page", String(next.page));
    }

    const qs = query.toString();
    return qs ? `/dashboard/admin/gear?${qs}` : "/dashboard/admin/gear";
  }

  useEffect(() => {
    if (debouncedSearch !== searchParam) {
      router.replace(buildHref({ search: debouncedSearch }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const controls = (
    <Input
      value={search}
      placeholder="Search by name or brand"
      aria-label="Search gear"
      className="w-full sm:w-64"
      onChange={(event) => setSearch(event.target.value)}
    />
  );

  if (isPending) {
    return (
      <div className="space-y-6">
        {controls}
        <TableSkeleton rows={6} columns={5} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        {controls}
        <LoadError
          title="We could not load gear"
          error={error}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const gear = data.items;
  const total = data.meta?.total ?? gear.length;
  const totalPages = data.meta?.totalPages ?? 1;

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
          icon={Boxes}
          title={debouncedSearch ? "Nothing matches" : "No gear listed yet"}
          description={
            debouncedSearch
              ? "Try a different search term."
              : "Listings from every provider will show up here."
          }
          action={
            debouncedSearch ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  router.replace("/dashboard/admin/gear");
                }}
              >
                Clear search
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div
          className={cn(
            "transition-opacity duration-200",
            isPlaceholderData && "opacity-60"
          )}
        >
          <GearModerationTable gear={gear} />
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

import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GearCard } from "@/components/gear/gear-card";
import { PaginationNav } from "@/components/shared/pagination-nav";
import { serverFetch } from "@/lib/server-api";
import { buildQuery } from "@/lib/api-client";
import {
  buildGearHref,
  toGearQuery,
  type GearSearchParams,
} from "@/lib/gear-query";
import type { GearSummary } from "@/types";

export const metadata: Metadata = {
  title: "Browse Gear",
  description:
    "Search and filter sports and outdoor equipment available to rent on GearUp.",
};

export default async function GearPage({
  searchParams,
}: {
  searchParams: Promise<GearSearchParams>;
}) {
  const params = await searchParams;
  const query = toGearQuery(params);

  const { data: gear, meta } = await serverFetch<GearSummary[]>(
    `/gear${buildQuery(query)}`
  );

  const page = meta?.page ?? 1;
  const total = meta?.total ?? gear.length;
  const totalPages = meta?.totalPages ?? 1;
  const outOfRange = gear.length === 0 && total > 0;

  return (
    <>
      <section className="border-b bg-card">
        <div className="container-page py-10">
          <h1 className="text-3xl font-bold sm:text-4xl">Browse gear</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Sports and outdoor equipment from local providers, ready to rent by
            the day.
          </p>
        </div>
      </section>

      <section className="container-page py-8">
        {gear.length > 0 ? (
          <p className="mb-6 text-sm text-muted-foreground">
            Showing {gear.length} of {total} item{total === 1 ? "" : "s"}
            {totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""}
          </p>
        ) : null}

        {gear.length === 0 ? (
          <div className="rounded-xl border border-dashed py-20 text-center">
            <PackageSearch className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">
              {outOfRange ? "This page is empty" : "No gear matches this yet"}
            </p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              {outOfRange
                ? `There ${total === 1 ? "is" : "are"} only ${total} item${total === 1 ? "" : "s"} for this search, spread over ${totalPages} page${totalPages === 1 ? "" : "s"}.`
                : "Try a different category or clear your search to see everything that is available."}
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link href={outOfRange ? buildGearHref(params, 1) : "/gear"}>
                {outOfRange ? "Back to first page" : "Clear search"}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gear.map((item) => (
              <GearCard key={item.id} gear={item} />
            ))}
          </div>
        )}

        <PaginationNav
          page={page}
          totalPages={totalPages}
          buildHref={(target) => buildGearHref(params, target)}
        />
      </section>
    </>
  );
}

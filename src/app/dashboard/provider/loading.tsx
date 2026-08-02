import { StatCardSkeleton } from "@/components/dashboard/stat-card";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderLoading() {
  return (
    <>
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
      <div className="mt-8">
        <TableSkeleton rows={4} columns={4} />
      </div>
    </>
  );
}

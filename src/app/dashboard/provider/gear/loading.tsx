import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderGearLoading() {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      <Skeleton className="mb-6 h-9 w-80" />
      <TableSkeleton rows={5} columns={5} />
    </>
  );
}

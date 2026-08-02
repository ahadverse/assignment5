import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderOrdersLoading() {
  return (
    <>
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-5 w-72" />
      </div>
      <Skeleton className="mb-6 h-9 w-52" />
      <TableSkeleton rows={5} columns={6} />
    </>
  );
}

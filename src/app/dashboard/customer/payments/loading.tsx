import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerPaymentsLoading() {
  return (
    <>
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-5 w-80" />
      </div>
      <Skeleton className="mb-6 h-9 w-56" />
      <TableSkeleton rows={5} columns={6} />
    </>
  );
}

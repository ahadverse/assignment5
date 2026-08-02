import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerReviewsLoading() {
  return (
    <>
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-5 w-80" />
      </div>
      <TableSkeleton rows={3} columns={3} />
    </>
  );
}

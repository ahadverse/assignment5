import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerOrderLoading() {
  return (
    <>
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-5 w-80" />
      </div>
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-6 h-64 w-full rounded-xl" />
      <Skeleton className="mt-6 h-40 w-full rounded-xl" />
    </>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerOrderPayLoading() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-5 w-80" />
      </div>
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-6 h-72 w-full rounded-xl" />
    </div>
  );
}

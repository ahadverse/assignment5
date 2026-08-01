import { Skeleton } from "@/components/ui/skeleton";

export default function GearDetailLoading() {
  return (
    <div className="container-page py-8">
      <Skeleton className="mb-6 h-4 w-72" />

      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div className="space-y-3">
          <Skeleton className="aspect-4/3 w-full rounded-xl" />
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-18 w-full rounded-xl" />
        </div>
      </div>

      <div className="mt-14 space-y-4">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    </div>
  );
}

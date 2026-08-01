import { GearCardSkeleton } from "@/components/gear/gear-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function GearLoading() {
  return (
    <>
      <section className="border-b bg-card">
        <div className="container-page py-10">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="mt-3 h-5 w-full max-w-md" />
        </div>
      </section>

      <section className="container-page py-8">
        <Skeleton className="mb-6 h-4 w-40" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <GearCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </>
  );
}

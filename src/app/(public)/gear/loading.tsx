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
        <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
          <div className="hidden lg:block">
            <div className="space-y-5 rounded-xl border bg-card p-5">
              <Skeleton className="h-5 w-24" />
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-3.5 w-20" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <Skeleton className="mb-6 h-4 w-40" />
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 9 }).map((_, index) => (
                <GearCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { GearCardSkeleton } from "@/components/gear/gear-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <>
      <section className="border-b">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <Skeleton className="h-7 w-56 rounded-full" />
            <Skeleton className="mt-5 h-12 w-full max-w-lg" />
            <Skeleton className="mt-3 h-12 w-3/4 max-w-md" />
            <Skeleton className="mt-6 h-5 w-full max-w-lg" />
            <Skeleton className="mt-2 h-5 w-2/3 max-w-md" />

            <div className="mt-8 flex flex-wrap gap-3">
              <Skeleton className="h-11 w-36" />
              <Skeleton className="h-11 w-36" />
            </div>

            <div className="mt-10 flex gap-8 border-t pt-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-7 w-16" />
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className={
                    index % 2 === 0
                      ? "aspect-3/4 rounded-2xl"
                      : "mt-8 aspect-3/4 rounded-2xl"
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-2 h-5 w-72" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-xl border bg-card p-5">
              <Skeleton className="size-11 rounded-lg" />
              <Skeleton className="mt-4 h-5 w-24" />
              <Skeleton className="mt-2 h-4 w-full" />
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-14">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-5 w-64" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <GearCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </>
  );
}

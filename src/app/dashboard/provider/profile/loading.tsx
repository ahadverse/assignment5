import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderProfileLoading() {
  return (
    <>
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-5 w-72" />
      </div>
      <div className="mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    </>
  );
}

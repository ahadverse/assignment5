import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderGearEditLoading() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-5 w-96" />
      </div>
      <Skeleton className="h-72 w-full rounded-xl" />
      <Skeleton className="mt-8 h-56 w-full rounded-xl" />
    </div>
  );
}

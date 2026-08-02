"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadError } from "@/components/dashboard/load-error";
import { GearForm } from "@/components/provider/gear-form";
import { useGearDetail, useUpdateGear } from "@/hooks/use-provider-gear";
import { toSpecEntries } from "@/lib/validations/gear";

export function GearEditor({ gearId }: { gearId: string }) {
  const { data: gear, isPending, isError, error, refetch } =
    useGearDetail(gearId);
  const updateGear = useUpdateGear(gearId);

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-56 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <LoadError
          title="We could not load this listing"
          error={error}
          onRetry={() => refetch()}
        />
        <Button asChild variant="outline">
          <Link href="/dashboard/provider/gear">
            <ArrowLeft className="size-4" />
            Back to inventory
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <GearForm
      submitLabel="Save changes"
      defaultValues={{
        name: gear.name,
        brand: gear.brand,
        categoryId: gear.categoryId,
        description: gear.description,
        pricePerDay: Number(gear.pricePerDay),
        condition: gear.condition,
        stock: gear.stock,
        availability: gear.availability,
        images: gear.images ?? [],
        specifications: toSpecEntries(gear.specifications),
      }}
      onSubmit={(payload) => updateGear.mutateAsync(payload)}
    />
  );
}

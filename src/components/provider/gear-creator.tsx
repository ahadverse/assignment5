"use client";

import { GearForm } from "@/components/provider/gear-form";
import { useCreateGear } from "@/hooks/use-provider-gear";

export function GearCreator() {
  const createGear = useCreateGear();

  return (
    <GearForm
      submitLabel="List this gear"
      defaultValues={{
        name: "",
        brand: "",
        categoryId: "",
        description: "",
        pricePerDay: 0,
        condition: "GOOD",
        stock: 1,
        availability: true,
        images: [],
        specifications: [],
      }}
      onSubmit={(payload) => createGear.mutateAsync(payload)}
    />
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequiredMark } from "@/components/shared/required-mark";
import { ImageUrlManager } from "@/components/provider/image-url-manager";
import { SpecEditor } from "@/components/provider/spec-editor";
import { useCategories } from "@/hooks/use-categories";
import { applyApiErrors } from "@/lib/form-errors";
import {
  gearSchema,
  toSpecRecord,
  type GearValues,
} from "@/lib/validations/gear";
import type { GearPayload } from "@/hooks/use-provider-gear";

const FIELDS = [
  "name",
  "brand",
  "categoryId",
  "description",
  "pricePerDay",
  "condition",
  "stock",
  "availability",
  "images",
  "specifications",
] as const;

const conditions = [
  { value: "NEW", label: "New" },
  { value: "GOOD", label: "Good" },
  { value: "FAIR", label: "Fair" },
] as const;

export function GearForm({
  defaultValues,
  submitLabel,
  onSubmit,
}: {
  defaultValues: GearValues;
  submitLabel: string;
  onSubmit: (payload: GearPayload) => Promise<unknown>;
}) {
  const router = useRouter();
  const { data: categories = [], isPending: loadingCategories } =
    useCategories();

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<GearValues>({
    resolver: zodResolver(gearSchema),
    defaultValues,
  });

  async function submit(values: GearValues) {
    try {
      await onSubmit({
        categoryId: values.categoryId,
        name: values.name,
        description: values.description,
        brand: values.brand,
        pricePerDay: values.pricePerDay,
        condition: values.condition,
        stock: values.stock,
        availability: values.availability,
        images: values.images,
        specifications: toSpecRecord(values.specifications),
      });
      router.push("/dashboard/provider/gear");
    } catch (error) {
      const { matched, message } = applyApiErrors(error, setError, FIELDS);
      if (!matched) toast.error("Could not save", { description: message });
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-8" noValidate>
      <section className="space-y-5 rounded-xl border bg-card p-5 sm:p-6">
        <h2 className="font-semibold">Details</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="name">
              Gear name <RequiredMark />
            </FieldLabel>
            <Input
              id="name"
              placeholder="Four season tent"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="brand">
              Brand <RequiredMark />
            </FieldLabel>
            <Input
              id="brand"
              placeholder="MSR"
              aria-invalid={Boolean(errors.brand)}
              {...register("brand")}
            />
            <FieldError errors={[errors.brand]} />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="categoryId">
            Category <RequiredMark />
          </FieldLabel>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={loadingCategories}
              >
                <SelectTrigger
                  id="categoryId"
                  className="w-full"
                  aria-invalid={Boolean(errors.categoryId)}
                >
                  <SelectValue
                    placeholder={
                      loadingCategories ? "Loading..." : "Pick a category"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[errors.categoryId]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="description">
            Description <RequiredMark />
          </FieldLabel>
          <Textarea
            id="description"
            rows={5}
            placeholder="What is included, what condition it is in, anything a renter should know."
            aria-invalid={Boolean(errors.description)}
            {...register("description")}
          />
          <FieldError errors={[errors.description]} />
        </Field>
      </section>

      <section className="space-y-5 rounded-xl border bg-card p-5 sm:p-6">
        <h2 className="font-semibold">Pricing and stock</h2>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="pricePerDay">
              Price per day <RequiredMark />
            </FieldLabel>
            <Input
              id="pricePerDay"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              aria-invalid={Boolean(errors.pricePerDay)}
              {...register("pricePerDay", { valueAsNumber: true })}
            />
            <FieldError errors={[errors.pricePerDay]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="stock">
              Stock <RequiredMark />
            </FieldLabel>
            <Input
              id="stock"
              type="number"
              min={0}
              step="1"
              inputMode="numeric"
              aria-invalid={Boolean(errors.stock)}
              {...register("stock", { valueAsNumber: true })}
            />
            <FieldError errors={[errors.stock]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="condition">Condition</FieldLabel>
            <Controller
              control={control}
              name="condition"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="condition" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.condition]} />
          </Field>
        </div>

        <Controller
          control={control}
          name="availability"
          render={({ field }) => (
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <FieldLabel htmlFor="availability" className="cursor-pointer">
                  Available to rent
                </FieldLabel>
                <p className="text-sm text-muted-foreground">
                  Turn this off to hide the listing without deleting it.
                </p>
              </div>
              <Switch
                id="availability"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>
          )}
        />
      </section>

      <section className="space-y-4 rounded-xl border bg-card p-5 sm:p-6">
        <div>
          <h2 className="font-semibold">
            Images <RequiredMark />
          </h2>
          <p className="text-sm text-muted-foreground">
            Paste image URLs. The first one is used as the cover in the
            catalogue.
          </p>
        </div>
        <Controller
          control={control}
          name="images"
          render={({ field }) => (
            <ImageUrlManager value={field.value} onChange={field.onChange} />
          )}
        />
        <FieldError errors={[errors.images]} />
      </section>

      <section className="space-y-4 rounded-xl border bg-card p-5 sm:p-6">
        <h2 className="font-semibold">Specifications</h2>
        <Controller
          control={control}
          name="specifications"
          render={({ field }) => (
            <SpecEditor value={field.value} onChange={field.onChange} />
          )}
        />
        <FieldError errors={[errors.specifications]} />
      </section>

      <div className="flex flex-wrap justify-end gap-3">
        <Button asChild variant="outline" type="button">
          <Link href="/dashboard/provider/gear">Cancel</Link>
        </Button>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}

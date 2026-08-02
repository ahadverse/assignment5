"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { RequiredMark } from "@/components/shared/required-mark";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-admin-categories";
import { applyApiErrors } from "@/lib/form-errors";
import type { Category } from "@/types";

const categorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required"),
  description: z.string().trim().optional(),
});

type CategoryValues = z.infer<typeof categorySchema>;

export function CategoryFormDialog({ category }: { category?: Category }) {
  const [open, setOpen] = useState(false);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory(category?.id ?? "");

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
    },
  });

  async function submit(values: CategoryValues) {
    try {
      if (category) {
        await updateCategory.mutateAsync(values);
      } else {
        await createCategory.mutateAsync(values);
      }
      setOpen(false);
      reset();
    } catch (error) {
      const { matched, message } = applyApiErrors(error, setError, [
        "name",
        "description",
      ]);
      if (!matched) toast.error("Could not save this category", { description: message });
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        {category ? (
          <Button variant="outline" size="icon" aria-label={`Edit ${category.name}`}>
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="size-4" />
            Add category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Edit category" : "Add category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
          <Field>
            <FieldLabel htmlFor="category-name">
              Name <RequiredMark />
            </FieldLabel>
            <Input
              id="category-name"
              placeholder="Climbing"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="category-description">Description</FieldLabel>
            <Textarea
              id="category-description"
              rows={3}
              placeholder="Ropes, harnesses and protection for rock and crag"
              {...register("description")}
            />
            <FieldError errors={[errors.description]} />
          </Field>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {category ? "Save changes" : "Add category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

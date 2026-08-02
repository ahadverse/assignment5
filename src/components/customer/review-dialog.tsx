"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RatingInput } from "@/components/shared/rating-input";
import { RequiredMark } from "@/components/shared/required-mark";
import { useCreateReview } from "@/hooks/use-reviews";
import { applyApiErrors } from "@/lib/form-errors";
import { reviewSchema, type ReviewValues } from "@/lib/validations/review";
import type { RentalOrder } from "@/types";

const FIELDS = ["rating", "reviewText"] as const;

export function ReviewDialog({
  order,
  size = "sm",
}: {
  order: RentalOrder;
  size?: "sm" | "default";
}) {
  const [open, setOpen] = useState(false);
  const createReview = useCreateReview();

  const {
    control,
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, reviewText: "" },
  });

  async function onSubmit(values: ReviewValues) {
    try {
      await createReview.mutateAsync({
        rentalOrderId: order.id,
        rating: values.rating,
        reviewText: values.reviewText,
      });
      setOpen(false);
      reset();
    } catch (error) {
      const { matched, message } = applyApiErrors(error, setError, FIELDS);
      if (!matched) {
        toast.error("Could not post your review", { description: message });
      }
    }
  }

  const busy = isSubmitting || createReview.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size={size} variant="outline">
          <Star className="size-4" />
          Leave review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>Review {order.gear.name}</DialogTitle>
            <DialogDescription>
              Your review appears on the gear page and helps other renters
              choose.
            </DialogDescription>
          </DialogHeader>

          <div className="my-6 space-y-5">
            <Field>
              <FieldLabel>
                Rating <RequiredMark />
              </FieldLabel>
              <Controller
                control={control}
                name="rating"
                render={({ field }) => (
                  <RatingInput
                    value={field.value}
                    onChange={field.onChange}
                    invalid={Boolean(errors.rating)}
                  />
                )}
              />
              <FieldError errors={[errors.rating]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="reviewText">
                Your review <RequiredMark />
              </FieldLabel>
              <Textarea
                id="reviewText"
                rows={5}
                placeholder="How was the condition? Did pickup go smoothly?"
                aria-invalid={Boolean(errors.reviewText)}
                {...register("reviewText")}
              />
              <FieldError errors={[errors.reviewText]} />
            </Field>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post review"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

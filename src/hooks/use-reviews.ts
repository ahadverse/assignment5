"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { Review } from "@/types";

export interface ReviewDraft {
  rentalOrderId: string;
  rating: number;
  reviewText: string;
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (draft: ReviewDraft) => {
      const { data } = await api.post<Review>("/reviews", draft);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rentals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.gear.all });
      toast.success("Review posted", {
        description: "Thanks for helping other renters choose.",
      });
    },
  });
}

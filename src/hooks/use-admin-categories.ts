"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import type { Category } from "@/types";

export interface CategoryPayload {
  name: string;
  description?: string;
}

function useCategoryInvalidation() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
}

export function useCreateCategory() {
  const invalidate = useCategoryInvalidation();

  return useMutation({
    mutationFn: async (payload: CategoryPayload) => {
      const { data } = await api.post<Category>("/categories", payload);
      return data;
    },
    onSuccess: (category) => {
      invalidate();
      toast.success("Category added", { description: category.name });
    },
    onError: (error) => {
      toast.error("Could not add this category", {
        description: getErrorMessage(error),
      });
    },
  });
}

export function useUpdateCategory(id: string) {
  const invalidate = useCategoryInvalidation();

  return useMutation({
    mutationFn: async (payload: CategoryPayload) => {
      const { data } = await api.patch<Category>(`/categories/${id}`, payload);
      return data;
    },
    onSuccess: (category) => {
      invalidate();
      toast.success("Category updated", { description: category.name });
    },
    onError: (error) => {
      toast.error("Could not update this category", {
        description: getErrorMessage(error),
      });
    },
  });
}

export function useDeleteCategory() {
  const invalidate = useCategoryInvalidation();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`);
      return id;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Category removed");
    },
    onError: (error) => {
      toast.error("Could not remove this category", {
        description: getErrorMessage(error),
      });
    },
  });
}

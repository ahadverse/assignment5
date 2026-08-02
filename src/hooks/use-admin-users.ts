"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, buildQuery, type QueryParams } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import type { User, UserStatus } from "@/types";

export function useAdminUsers(params: QueryParams = {}) {
  return useQuery({
    queryKey: queryKeys.admin.users(params),
    queryFn: async () => {
      const { data, meta } = await api.get<User[]>(
        `/admin/users${buildQuery(params)}`
      );
      return { items: data, meta };
    },
    placeholderData: (previous) => previous,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: UserStatus }) => {
      const { data } = await api.patch<User>(`/admin/users/${id}`, {
        status,
      });
      return data;
    },
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats });
      toast.success(
        user.status === "SUSPENDED" ? "User suspended" : "User activated",
        { description: user.fullName }
      );
    },
    onError: (error) => {
      toast.error("Could not update this user", {
        description: getErrorMessage(error),
      });
    },
  });
}

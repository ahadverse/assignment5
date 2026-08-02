"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";
import type { User } from "@/types";

export interface ProfilePayload {
  fullName: string;
  phone: string;
  address?: string;
  profilePicture?: string;
}

export function useUpdateProfile() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (payload: ProfilePayload) => {
      const { data } = await api.patch<User>("/users/me", payload);
      return data;
    },
    onSuccess: (user) => {
      setUser(user);
      toast.success("Profile updated");
    },
  });
}

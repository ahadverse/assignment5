"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { clearToken, writeToken } from "@/lib/auth-cookie";
import { useAuthStore } from "@/stores/auth-store";
import type { Role, User } from "@/types";
import type { LoginValues, RegisterValues } from "@/lib/validations/auth";

interface AuthPayload {
  user: User;
  token: string;
}

export function dashboardPathFor(role: Role) {
  if (role === "ADMIN") return "/dashboard/admin";
  if (role === "PROVIDER") return "/dashboard/provider";
  return "/dashboard/customer";
}

export function useLogin(redirectTo?: string) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (values: LoginValues) => {
      const { data } = await api.post<AuthPayload>("/auth/login", values);
      return data;
    },
    onSuccess: ({ user, token }) => {
      writeToken(token);
      setUser(user);
      toast.success(`Welcome back, ${user.fullName.split(" ")[0]}`);
      router.replace(redirectTo || dashboardPathFor(user.role));
      router.refresh();
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async ({ confirmPassword, ...values }: RegisterValues) => {
      void confirmPassword;
      const { data } = await api.post<AuthPayload>("/auth/register", values);
      return data;
    },
    onSuccess: ({ user, token }) => {
      writeToken(token);
      setUser(user);
      toast.success("Account create. Welcome to Gear Up.");
      router.replace(dashboardPathFor(user.role));
      router.refresh();
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((state) => state.clearUser);

  return () => {
    clearToken();
    clearUser();
    queryClient.clear();
    toast.success("Signed out");
    router.replace("/");
    router.refresh();
  };
}

"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";
import type { User } from "@/types";

export function AuthProvider({
  user,
  children,
}: {
  user: User | null;
  children: ReactNode;
}) {
  useEffect(() => {
    useAuthStore.setState({ user, hydrated: true });
  }, [user]);

  return <>{children}</>;
}

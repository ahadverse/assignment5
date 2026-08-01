import { cache } from "react";
import { cookies } from "next/headers";
import { TOKEN_COOKIE } from "@/lib/config";
import { serverFetch } from "@/lib/server-api";
import type { User } from "@/types";

export async function getAuthToken() {
  const store = await cookies();
  return store.get(TOKEN_COOKIE)?.value;
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const token = await getAuthToken();
  if (!token) return null;

  try {
    const { data } = await serverFetch<User>("/auth/me", { token });
    return data;
  } catch {
    return null;
  }
});

import { API_URL } from "@/lib/config";
import { ApiError } from "@/lib/api-error";
import type { ApiResponse } from "@/types";
import type { ApiResult } from "@/lib/api-client";

interface ServerFetchOptions extends RequestInit {
  revalidate?: number;
  token?: string;
}

export async function serverFetch<T>(
  path: string,
  options: ServerFetchOptions = {}
): Promise<ApiResult<T>> {
  const { revalidate, token, ...init } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
    ...(revalidate === undefined
      ? { cache: "no-store" as const }
      : { next: { revalidate } }),
  });

  const text = await response.text();
  const body = text ? (JSON.parse(text) as ApiResponse<T>) : null;

  if (!response.ok || !body?.success) {
    throw new ApiError(
      body?.message || "Unable to load data from the server.",
      response.status
    );
  }

  return { data: body.data, meta: body.meta, message: body.message };
}

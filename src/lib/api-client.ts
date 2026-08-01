import { API_URL } from "@/lib/config";
import { readToken } from "@/lib/auth-cookie";
import { ApiError, type FieldIssue } from "@/lib/api-error";
import type { ApiMeta, ApiResponse } from "@/types";

export interface ApiResult<T> {
  data: T;
  meta?: ApiMeta;
  message: string;
}

export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

export function buildQuery(params: QueryParams = {}) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });

  const query = search.toString();
  return query ? `?${query}` : "";
}

async function readBody(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResult<T>> {
  const token = readToken();
  const hasBody = init.body !== undefined;

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      "Cannot reach the GearUp API. Check your connection and try again.",
      0
    );
  }

  const body = (await readBody(response)) as ApiResponse<T> | null;

  if (!response.ok || !body?.success) {
    const issues: FieldIssue[] = (body?.errorDetails ?? []).filter(
      (issue): issue is FieldIssue => Boolean(issue?.path)
    );

    throw new ApiError(
      body?.message || "Request failed. Please try again.",
      response.status,
      issues
    );
  }

  return { data: body.data, meta: body.meta, message: body.message };
}

export const api = {
  get: <T>(path: string, init?: RequestInit) =>
    apiFetch<T>(path, { ...init, method: "GET" }),

  post: <T>(path: string, payload?: unknown, init?: RequestInit) =>
    apiFetch<T>(path, {
      ...init,
      method: "POST",
      body: payload === undefined ? undefined : JSON.stringify(payload),
    }),

  patch: <T>(path: string, payload?: unknown, init?: RequestInit) =>
    apiFetch<T>(path, {
      ...init,
      method: "PATCH",
      body: payload === undefined ? undefined : JSON.stringify(payload),
    }),

  put: <T>(path: string, payload?: unknown, init?: RequestInit) =>
    apiFetch<T>(path, {
      ...init,
      method: "PUT",
      body: payload === undefined ? undefined : JSON.stringify(payload),
    }),

  delete: <T>(path: string, init?: RequestInit) =>
    apiFetch<T>(path, { ...init, method: "DELETE" }),
};

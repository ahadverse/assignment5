import { NextRequest, NextResponse } from "next/server";
import { BACKEND_API_URL } from "@/lib/config";
import { getAuthToken } from "@/lib/auth-server";

type RouteContext = { params: Promise<{ path: string[] }> };

const METHODS_WITH_BODY = new Set(["POST", "PUT", "PATCH"]);

async function proxy(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const token = await getAuthToken();
  const search = request.nextUrl.search;
  const target = `${BACKEND_API_URL}/${path.join("/")}${search}`;

  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let body: string | undefined;
  if (METHODS_WITH_BODY.has(request.method)) {
    body = await request.text();
    if (body) {
      headers.set(
        "Content-Type",
        request.headers.get("content-type") ?? "application/json"
      );
    }
  }

  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });

    const text = await response.text();

    return new NextResponse(text || null, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Cannot reach the GearUp API. Please try again shortly.",
        data: null,
      },
      { status: 502 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;

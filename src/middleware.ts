import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";
import { TOKEN_COOKIE } from "@/lib/config";
import type { Role } from "@/types";

const roleHomes: Record<Role, string> = {
  CUSTOMER: "/dashboard/customer",
  PROVIDER: "/dashboard/provider",
  ADMIN: "/dashboard/admin",
};

const guardedAreas: { prefix: string; role: Role }[] = [
  { prefix: "/dashboard/customer", role: "CUSTOMER" },
  { prefix: "/dashboard/provider", role: "PROVIDER" },
  { prefix: "/dashboard/admin", role: "ADMIN" },
];

function readSession(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) return null;

  try {
    const claims = decodeJwt(token);
    const role = claims.role as Role | undefined;
    const expired = claims.exp ? claims.exp * 1000 < Date.now() : false;

    if (!role || expired) return null;
    return { role };
  } catch {
    return null;
  }
}

function signOutAndRedirect(request: NextRequest, to: URL) {
  const response = NextResponse.redirect(to);
  response.cookies.delete(TOKEN_COOKIE);
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = readSession(request);

  if (pathname.startsWith("/auth")) {
    if (session) {
      return NextResponse.redirect(
        new URL(roleHomes[session.role], request.url)
      );
    }
    return NextResponse.next();
  }

  if (!session) {
    const login = new URL("/auth/login", request.url);
    login.searchParams.set("redirect", `${pathname}${search}`);
    return signOutAndRedirect(request, login);
  }

  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL(roleHomes[session.role], request.url));
  }

  const area = guardedAreas.find((entry) => pathname.startsWith(entry.prefix));
  if (area && area.role !== session.role) {
    return NextResponse.redirect(new URL(roleHomes[session.role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/payment/:path*", "/auth/:path*"],
};

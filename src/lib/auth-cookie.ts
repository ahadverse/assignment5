import { TOKEN_COOKIE, TOKEN_MAX_AGE } from "@/lib/config";

export function readToken() {
  if (typeof document === "undefined") return undefined;

  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${TOKEN_COOKIE}=`));

  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : undefined;
}

export function writeToken(token: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${TOKEN_MAX_AGE}; SameSite=Lax${secure}`;
}

export function clearToken() {
  document.cookie = `${TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

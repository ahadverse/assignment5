import { cookies } from "next/headers";
import { TOKEN_COOKIE } from "@/lib/config";

export async function getAuthToken() {
  const store = await cookies();
  return store.get(TOKEN_COOKIE)?.value;
}

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";
import { dashboardHome } from "@/lib/navigation";

export default async function DashboardIndexPage() {
  const user = await getCurrentUser();
  redirect(user ? dashboardHome(user.role) : "/auth/login?redirect=/dashboard");
}

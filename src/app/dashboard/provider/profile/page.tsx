import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProfileForm } from "@/components/shared/profile-form";
import { getCurrentUser } from "@/lib/auth-server";

export const metadata = { title: "Profile" };

export default async function ProviderProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?redirect=/dashboard/provider/profile");

  return (
    <>
      <PageHeader title="Profile" description="Update your contact details." />
      <ProfileForm user={user} />
    </>
  );
}
